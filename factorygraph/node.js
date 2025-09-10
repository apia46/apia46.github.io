let nodeIdIter = 0;
let nodes = {};

class GraphNode {
	constructor(posX, posY, functionless) {
		if (!functionless) this.id = nodeIdIter++
		this.element = document.createElement("node");
		if (!functionless) this.element.id = this.id;
		this.element.style.setProperty("--posX", posX);
		this.element.style.setProperty("--posY", posY);

		this.dragFunction = ()=>{
			nodeElements.appendChild(this.element); // move it to the top
			drag(this.element, true);
			this.allItems().forEach(item=>{if (item.connection) item.connection.updateLineTo(item)});
			if (this.machineInstance?.connection) this.machineInstance.connection.updatePosition();
		}
		if (!functionless) {
			this.element.addEventListener("mousedown", event=>{
				event.stopPropagation();
				if (document.elementFromPoint(event.clientX, event.clientY).closest(".dontDragNode")) return; // https://stackoverflow.com/questions/16863917/check-if-class-exists-somewhere-in-parent
				previousMouseX = mouseX; previousMouseY = mouseY; wrapper.addEventListener("mousemove", this.dragFunction);
				this.element.classList.add("dragged");
			});
			wrapper.addEventListener("mouseup", ()=>{
				wrapper.removeEventListener("mousemove", this.dragFunction);
				this.element.classList.remove("dragged");
			});
			wrapper.addEventListener("mouseleave", ()=>{
				wrapper.removeEventListener("mousemove", this.dragFunction);
				this.element.classList.remove("dragged");
			});
			this.element.insertAdjacentHTML("beforeend", `<div class="delete">X</div>`);
			this.element.querySelector(".delete").addEventListener("click", ()=>{this.remove()});
		}
	}

	static getFromElement(element) {
		return nodes[Number(element.id)];
	}

	attachToGraph() {
		nodeElements.appendChild(this.element);
		this.network = new Network(this);
		nodes[this.id] = this;
	}

	remove() {
		this.allItems().forEach(item=>{
			if (item.connection) item.connection.removeConnectionTo(item);
		});
		this.element.remove();
		delete nodes[this.id];
		this.network.nodes.splice(this.network.nodes.findIndex(check=>check===this), 1);
	}

	unvisitedConnectedNodesAndConnections(visitId) {
		let connections = [];
		let nodes = [];
		this.allItems().forEach(item=>{
			if (item.connection && !item.connection.visitId) {
				connections.push(item.connection);
				item.connection.visitId = visitId;
				item.connection.getAllExcept(item).forEach(otherItem=>{
					if (!otherItem.node.visitId) nodes.push(otherItem.node);
					otherItem.node.visitId = visitId;
				});
			}
		});
		if (this.machineInstance?.connection && !this.machineInstance.connection.visitId) {
			connections.push(this.machineInstance.connection);
			this.machineInstance.connection.visitId = visitId;
			this.machineInstance.connection.getAllExcept(this.machineInstance).forEach(otherMachineInstance=>{
				if (!otherMachineInstance.node.visitId) nodes.push(otherMachineInstance.node);
				otherMachineInstance.node.visitId = visitId;
			});
		}
		return [nodes, connections];
	}

	allItems() { return [] }
}

class ItemNode extends GraphNode {
	constructor(posX, posY, itemId, functionless) {
		super(posX, posY, functionless);
		this.element.insertAdjacentHTML("beforeend", `
			<div class="right-side">
				<div class="number-container"><input type="numeric" placeholder="unconstrained" class="quantity"></input><span>${data.items[itemId].unit||""}</span></div>
				<label><input type="checkbox" class="constrain"></label>
				<span class="error">\uf06a</span>
				<button class="flipper">\uf2f1</button>
			</div>
		`);
		const quantityInput = this.element.querySelector(".quantity");
		this.item = new Item(itemId, null, itemIdIter++, this, null, functionless);
		quantityInput.classList.add("dontDragNode");
		quantityInput.addEventListener("input", ()=>{
			this.constrained = true;
			this.element.querySelector(".constrain").checked = true;
			quantityInput.placeholder = "0";
		});
		quantityInput.addEventListener("input", ()=>{
			this.item.quantity = Number(this.element.querySelector(".quantity").value)||0;
			this.network.updateSolve();
		});
		this.element.querySelector(".constrain").addEventListener("click", ()=>{
			this.constrained = this.element.querySelector(".constrain").checked;
			quantityInput.placeholder = this.constrained?"0":"unconstrained";
			this.network.updateSolve();
		});
		this.element.querySelector(".flipper").addEventListener("click",()=>{
			this.element.classList.toggle("flipped");
			this.allItems().forEach(item=>{if (item.connection) item.connection.updateLineTo(item)});
		});
		this.element.insertBefore(this.item.element, this.element.firstChild);
		this.element.classList.add("itemNode");
	}

	displayGood() {
		this.element.querySelector(".error").removeAttribute("name");
		if (!this.constrained) this.element.querySelector(".quantity").value = this.item.quantity;
	}

	displayBad(error) {
		this.element.querySelector(".error").setAttribute("name", error);
	}

	allItems() { return [this.item] }
}

class RecipeNode extends GraphNode {
	showingMultiplied = false;

