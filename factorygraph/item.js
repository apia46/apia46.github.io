let itemIdIter = 0;

class Item {
    connection;

    constructor(contentId, type, instanceId, node, nodeIndex, functionless) {
        this.contentId = contentId;
        this.type = type;
        this.instanceId = instanceId;
        this.nodeIndex = nodeIndex;
        this.node = node;
        this.itemData = data.items[contentId];
        this.unit = this.itemData.unit||"";
        this.element = document.createElement("item");
        this.element.style.setProperty("--image", `url('${this.itemData.image}')`);
        if (this.itemData.imageModulation) this.element.style.setProperty("--imageModulation", this.itemData.imageModulation);
        if (this.itemData.imageOverlay) this.element.style.setProperty("--imageOverlay", `url('${this.itemData.imageOverlay}')`);
        if (!functionless) this.element.addEventListener("mousedown", event=>{event.stopPropagation(); this.dragConnection();});
        this.element.setAttribute("instanceId", instanceId);
        this.element.setAttribute("type", type);
        this.element.setAttribute("nodeIndex", nodeIndex);
        this.element.setAttribute("name", this.itemData.name);
    }

    dragConnection() {
        this.element.classList.add("connecting");
        if (this.connection) return;
        new DraggedLine(this, resultElement=>{
            this.element.classList.remove("connecting");
            if (resultElement?.nodeName == "ITEM") {
                const toItem = Item.getFromElement(resultElement);
                if (!toItem.connection && this.contentId == toItem.contentId) {
                    if (this.node instanceof ItemNode && toItem.node instanceof ItemNode) return;
                    else if (this.node instanceof ItemNode) new DirectConnection(this, toItem);
                    else if (toItem.node instanceof ItemNode) new DirectConnection(toItem, this);
                    else new Connection(this, toItem);
                }
            } else if (resultElement?.nodeName == "CONNECTION") {
                const connection = Connection.getFromElement(resultElement);
                if (connection.contentId = this.contentId) {
                    if (this.node instanceof RecipeNode) connection.connectTo(this);
                    else if (!connection.itemNode) connection.addItemNode(this);
                }
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
