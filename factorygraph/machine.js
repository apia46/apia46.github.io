class Machine {
	instances = [];
	constructor(machineId) {
		this.machineId = machineId;
		this.machineData = data.machines[machineId];
	}
	
	newInstance(optionIds, functionless) {
		let instance = new MachineInstance(this, optionIds, functionless);
		this.instances.push(instance);
		return instance;
	}

	changeTo(machineId) {
		this.machineData = data.machines[machineId];
		this.instances.forEach(instance=>{
			instance.options.querySelector(`[machineId=${this.machineId}]`).classList.remove("selected");
			instance.options.querySelector(`[machineId=${machineId}]`).classList.add("selected");
			instance.element.setAttribute("name", this.machineData.name);
			instance.element.style.setProperty("--image", `url('${this.machineData.image}')`);
		});
		this.machineId = machineId;
	}
}

class MachineInstance {
	constructor(machine, optionIds, functionless) {
		this.machine = machine;
		this.element = document.createElement("machine");
		this.element.style.setProperty("--image", `url('${machine.machineData.image}')`);
		this.element.setAttribute("name", machine.machineData.name);
		if (!functionless) {
			this.options = document.createElement("div");
			this.options.classList.add("machine-options");
			this.element.appendChild(this.options);
			optionIds.forEach(id=>{
				let option = data.machines[id];
				let optionElement = document.createElement("div");
				optionElement.classList.add("option");
				optionElement.setAttribute("machineId", id);
				optionElement.setAttribute("name", option.name);
				optionElement.style.setProperty("--image", `url("${option.image}")`);
				optionElement.addEventListener("click", ()=>{
					this.machine.changeTo(id);
				});
				this.options.appendChild(optionElement);
			});
			this.options.firstChild.classList.add("selected");
		}
	}
}