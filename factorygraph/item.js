class Item {
    baseQuantity;

    constructor(contentId, type, instanceId, node, nodeIndex, functionless) {
        this.contentId = contentId;
        this.type = type;
        this.instanceId = instanceId;
        this.nodeIndex = nodeIndex;
        this.node = node;
        var itemData = data.items[contentId];
        this.element = document.createElement("item");
        this.element.style.setProperty("--image", `url('${itemData.image}')`);
        if (itemData.imageModulation) this.element.style.setProperty("--imageModulation", itemData.imageModulation);
        if (itemData.imageOverlay) this.element.style.setProperty("--imageOverlay", `url('${itemData.imageOverlay}')`);
        if (!functionless) this.element.addEventListener("mousedown", event=>{event.stopPropagation(); startConnection(this.element);});
        this.element.setAttribute("name", itemData.name);
        this.element.setAttribute("instanceId", instanceId);
        this.element.setAttribute("type", type);
        this.element.setAttribute("nodeIndex", nodeIndex);
    }
}