let nodeIdIter = 0;
let nodes = {};

class Node {
    visitId;

    constructor(posX, posY, functionless) {
        if (!functionless) this.id = nodeIdIter++
        this.element = document.createElement("node");
        if (!functionless) this.element.id = this.id;
        this.element.style.setProperty("--posX", posX);
        this.element.style.setProperty("--posY", posY);

        this.dragFunction = ()=>{
            drag(this.element, true);
            this.allItems().forEach(item=>{if (item.connection) item.connection.updateLineTo(item)});
        }
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
            if (item.connection) item.connection.removeConnectionTo(item);
        });
        this.element.remove();
        delete nodes[this.id];
    }
}

class ItemNode extends Node {
    constructor(posX, posY, itemId, functionless) {
        super(posX, posY, functionless);
        this.element.insertAdjacentHTML("beforeend", `
            <div class="right-side">
                <div class="number-container"><input type="numeric" placeholder="quantity"></input><span>${data.items[itemId].unit||""}</span></div>
                <button class="setter">SET</button>
                <button class="flipper">\uf2f1</button>
            </div>
        `);
        this.item = new Item(itemId, null, itemIdIter++, this, null, functionless);
        this.element.querySelector(".setter").addEventListener("click", ()=>{
            this.item.quantity = Number(this.element.querySelector("input").value);
            this.constrained = true; // TODO: make this a toggle
            solve(propagate(this));
        });
        this.element.querySelector(".flipper").addEventListener("click",()=>{
            this.element.classList.toggle("flipped");
            this.allItems().forEach(item=>{if (item.connection) item.connection.updateLineTo(item)});
        })
        this.element.insertBefore(this.item.element, this.element.firstChild);
        this.element.classList.add("itemNode");
    }

    updateDisplay() {
        this.element.querySelector("input").value = this.item.quantity;
    }

    allItems() { return [this.item] }
}

class RecipeNode extends Node {
    constructor(posX, posY, recipeId, functionless) {
        super(posX, posY, functionless);
        this.recipeData = data.recipes[recipeId];
        this.recipeId = recipeId;
        const machineData = data.machines[this.recipeData.machines[0]];
        this.machine = { // make this an object probably
            machineId: this.recipeData.machines[0],
            machineData: machineData,
            speed: machineData.speed,
        }
        this.element.insertAdjacentHTML("beforeend", `
            <div class="machine" style="--image:url('${machineData.image}');"></div>
            <div class="inputs"></div>
            <div class="recipe-arrow"></div>
            <div class="outputs"></div>
        `);
        
        this.machine.element = this.element.querySelector(".machine");

        const inputs = this.element.querySelector(".inputs");
        this.inputs = this.recipeData.inputs.map(([itemId, quantity], index) => {
            const item = new Item(itemId, "inputs", itemIdIter++, this, index, functionless);
            item.quantity = quantity;
            inputs.appendChild(item.element);
            return item;
        });
        const outputs = this.element.querySelector(".outputs");
        this.outputs = this.recipeData.outputs.map(([itemId, quantity], index) => {
            const item = new Item(itemId, "outputs", itemIdIter++, this, index, functionless);
            item.quantity = quantity;
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
        this.machine.element.setAttribute("amount", `${this.recipeData.time}s`);
        this.allItems().forEach(item=>{
            item.element.setAttribute("quantity", `${item.quantity}${item.unit}`);
        });
    }

    displayMultipliedCase() {
        this.element.querySelector(".machine").setAttribute("amount", "x" + this.machine.multiplier.toFixed(2));
        this.allItems().forEach(item=>{
            item.element.setAttribute("quantity", `${(throughput(item) * this.machine.multiplier).toFixed(2)}${item.unit}`);
        });
    }

    allItems() { return [...this.inputs, ...this.outputs] }
}
