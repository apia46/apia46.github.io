let connectionIdIter = 0;
let connections = {};

class DraggedLine {
	constructor(startInstance, endFunction, positionFunction=getGraphPositionFromCenter) {
		this.element = document.createElement("line");
		this.element.classList.add("dragged");
		const [startX, startY] = positionFunction(startInstance.element);
		this.element.style.setProperty("--aX", startX);
		this.element.style.setProperty("--aY", startY);
		this.element.style.setProperty("--bX", startX);
		this.element.style.setProperty("--bY", startY);
		lineElements.appendChild(this.element);
		const scale = Number(wrapper.style.getPropertyValue("--scale")||1);
		previousMouseX = startX * scale + (Number(wrapper.style.getPropertyValue('--posX')||0)) + wrapper.offsetLeft;
		previousMouseY = startY * scale + (Number(wrapper.style.getPropertyValue('--posY')||0)) + wrapper.offsetTop;
		const dragFunction = ()=>{
			drag(this.element, true, "--b");
		}
		const dragEndFunction = ()=>{
			wrapper.removeEventListener("mousemove", dragFunction);
			wrapper.removeEventListener("mouseup", dragEndFunction);
			wrapper.removeEventListener("mouseleave", dragEndFunction);
			endFunction(document.elementFromPoint(mouseX, mouseY));
			this.element.remove();
		}
		wrapper.addEventListener("mousemove", dragFunction);
		wrapper.addEventListener("mouseup", dragEndFunction);
		wrapper.addEventListener("mouseleave", dragEndFunction);
		dragFunction();
	}
}

class Connection {
	// we work with ""perpendicular"" ("perp") and ""parallel"" ("para") coordinates; defined relative to direction
	
	inputs = [];
	inputLines = [];
	outputs = [];
	outputLines = [];
	direction = "vertical";
	itemNodeItem; itemNodeLine;
	network;

	constructor(...items) {
		this.id = connectionIdIter++;
		this.contentId = items[0].contentId;
		this.network = items[0].node.network;
		this.network.connections.push(this);
		this.element = document.createElement("connection");
		this.element.setAttribute("connectionId", this.id);
		this.element.classList.add(this.direction);
		lineElements.appendChild(this.element);
		connections[this.id] = this;
		items.forEach(item=>this.connectTo(item));
		this.element.addEventListener("mousedown", event=>{this.startDrag()});
		this.calculateDefaultPerpendicularCoordinate();
		this.calculateParallelBounds();
	}

	startDrag() {
		previousMouseX = mouseX;
		previousMouseY = mouseY;
		this.element.style.setProperty("--dragX", 0);
		this.element.style.setProperty("--dragY", 0);
		const dragFunction = ()=>{
			const [dragX, dragY] = drag(this.element, true, "--drag", true);
			const dragPerp = this.direction=="vertical"?dragX:dragY;
			const dragPara = this.direction=="vertical"?dragY:dragX;
			this.element.style.setProperty("--perpC", Number(this.element.style.getPropertyValue("--perpC")||0) + dragPerp);
			if (Math.abs(dragPara) - Math.abs(dragPerp) > 2 / Number(wrapper.style.getPropertyValue("--scale")||1)) {
				const [mouseGridX, mouseGridY] = mouseRelativeToGrid();
				this.swapDirection(this.direction=="vertical"?mouseGridY:mouseGridX);
			}
		}
		const dragEndFunction = ()=>{
			wrapper.removeEventListener("mousemove", dragFunction);
			wrapper.removeEventListener("mouseup", dragEndFunction);
			wrapper.removeEventListener("mouseleave", dragEndFunction);
			this.element.classList.remove("dragging");
		}
		wrapper.addEventListener("mousemove", dragFunction);
		wrapper.addEventListener("mouseup", dragEndFunction);
		wrapper.addEventListener("mouseleave", dragEndFunction);
		this.element.classList.add("dragging");
		dragFunction();
	}

