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
            this.element.insertAdjacentHTML("beforeend", `<div class="delete">X</div>`);
            this.element.querySelector(".delete").addEventListener("click", ()=>{this.remove()});
        }

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
                <div class="number-container"><input type="numeric" placeholder="unconstrained" class="quantity"></input><span>${data.items[itemId].unit||""}</span></div>
                <label><input type="checkbox" class="constrain"></label>
                <span class="error">\uf06a</span>
                <button class="flipper">\uf2f1</button>
            </div>
        `);
        const quantityInput = this.element.querySelector(".quantity");
        this.item = new Item(itemId, null, itemIdIter++, this, null, functionless);
        quantityInput.addEventListener("mousedown", event=>{event.stopPropagation()}); // dont drag
        quantityInput.addEventListener("input", ()=>{
            this.constrained = true;
            this.element.querySelector(".constrain").checked = true;
            quantityInput.placeholder = "unset";
        })
        quantityInput.addEventListener("focusout", ()=>{
            this.item.quantity = Number(quantityInput.value);
            const result = solve(propagate(this));
            if (result) this.element.querySelector(".error").setAttribute("name", result);
            else this.element.querySelector(".error").removeAttribute("name");
        });
        this.element.querySelector(".constrain").addEventListener("click", ()=>{
            this.constrained = this.element.querySelector(".constrain").checked;
            quantityInput.placeholder = this.constrained?"unset":"unconstrained";
        })
        this.element.querySelector(".flipper").addEventListener("click",()=>{
            this.element.classList.toggle("flipped");
            this.allItems().forEach(item=>{if (item.connection) item.connection.updateLineTo(item)});
        })
        this.element.insertBefore(this.item.element, this.element.firstChild);
        this.element.classList.add("itemNode");
    }

    updateDisplay() {
        this.element.querySelector(".quantity").value = this.item.quantity;
    }

    allItems() { return [this.item] }
}

class RecipeNode extends Node {
    showingMultiplied = false;

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
            <machine style="--image:url('${machineData.image}');" name="${machineData.name}"></machine>
            <div class="inputs"></div>
            <div class="recipe-arrow"></div>
            <div class="outputs"></div>
        `);
        
        this.machine.element = this.element.querySelector("machine");

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
        this.showingMultiplied = false;
        this.machine.element.setAttribute("amount", `${this.recipeData.time}s`);
        this.machine.element.setAttribute("accurateAmount", `${this.recipeData.time}s per recipe`);
        this.allItems().forEach(item=>{
            item.element.setAttribute("quantity", `${item.quantity}${item.unit}`);
            item.element.setAttribute("accurateQuantity", `${item.quantity}${item.unit}`);
        });
    }

    displayMultipliedCase() {
        this.showingMultiplied = true;
        this.machine.element.setAttribute("amount", "x" + formatNumber(this.machine.multiplier));
        this.machine.element.setAttribute("accurateAmount", `${formatNumber(this.machine.multiplier, true)} machines`);
        this.allItems().forEach(item=>{
            item.multipliedQuantity = throughput(item) * this.machine.multiplier;
            item.element.setAttribute("quantity", `${formatNumber(item.multipliedQuantity)}${item.unit}`);
            item.element.setAttribute("accurateQuantity", `${formatNumber(item.multipliedQuantity, true)}${item.unit}/s`);
        });
    }

    allItems() { return [...this.inputs, ...this.outputs] }
}