	constructor(posX, posY, recipeId, functionless) {
		super(posX, posY, functionless);
		this.recipeData = data.recipes[recipeId];
		this.recipeId = recipeId;
		this.machine = new Machine(this.recipeData.machines[0]);
		this.element.insertAdjacentHTML("beforeend", `
			<div class="inputs"></div>
			<div class="recipe-arrow"></div>
			<div class="outputs"></div>
		`);
		this.machineInstance = this.machine.newInstance(this, this.recipeData.machines, functionless);
		this.element.appendChild(this.machineInstance.element);

		const inputs = this.element.querySelector(".inputs");
		this.inputs = this.recipeData.inputs.map(([itemId, quantity], index) => {
			const item = new Item(itemId, "inputs", itemIdIter++, this, index, functionless);
			item.quantity = quantity;
			inputs.appendChild(item.element);
			return item;
		});
		const outputs = this.element.querySelector(".outputs");
		this.outputs = this.recipeData.outputs.map(([itemId, quantity], index) => {
			const item = new Item(itemId, "outputs", itemIdIter++, this, index, functionless);
			item.quantity = quantity;
			outputs.appendChild(item.element);
			return item;
		});
		this.element.setAttribute("recipeId", recipeId);
		this.element.classList.add("recipeNode");
	}

	attachToGraph() {
		super.attachToGraph();
		this.displayBaseCase();
		this.machine.network = this.network;
		this.network.machines.push(this.machine);
	}

	remove() {
		this.machineInstance.remove();
		super.remove();
	}

	displayBaseCase() {
		this.showingMultiplied = false;
		this.machineInstance.element.setAttribute("amount", `${formatNumber(this.recipeData.time/this.machine.machineData.speed, 3)}s`);
		this.machineInstance.element.setAttribute("accurateAmount", `${formatNumber(this.recipeData.time/this.machine.machineData.speed, 6)}s per recipe
	<br>from ${this.recipeData.time}s base
	<br>and ${this.machine.machineData.speed} machine speed`);
		this.allItems().forEach(item=>{
			item.element.setAttribute("quantity", `${item.quantity}${item.unit}`);
			item.element.setAttribute("accurateQuantity", `${item.quantity}${item.unit}`);
		});
	}

	displayMultipliedCase() {
		this.showingMultiplied = true;
		this.machineInstance.element.setAttribute("amount", "x" + formatNumber(this.machineInstance.quantity));
		this.machineInstance.element.setAttribute("accurateAmount", `${formatNumber(this.machineInstance.quantity, 6)} machines`);
		this.allItems().forEach(item=>{
			item.multipliedQuantity = throughput(item) * this.machineInstance.quantity;
			item.element.setAttribute("quantity", `${formatNumber(item.multipliedQuantity)}${item.unit}`);
			item.element.setAttribute("accurateQuantity", `${formatNumber(item.multipliedQuantity, 6)}${item.unit}/s`);
		});
	}

	allItems() { return [...this.inputs, ...this.outputs] }
}

class MachineNode extends GraphNode {
	constructor(posX, posY, machine) {
		super(posX, posY);
		this.machine = machine;
		this.element.insertAdjacentHTML("beforeend", `
			<div class="right-side">
				<div class="number-container"><span>x</span><input type="numeric" placeholder="unconstrained" class="quantity"></input></div>
				<label><input type="checkbox" class="constrain"></label>
				<span class="error">\uf06a</span>
				<button class="flipper">\uf2f1</button>
			</div>
		`);
		this.machineInstance = new MachineInstance(this.machine, "main", this);
		this.element.insertBefore(this.machineInstance.element, this.element.firstChild);

		this.options = this.element.appendChild(this.machineInstance.createOptions());

		const quantityInput = this.element.querySelector(".quantity");
		quantityInput.classList.add("dontDragNode");
		quantityInput.addEventListener("input", ()=>{
			this.constrained = true;
			this.element.querySelector(".constrain").checked = true;
			quantityInput.placeholder = "0";
		});
		quantityInput.addEventListener("input", ()=>{
			this.machineInstance.quantity = Number(this.element.querySelector(".quantity").value)||0;
			this.network.updateSolve();
		});
		this.element.querySelector(".constrain").addEventListener("click", ()=>{
			this.constrained = this.element.querySelector(".constrain").checked;
			quantityInput.placeholder = this.constrained?"0":"unconstrained";
			this.network.updateSolve();
		});
		this.element.querySelector(".flipper").addEventListener("click",()=>{
			this.element.classList.toggle("flipped");
			this.machineInstance.connection.updatePosition();
		});

		this.element.classList.add("machineNode");
	}

	changeTo(machineId, from) {
		this.options.querySelector(`[machineId=${from}]`).classList.remove("selected");
		this.options.querySelector(`[machineId=${machineId}]`).classList.add("selected");
		this.machineInstance.element.style.setProperty("--image", `url('${this.machine.machineData.image}')`);
		this.machineInstance.element.setAttribute("name", this.machine.machineData.name);
	}

	displayGood() {
		this.element.querySelector(".error").removeAttribute("name");
		if (!this.constrained) this.element.querySelector(".quantity").value = this.machineInstance.quantity;
	}

	displayBad(error) {
		this.element.querySelector(".error").setAttribute("name", error);
	}

	remove() {
		this.machineInstance.remove();
		super.remove();
	}
}
