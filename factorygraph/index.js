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
    if (element.nodeName == "NODE") {
        allItemsInNode(element).forEach(item=>{if (item.connection) updateLine(item.connection)})
    }
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
            if (connectedToElement.nodeName == "ITEM" && connectedToElement != dragConnectionElement && canConnect(
                    fromInstance = itemGetInstance(dragConnectionElement), 
                    toInstance = itemGetInstance(connectedToElement)
            )) {
                updateLine(draggingLine, dragStart, getGraphPositionFromCenter(connectedToElement));
                var isFromInput = fromInstance.type == "inputs" || toInstance.type == "outputs";
                var connection = {
                    input: isFromInput?fromInstance:toInstance,
                    output: isFromInput?toInstance:fromInstance,
                    line: draggingLine
                }
                fromInstance.connection = connection;
                toInstance.connection = connection;
                draggingLine.addEventListener("click", ()=>{removeConnection(connection)})
                console.log(fromInstance)
                console.log(toInstance)
            } else {
                draggingLine.remove();
            }
        }
    }));

    console.log(newNode(recipeNode, 40, 40, "ethylene"));
    console.log(newNode(recipeNode, 300, 40, "polyethylene"));
    console.log(newNode(itemNode, 560, 40, "molten.plastic"));
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
    var recipeData = data.recipes[recipe];
    node.innerHTML += `
        <div class="inputs"></div>
        <div class="recipe-arrow"></div>
        <div class="outputs"></div>
    `;
    var inputs = recipeData.inputs.map((input, index) => {
        var item = generateItem(input[0], input[1], "inputs", index);
        node.querySelector(".inputs").appendChild(item);
        return {type:"inputs", index:index, item:input[0], baseQuantity:input[1], element:item}
    });
    var outputs = recipeData.outputs.map((output, index) => {
        var item = generateItem(output[0], output[1], "outputs", index);
        node.querySelector(".outputs").appendChild(item);
        return {type:"outputs", index:index, item:output[0], baseQuantity:output[1], element:item}
    });
    return {
        id: idIter++,
        type: "recipeNode",
        element: node,
        inputs: inputs,
        outputs: outputs,
        recipe: recipe
    }
}

function itemNode(node, item) {
    node.appendChild(generateItem(item, null, "", ""));
    return {
        id: idIter++,
        type: "itemNode",
        element: node,
        item: {type:"node", item:item, element:node}
    }
}
// end node generators

function generateItem(item, quantity, type, index) {
    var itemData = data.items[item];
    var item = document.createElement("item");
    item.style.setProperty("--image", `url('${itemData.image}')`);
    if (quantity || quantity === 0) item.setAttribute("quantity", `${quantity}${itemData.unit||""}`);
    item.addEventListener("mousedown", event=>{event.stopPropagation(); startConnection(item);});
    item.setAttribute("type", type);
    item.setAttribute("index", index);
    return item;
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
            (event.clientX - wrapper.offsetLeft - Number(graph.style.getPropertyValue("--posX")||0)) / scale,
            (event.clientY - wrapper.offsetTop - Number(graph.style.getPropertyValue("--posY")||0)) / scale
        ]);
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

function updateLine(lineOrConnection, from, to) {
    if (!lineOrConnection.nodeName) {
        from = getGraphPositionFromCenter(lineOrConnection.input.element);
        to = getGraphPositionFromCenter(lineOrConnection.output.element);
        lineOrConnection = lineOrConnection.line;
    }
    var aPos = from;
    var bPos = to;
    lineOrConnection.style.setProperty("--aX", aPos[0]);
    lineOrConnection.style.setProperty("--aY", aPos[1]);
    lineOrConnection.style.setProperty("--bX", bPos[0]);
    lineOrConnection.style.setProperty("--bY", bPos[1]);
}

function canConnect(fromInstance, toInstance) {
    if (fromInstance.item != toInstance.item) return false
    if (fromInstance.type == "inputs" && toInstance.type == "inputs") return false
    if (fromInstance.type == "outputs" && toInstance.type == "outputs") return false
    return true
}

function itemGetInstance(element) {
    var nodeElement = element;
    while ((nodeElement = nodeElement.offsetParent).nodeName != "NODE");
    switch (nodes[nodeElement.id].type) {
        case "recipeNode": return nodes[nodeElement.id][element.getAttribute("type")][element.getAttribute("index")];
        case "itemNode": return nodes[nodeElement.id].item;
    }
}

function allItemsInNode(element) {
    var node = nodes[element.id];
    switch (node.type) {
        case "recipeNode": return [...node.inputs, ...node.outputs];
        case "itemNode": return [node.item];
    }
}

function removeConnection(connection) {
    connection.line.remove();
    delete connection.input.connection;
    delete connection.output.connection;
}