	connectTo(item) {
		item.connection = this;
		const element = document.createElement("line");
		const [toX, toY] = getGraphPositionFromCenter(item.element);
		element.style.setProperty("--toX", toX);
		element.style.setProperty("--toY", toY);
		element.classList.add(item.type);
		this.element.appendChild(element);
		element.addEventListener("click",event=>{event.stopPropagation(); this.removeConnectionTo(item)});
		if (item.type == "inputs") {
			this.inputs.push(item);
			this.inputLines.push(element);
		} else {
			this.outputs.push(item);
			this.outputLines.push(element);
		}
		this.calculateParallelBounds();
		item.node.network.joinTo(this.network);
	}

	addItemNode(item) {
		item.connection = this;
		this.itemNodeItem = item;
		this.itemNodeLine = document.createElement("line");
		this.itemNodeLine.classList.add("toItemNode");
		const [toX, toY] = getGraphPositionFromCenter(item.element);
		this.itemNodeLine.style.setProperty("--toX", toX);
		this.itemNodeLine.style.setProperty("--toY", toY);
		this.element.appendChild(this.itemNodeLine);
		this.calculateParallelBounds();
		item.node.network.joinTo(this.network);
	}

	updateLineTo(item) {
		var element = item.node instanceof RecipeNode?[...this.inputLines, ...this.outputLines][[...this.inputs, ...this.outputs].findIndex(check=>check===item)]:this.itemNodeLine;
		const [toX, toY] = getGraphPositionFromCenter(item.element);
		element.style.setProperty("--toX", toX);
		element.style.setProperty("--toY", toY);
		this.calculateParallelBounds();
	}

	remove() {
		this.element.remove();
		[...this.inputLines, ...this.outputLines].forEach(element=>element.remove());
		[...this.inputs, ...this.outputs].forEach(item=>delete item.connection);
		delete connections[this.id];
		if (this.itemNodeItem) {
			delete this.itemNodeItem.connection;
			this.itemNodeLine.remove();
			delete this.itemNodeItem;
			delete this.itemNodeLine;
		}
		this.network.connections.splice(this.network.connections.findIndex(check=>check===this), 1);
		this.network.findDisconnected();
	}

	removeConnectionTo(item) {
		delete item.connection;
		if (item.node instanceof ItemNode) {
			this.itemNodeLine.remove();
			delete this.itemNodeItem;
			delete this.itemNodeLine;
		} else if (item.type == "inputs") {
			const index = this.inputs.findIndex(check=>check===item);
			this.inputLines[index].remove();
			this.inputs.splice(index, 1);
			this.inputLines.splice(index, 1);
		}
		else {
			const index = this.outputs.findIndex(check=>check===item);
			this.outputLines[index].remove();
			this.outputs.splice(index, 1);
			this.outputLines.splice(index, 1);
		}
		if (this.inputs.length + this.outputs.length < 2) return this.remove();
		this.calculateParallelBounds();
		this.network.findDisconnected();
	}

	calculateDefaultPerpendicularCoordinate() {
		// designed for many connections but only ever called when there are two
		const inputCoordinates = this.perpendicularComponents(this.inputs.map(item=>getGraphPositionFromCenter(item.element)));
		const outputCoordinates = this.perpendicularComponents(this.outputs.map(item=>getGraphPositionFromCenter(item.element)));
		if (inputCoordinates.length == 0) return this.element.style.setProperty("--perpC", Math.max(...outputCoordinates) + 48);
		else if (outputCoordinates.length == 0) return this.element.style.setProperty("--perpC", Math.min(...inputCoordinates) - 48);
		else if ((Math.min(...inputCoordinates) > Math.max(outputCoordinates)) != (Math.max(...inputCoordinates) > Math.min(outputCoordinates))) {
			// not all on differing sides no matter where the line is drawn
			// there is an easier way of doing this but this is equivalent probably and also looks cooler
			this.element.style.setProperty("--perpC", [...inputCoordinates, ...outputCoordinates].reduce((total,current)=>total+current)/(inputCoordinates.length + outputCoordinates.length));
		} else if (Math.min(...inputCoordinates) > Math.max(outputCoordinates)) this.element.style.setProperty("--perpC", (Math.min(...inputCoordinates) + Math.max(outputCoordinates)) * 0.5);
		else this.element.style.setProperty("--perpC", (Math.max(...inputCoordinates) + Math.min(outputCoordinates)) * 0.5);
	}

