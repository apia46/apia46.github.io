class Modifier {
	constructor(modifierId) {
		this.modifierId = modifierId;
		this.modifierData = data.modifiers[modifierId];
		this.element = document.createElement("modifier");
		this.element.style.setProperty("--image", `url('${this.modifierData.image}')`);
	}
}