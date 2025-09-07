/*
the reason we need both this and a machinenode is because if a node isnt expanded then there is no machinenode
so basic functionality and calculations shouldnt be dependent on it
*/
let machineIdIter = 0;
class Machine {
	referenceInstances = [];
	constructor(machineId) {
		this.id = machineIdIter++;
		this.machineId = machineId;
		this.machineData = data.machines[machineId];
	}
	
	newInstance(node, optionIds, functionless) {
		this.optionIds = optionIds;
		let instance = new MachineInstance(this, "reference", node, functionless);
		this.referenceInstances.push(instance);
		return instance;
	}

	changeTo(machineId) {
		this.machineData = data.machines[machineId];
		this.referenceInstances.forEach(instance=>{
			instance.options.querySelector(`[machineId=${this.machineId}]`).classList.remove("selected");
			instance.options.querySelector(`[machineId=${machineId}]`).classList.add("selected");
			instance.element.setAttribute("name", this.machineData.name);
			instance.element.style.setProperty("--image", `url('${this.machineData.image}')`);
		});
		if (this.node) this.node.changeTo(machineId, this.machineId);
		this.machineId = machineId;
		this.network.updateSolve();
	}

	remove() {
		this.network.machines.splice(this.network.machines.findIndex(check=>check===this), 1);
		if (this.node) this.node.remove();
	}

	pullout(instance) { // create from pulling out
		let [posX, posY] = getGraphPositionFromTopleft(instance.options);

		this.node = new MachineNode(posX+18, posY-90, this);
		this.node.attachToGraph();
		this.node.network.joinTo(this.network);
		previousMouseX = mouseX;
		previousMouseY = mouseY;
		wrapper.addEventListener("mousemove", this.node.dragFunction);
		this.node.element.classList.add("dragged");
		new MachineConnection(this.node.machineInstance, instance);
		instance.element.classList.add("attached");
		instance.element.classList.add("pulling");
		setTimeout(()=>{
			instance.element.classList.remove("pulling");
		}, 1);
		this.node.changeTo(this.machineId, this.optionIds[0]);
	}

	copyTo(instance) {
		let machine = new Machine(this.machineId);
		machine.optionIds = instance.node.recipeData.machines;
		machine.network = this.network;
		this.network.machines.push(machine);
		machine.changeTo(this.machineId);
		machine.referenceInstances.push(instance);
		return machine;
	}
}

let machineInstanceIdIter = 0;
let machineInstances = {};
class MachineInstance {
	connection;

	constructor(machine, type, node, functionless) {
		this.machine = machine;
		this.type = type;
		this.node = node;
		if (!functionless) {
			this.id = machineInstanceIdIter++;
			machineInstances[this.id] = this;
		}
		this.element = document.createElement("machineInstance");
		if (!functionless) {
			this.element.setAttribute("instanceId", this.id);
			this.element.addEventListener("mousedown", event=>{
				event.stopPropagation();
				if (document.elementFromPoint(event.clientX, event.clientY).closest(".dontDragMachineInstance")) return;
				this.dragConnection();
			});
		}
		this.element.style.setProperty("--image", `url('${machine.machineData.image}')`);
		this.element.setAttribute("name", machine.machineData.name);
		if (type == "reference" && !functionless) {
			this.options = this.createOptions(machine);
			this.element.appendChild(this.options);
			var pullout = document.createElement("div");
			pullout.classList.add("pullout");
			pullout.addEventListener("mousedown", event=>{
				event.stopPropagation();
				this.machine.pullout(this);
			});
			this.options.prepend(pullout);
		}
	}

	createOptions() {
		let options = document.createElement("div");
		options.classList.add("machine-options");
		options.classList.add("dontDragNode");
		options.classList.add("dontDragMachineInstance");
		this.machine.optionIds.forEach(id=>{
			let option = data.machines[id];
			let optionElement = document.createElement("div");
			optionElement.classList.add("option");
			optionElement.setAttribute("machineId", id);
			optionElement.setAttribute("name", option.name);
			optionElement.style.setProperty("--image", `url("${option.image}")`);
			optionElement.addEventListener("click", ()=>{
				this.machine.changeTo(id);
			});
			options.appendChild(optionElement);
		});
		options.children[0].classList.add("selected");
		return options;
	}

	remove() {
		this.element.remove();
		delete machineInstances[this.id];
		if (this.type == "reference") this.connection.disconnectTo(this);
		else this.connection.remove();
		this.machine.referenceInstances.splice(this.machine.referenceInstances.findIndex(check=>check===this), 1);
	}

	disconnect(dontBother) {
		this.machine.referenceInstances.splice(this.machine.referenceInstances.findIndex(check=>check===this), 1);
		this.machine = this.machine.copyTo(this);
		this.node.machine = this.machine;
		delete this.connection;
		this.element.classList.remove("attached");
		if (!dontBother) this.machine.network.updateSolve();
	}

	attachTo(machine) {
		this.element.classList.add("attached");
		if (this.machine != machine) {
			this.machine.remove();
			machine.referenceInstances.push(this);
			this.machine = machine;
			this.node.machine = machine;
		}
	}

	dragConnection() {
		this.element.classList.add("connecting");
		new DraggedLine(this, resultElement=>{
			this.element.classList.remove("connecting");
			if (resultElement == this.element) return;
			if (resultElement?.nodeName == "MACHINEINSTANCE") {
				const toInstance = MachineInstance.getFromElement(resultElement);
				if (this.machine.machineId == toInstance.machine.machineId) {
					if (this.type == toInstance.type) return;
					else if (this.type == "main" && !toInstance.connection) this.connection.connectTo(toInstance);
					else if (toInstance.type == "main" && !this.connection) toInstance.connection.connectTo(this);
				}
			}
		});
	}

	static getFromElement(element) {
		return machineInstances[element.getAttribute("instanceId")];
	}
}