	calculateParallelBounds() {
		const parallelComponents = this.parallelComponents([...this.inputs, ...this.outputs].map(item=>getGraphPositionFromCenter(item.element)));
		this.element.style.setProperty("--paraMin", Math.min(...parallelComponents));
		this.element.style.setProperty("--paraMax", Math.max(...parallelComponents));
		if (this.itemNodeLine) this.itemNodeLine.style.setProperty("--paraC", (Math.min(...parallelComponents) + Math.max(...parallelComponents))*0.5);
	}

	swapDirection(overridePerpendicularCoordinate) {
		this.element.classList.remove(this.direction);
		this.direction = this.direction=="vertical"?"horizontal":"vertical";
		this.element.classList.add(this.direction);
		if (overridePerpendicularCoordinate || overridePerpendicularCoordinate===0) this.element.style.setProperty("--perpC", overridePerpendicularCoordinate);
		else this.calculateDefaultPerpendicularCoordinate();
		this.calculateParallelBounds();
	}

	parallelComponents(coordinates) { return coordinates.map(coordinate=>coordinate[this.direction=="vertical"?1:0]); }
	perpendicularComponents(coordinates) { return coordinates.map(coordinate=>coordinate[this.direction=="vertical"?0:1]); }

	getAllExcept(item) {
		if (this.itemNodeItem) return [...this.inputs, ...this.outputs, this.itemNodeItem].filter(checkItem=>checkItem!==item);
		else return [...this.inputs, ...this.outputs].filter(checkItem=>checkItem!==item);
	}
	
	static getFromElement(element) {
		return connections[element.getAttribute("connectionId")];
	}
}

function mouseRelativeToGrid() {
	const scale = Number(wrapper.style.getPropertyValue("--scale")||1);
	return [(mouseX - graph.offsetLeft) / scale, (mouseY - graph.offsetTop) / scale];
}

class DirectConnection {
	// a direct connection between a recipenode item and an itemnode item or whatever. constrains the network
	constructor(source, destination, sourceNetwork, destinationNetwork, plural) {
		this.source = source;
		this.destination = destination;
		this.plural = plural;
		if (plural) {
			source.connections.push(this);
			destination.connections.push(this);
		} else {
			source.connection = this;
			destination.connection = this;
		}
		this.network = sourceNetwork;
		this.network.connections.push(this);
		destinationNetwork.joinTo(sourceNetwork);
		this.element = document.createElement("line");
		this.element.addEventListener("click", ()=>{this.remove()});
		this.updatePosition();
		lineElements.appendChild(this.element);
	}

	remove() {
		if (this.plural) {
			this.source.connections.splice(this.source.connections.findIndex(check=>check===this), 1);
			this.destination.connections.splice(this.destination.connections.findIndex(check=>check===this), 1);
		} else {
			delete this.source.connection;
			delete this.destination.connection;
		}
		this.element.remove();
		this.network.connections.splice(this.network.connections.findIndex(check=>check===this), 1);
		this.network.findDisconnected();
	}

	updatePosition() {
		const [aX, aY] = getGraphPositionFromCenter(this.source.element);
		const [bX, bY] = getGraphPositionFromCenter(this.destination.element);
		this.element.style.setProperty("--aX", aX);
		this.element.style.setProperty("--aY", aY);
		this.element.style.setProperty("--bX", bX);
		this.element.style.setProperty("--bY", bY);
	}

