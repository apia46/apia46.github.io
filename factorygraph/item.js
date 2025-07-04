let itemIdIter = 0;

class Item {
    baseQuantity;
    connection;

    constructor(contentId, type, instanceId, node, nodeIndex, functionless) {
        this.contentId = contentId;
        this.type = type;
        this.instanceId = instanceId;
        this.nodeIndex = nodeIndex;
        this.node = node;
        const itemData = data.items[contentId];
        this.unit = itemData.unit||"";
        this.element = document.createElement("item");
        this.element.style.setProperty("--image", `url('${itemData.image}')`);
        if (itemData.imageModulation) this.element.style.setProperty("--imageModulation", itemData.imageModulation);
        if (itemData.imageOverlay) this.element.style.setProperty("--imageOverlay", `url('${itemData.imageOverlay}')`);
        if (!functionless) this.element.addEventListener("mousedown", event=>{event.stopPropagation(); this.dragConnection();});
        this.element.setAttribute("name", itemData.name);
        this.element.setAttribute("instanceId", instanceId);
        this.element.setAttribute("type", type);
        this.element.setAttribute("nodeIndex", nodeIndex);
    }

    canConnect(toInstance) {
        if (this.contentId != toInstance.contentId) return false
        if (this.type == "inputs" && toInstance.type == "inputs") return false
        if (this.type == "outputs" && toInstance.type == "outputs") return false
        if (this.connection || toInstance.connection) return false
        return true
    }

    dragConnection() {
        this.element.classList.add("connecting");
        new DraggedLine(this, resultElement=>{
            this.element.classList.remove("connecting");
            if (resultElement?.nodeName == "ITEM") {
                const toItem = Item.getFromElement(resultElement);
                if (!(this.connection || toItem.connection || this.node instanceof ItemNode || toItem.node instanceof ItemNode) && this.contentId == toItem.contentId) {
                    new Connection(this, toItem);
                }
            } else if (resultElement?.nodeName == "CONNECTION") {
                Connection.getFromElement(resultElement).connectTo(this);
            }
        });
    }

    static getFromElement(element) {
        let nodeElement = element;
        while ((nodeElement = element.offsetParent).nodeName != "NODE");

        if (nodes[nodeElement.id] instanceof RecipeNode) return nodes[nodeElement.id][element.getAttribute("type")][element.getAttribute("nodeindex")];
        else if (nodes[nodeElement.id] instanceof ItemNode) return nodes[nodeElement.id].item;
    }
}
