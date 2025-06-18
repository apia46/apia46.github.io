let data;
let idIter = 0;

let previousMouseX;
let previousMouseY;

let nodes = {};

let draggingConnection = false;
let dragConnectionElement;
let draggingLine;
let dragStart;
let updateLineFunction;

function drag(event, element, accountForScaling) {
    var multiplier = (accountForScaling ? 1/Number(graph.style.getPropertyValue("--scale")||1) : 1);
    element.style.setProperty("--posX", Number(element.style.getPropertyValue("--posX")||0) + (event.clientX - previousMouseX) * multiplier)
    element.style.setProperty("--posY", Number(element.style.getPropertyValue("--posY")||0) + (event.clientY - previousMouseY) * multiplier)
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
    }

function load() {
    var dragGraph = event=>{drag(event, graph)};
    wrapper.addEventListener("mousedown", event=>{previousMouseX = event.clientX; previousMouseY = event.clientY; wrapper.addEventListener("mousemove", dragGraph)});
    wrapper.addEventListener("mouseup", ()=>{wrapper.removeEventListener("mousemove", dragGraph)});
    wrapper.addEventListener("mouseleave", ()=>{wrapper.removeEventListener("mousemove", dragGraph)});
    wrapper.addEventListener("wheel", event=>{
        var scaleFactor = 2**(-event.deltaY*0.003);
        graph.style.setProperty("--scale", Number(graph.style.getPropertyValue("--scale")||1) * scaleFactor);
        var posX = Number(graph.style.getPropertyValue("--posX")||0);
        var posY = Number(graph.style.getPropertyValue("--posY")||0);
        graph.style.setProperty("--posX", posX + (1 - scaleFactor) * (event.clientX - posX));
        graph.style.setProperty("--posY", posY + (1 - scaleFactor) * (event.clientY - posY));
    });

    ["mouseleave", "mouseup"].forEach(action=>wrapper.addEventListener(action, event=>{
        if (draggingConnection) {
            wrapper.removeEventListener("mousemove", updateLineFunction);
            draggingConnection = false;
            dragConnectionElement.classList.remove("connecting");
            var connectedToElement = document.elementFromPoint(event.clientX, event.clientY);
            if (connectedToElement.nodeName == "ITEM" && connectedToElement != dragConnectionElement) {
                updateLine(draggingLine, dragStart, getGraphPositionFromCenter(connectedToElement));
            } else {
                draggingLine.remove();
            }
        }
    }));

    console.log(newNode(recipeNode, 40, 40, data.recipes.ethylene));
    console.log(newNode(recipeNode, 300, 40, data.recipes.polyethylene));
    console.log(newNode(itemNode, 560, 40, data.items["molten.plastic"]));
}

function newNode(generatorFunction, posX, posY, params) {
    var node = document.createElement("node");
    node.id = idIter;
    node.style.setProperty("--posX", posX);
    node.style.setProperty("--posY", posY);
    
    var dragNode = event=>{drag(event, node, true)};
    node.addEventListener("mousedown", event=>{event.stopPropagation(); previousMouseX = event.clientX; previousMouseY = event.clientY; wrapper.addEventListener("mousemove", dragNode)});
    wrapper.addEventListener("mouseup", ()=>{wrapper.removeEventListener("mousemove", dragNode)});
    wrapper.addEventListener("mouseleave", ()=>{wrapper.removeEventListener("mousemove", dragNode)});
    
    node.innerHTML += `<div class="delete" onclick="removeNode(${idIter})">X</div>`;
    
    var nodeData = generatorFunction(node, params);
    node.classList.add(nodeData.type)
    graph.appendChild(node);

    nodes[nodeData.id] = nodeData;
    return nodeData;
}

function removeNode(id) {
    document.getElementById(id).remove();
    delete nodes[id];
}

// node generators
function recipeNode(node, recipe) {
    node.innerHTML += `
        <div class="inputs">
            ${recipe.inputs.map((input, index) => generateItem(data.items[input[0]], input[1])).join("")}
        </div>
        <div class="recipe-arrow"></div>
        <div class="outputs">
            ${recipe.outputs.map((output, index) => generateItem(data.items[output[0]], output[1])).join("")}
        </div>
    `;
    return {
        id: idIter++,
        type: "recipeNode",
        element: node,
        recipeData: structuredClone(recipe)
    }
}

function itemNode(node, item) {
    node.innerHTML += generateItem(item, null, `nodes[${idIter}].item`);
    return {
        id: idIter++,
        type: "itemNode",
        element: node,
        item: structuredClone(item)
    }
}
// end node generators

function generateItem(item, quantity, pointer) {
    return `<item
        style="--image:url('${item.image}');"
        quantity="${quantity||""}${quantity?(item.unit||""):""}"
        onmousedown="event.stopPropagation(); startConnection(this);"
        pointer="pointer"
    ></item>`;
}

function startConnection(element) {
    element.classList.add("connecting");
    draggingConnection = true;
    dragConnectionElement = element;
    draggingLine = document.createElement("line");
    graph.appendChild(draggingLine);
    dragStart = getGraphPositionFromCenter(dragConnectionElement);

    var scale = Number(graph.style.getPropertyValue("--scale")||1);
    updateLineFunction = event=>{updateLine(draggingLine,
        dragStart,
        [
            (event.clientX - Number(graph.style.getPropertyValue("--posX")||0)) / scale,
            (event.clientY - 48 - Number(graph.style.getPropertyValue("--posY")||0)) / scale
        ]) // header height ^^^^
    }
    wrapper.addEventListener("mousemove", updateLineFunction);
    updateLineFunction({clientX:dragStart.x, clientY:dragStart.y});
}

// https://www.quirksmode.org/js/findpos.html
function getGraphPositionFromCenter(element) {
    var posX = element.offsetWidth / 2;
    var posY = element.offsetHeight / 2;
    do {
        posX += element.offsetLeft;
        posY += element.offsetTop;
    } while ((element = element.offsetParent) != graph);
    return [posX, posY];
}

function updateLine(line, from, to) {
    var aPos = from;
    var bPos = to;
    line.style.setProperty("--aX", aPos[0]);
    line.style.setProperty("--aY", aPos[1]);
    line.style.setProperty("--bX", bPos[0]);
    line.style.setProperty("--bY", bPos[1]);
}