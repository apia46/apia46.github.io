class Item {
    baseQuantity;

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
        if (!functionless) this.element.addEventListener("mousedown", event=>{event.stopPropagation(); this.startConnection();});
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

    startConnection() {
        this.element.classList.add("connecting");
        draggingConnection = true;
        dragConnectionElement = this.element;
        draggingLine = document.createElement("line");
        graph.appendChild(draggingLine);

        const scale = Number(wrapper.style.getPropertyValue("--scale")||1);
        updateLineFunction = ()=>{updateLine(draggingLine,
            getGraphPositionFromCenter(dragConnectionElement),
            [
                (mouseX - wrapper.offsetLeft - Number(wrapper.style.getPropertyValue("--posX")||0)) / scale,
                (mouseY - wrapper.offsetTop - Number(wrapper.style.getPropertyValue("--posY")||0)) / scale
            ]);
        }
        wrapper.addEventListener("mousemove", updateLineFunction);
        const dragStart = getGraphPositionFromCenter(dragConnectionElement);
        updateLineFunction({clientX:dragStart.x, clientY:dragStart.y});
    }

    static getFromElement(element) {
        let nodeElement = element;
        while ((nodeElement = element.offsetParent).nodeName != "NODE");

        if (nodes[nodeElement.id] instanceof RecipeNode) return nodes[nodeElement.id][element.getAttribute("type")][element.getAttribute("nodeindex")];
        else if (nodes[nodeElement.id] instanceof ItemNode) return nodes[nodeElement.id].item;
    }
}
