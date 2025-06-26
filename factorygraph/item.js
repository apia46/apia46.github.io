class Item {
    node;

    constructor(id, type, index, functionless) {
        this.id = id;
        this.type = type;
        this.index = index;
        var itemData = data.items[id];
        this.element = document.createElement("item");
        this.element.style.setProperty("--image", `url('${itemData.image}')`);
        if (itemData.imageModulation) this.element.style.setProperty("--imageModulation", itemData.imageModulation);
        if (itemData.imageOverlay) this.element.style.setProperty("--imageOverlay", `url('${itemData.imageOverlay}')`);
        if (!functionless) this.element.addEventListener("mousedown", event=>{event.stopPropagation(); startConnection(itemElement);});
        this.element.setAttribute("name", itemData.name);
        this.element.setAttribute("id", id);
        this.element.setAttribute("type", type);
        this.element.setAttribute("index", index);
    }
}