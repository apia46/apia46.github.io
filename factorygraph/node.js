class Node {
    constructor(posX, posY, functionless) {
        this.id = nodeIdIter++
        this.element = document.createElement("node");
        this.element.id = this.id;
        this.element.style.setProperty("--posX", posX);
        this.element.style.setProperty("--posY", posY);

        this.dragFunction = ()=>{drag(this.element, true)}
        if (!functionless) {
            this.element.addEventListener("mousedown", event=>{event.stopPropagation(); previousMouseX = mouseX; previousMouseY = mouseY; wrapper.addEventListener("mousemove", this.dragFunction)});
            wrapper.addEventListener("mouseup", ()=>{wrapper.removeEventListener("mousemove", this.dragFunction)});
            wrapper.addEventListener("mouseleave", ()=>{wrapper.removeEventListener("mousemove", this.dragFunction)});
        }
        this.element.insertAdjacentHTML("beforeend", `<div class="delete">X</div>`);
        this.element.querySelector(".delete").addEventListener("click", ()=>{this.remove()});

        graph.appendChild(this.element);
    }

    static getFromElement(element) {
        return nodes[Number(element.id)];
    }

    attachToGraph() {
        graph.appendChild(this.element);
        nodes[this.id] = this;
    }

    remove() {
        this.allItems().forEach(item=>{
            if (item.connection) removeConnection(item.connection);
        });
        this.element.remove();
        delete nodes[this.id];
    }
}

class ItemNode extends Node {
    constructor(posX, posY, itemId, functionless) {
        super(posX, posY, functionless);
        this.element.insertAdjacentHTML("beforeend", `
            <div class="number-container"><input type="numeric" placeholder="quantity"></input><span>${data.items[itemId].unit||""}</span></div>
            <button>SET</button>
        `);
        this.item = new Item(itemId, "node", itemIdIter++, this, null, functionless);
        this.element.querySelector("button").addEventListener("click", ()=>{propagate(this.item, Number(this.element.querySelector("input").value));});
        this.element.insertBefore(this.item.element, this.element.firstChild);
        this.element.classList.add("itemNode");
    }

    allItems() { return [this.item] }
}

class RecipeNode extends Node {
    constructor(posX, posY, recipeId, functionless) {
        super(posX, posY, functionless);
        const recipeData = data.recipes[recipeId];
        this.recipeId = recipeId;
        this.machine = { // make this an object probably
            machineId: recipeData.machines[0] // not sure abiyt this
        }
        const machineData = data.machines[this.machine.machineId];
        this.element.insertAdjacentHTML("beforeend", `
            <div class="machine" style="--image:url('${machineData.image}');"></div>
            <div class="inputs"></div>
            <div class="recipe-arrow"></div>
            <div class="outputs"></div>
        `);
        
        this.machine.element = this.element.querySelector(".machine");

        const inputs = this.element.querySelector(".inputs");
        this.inputs = recipeData.inputs.map(([itemId, baseQuantity], index) => {
            const item = new Item(itemId, "inputs", itemIdIter++, this, index, functionless);
            item.baseQuantity = baseQuantity;
            inputs.appendChild(item.element);
            return item;
        });
        const outputs = this.element.querySelector(".outputs");
        this.outputs = recipeData.outputs.map(([itemId, baseQuantity], index) => {
            const item = new Item(itemId, "outputs", itemIdIter++, this, index, functionless);
            item.baseQuantity = baseQuantity;
            outputs.appendChild(item.element);
            return item;
        });
        this.element.setAttribute("recipeId", recipeId);
        this.element.classList.add("recipeNode");
    }

    attachToGraph() {
        super.attachToGraph();
        this.displayBaseCase();
    }

    displayBaseCase() {
        this.machine.element.setAttribute("amount", `${data.recipes[this.recipeId].time}s`);
        this.allItems().forEach(item=>{
            item.element.setAttribute("quantity", `${item.baseQuantity}${item.unit}`);
        });
    }

    displayMultipliedCase() {
        this.element.querySelector(".machine").setAttribute("amount", "x" + this.machine.amount.toFixed(2));
        this.allItems().forEach(item=>{
            if (item.quantity || item.quantity === 0) item.element.setAttribute("quantity", `${item.quantity.toFixed(2)}${item.unit}`);
            else item.element.setAttribute("quantity", "");
        });
    }

    allItems() { return [...this.inputs, ...this.outputs] }
}