	getAllExcept(item) {
		return [this.source, this.recipeItem].filter(checkItem=>checkItem!==item);
	}

	updateLineTo() { this.updatePosition() }
	removeConnectionTo() { this.remove() } // kind of a hack but it works so
}

class DirectItemConnection extends DirectConnection {
	constructor(itemItem, recipeItem) {
		super(itemItem, recipeItem, itemItem.node.network, recipeItem.node.network);
	}
}

class DirectMachineConnection extends DirectConnection {
	constructor(mainInstance, referenceInstance) {
		super(mainInstance, referenceInstance, mainInstance.node.network, referenceInstance.node.network, true);
		referenceInstance.attachTo(mainInstance.machine);
		this.element.classList.add("directMachineConnection");
	}

	updatePosition() { // other way around because we want to shorten to source. jank
		const [aX, aY] = getGraphPositionFromCenter(this.destination.element);
		const [bX, bY] = getGraphPositionFromCenter(this.source.element);
		this.element.style.setProperty("--aX", aX);
		this.element.style.setProperty("--aY", aY);
		this.element.style.setProperty("--bX", bX);
		this.element.style.setProperty("--bY", bY);
		
		let theta = 0.785398163 - abs(0.785398163 - abs(1.57079633 - abs(Math.atan2(aX-bX, aY-bY))));
		this.element.style.setProperty("--shortenBy", 32 / Math.cos(theta));
	}

	remove() {
		this.destination.disconnect();
		super.remove();
		if (this.source.machine.referenceInstances.length == 0) this.source.machine.remove();
	}
}

class MachineConnection { // has to be a single object for the solver to be happy
	referenceInstances = [];
	elements = [];
	
	constructor(mainInstance, referenceInstance) {
		this.mainInstance = mainInstance;
		mainInstance.connection = this;
		this.network = mainInstance.machine.network;
		this.network.connections.push(this);
		this.connectTo(referenceInstance);
	}

	connectTo(referenceInstance) {
		this.referenceInstances.push(referenceInstance);
		referenceInstance.attachTo(this.mainInstance.machine);
		referenceInstance.connection = this;
		let element = document.createElement("line");
		element.addEventListener("click", ()=>{this.disconnectTo(referenceInstance)});
		element.classList.add("directMachineConnection");
		lineElements.appendChild(element);
		this.elements.push(element);
		this.updatePosition();
		referenceInstance.node.network.joinTo(this.network);
	}

	disconnectTo(referenceInstance) {
		console.log(referenceInstance);
		let index = this.referenceInstances.findIndex(check=>check===referenceInstance);
		this.referenceInstances[index].disconnect();
		this.referenceInstances.splice(index, 1);
		this.elements[index].remove();
		this.elements.splice(index, 1);
		if (this.referenceInstances.length == 0) this.mainInstance.machine.remove();
		this.network.findDisconnected();
	}

	remove() {
		this.referenceInstances.forEach((instance, index)=>{
			instance.disconnect(true);
			this.elements[index].remove();
		});
		this.network.findDisconnected();
	}

	updatePosition() {
		const [bX, bY] = getGraphPositionFromCenter(this.mainInstance.element);
		this.elements.forEach((element, i)=>{
			let instance = this.referenceInstances[i];
			const [aX, aY] = getGraphPositionFromCenter(instance.element);
			element.style.setProperty("--aX", aX);
			element.style.setProperty("--aY", aY);
			element.style.setProperty("--bX", bX);
			element.style.setProperty("--bY", bY);

			let theta = 0.785398163 - abs(0.785398163 - abs(1.57079633 - abs(Math.atan2(aX-bX, aY-bY))));
			element.style.setProperty("--shortenBy", 32 / Math.cos(theta));
		});
	}

	getAllExcept(instance) {
		return [this.mainInstance, ...this.referenceInstances].filter(checkInstance=>checkInstance!==instance);
	}
}
