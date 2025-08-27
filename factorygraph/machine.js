class Machine {
	elements = [];
	constructor(machineId) {
		this.machineId = machineId;
		this.machineData = data.machines[machineId];
	}
	
	newElement() {
		let element = document.createElement("machine");
		element.style.setProperty("--image", `url('${this.machineData.image}')`);
		element.setAttribute("name", this.machineData.name);
		this.elements.push(element);
		return element;
	}
}