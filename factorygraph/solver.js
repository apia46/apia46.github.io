let visitIdIter = 0; // we use a "visit id" for each propagation to check if we have been somewhere before. is this the best way to do it? dunno

function propagate(node, network) {
    if (!network) network = new Network();

    if (node.visitId == network.visitId) return network;
    node.visitId = network.visitId;
    node.networkIndex = network.nodes.length;
    network.nodes.push(node);

    node.allItems().forEach(item => {
        if (item.connection) {
            if (item.connection.visitId != network.visitId) {
                item.connection.visitId = network.visitId;
                network.connections.push(item.connection);
            }
            item.connection.getAllExcept(item).forEach(thisItem=>propagate(thisItem.node, network));
        }
    });

    return network;
}

class Network {
    constructor() {
        this.visitId = visitIdIter++;
        this.nodes = [];
        this.connections = [];
    }
}

function solve(network) {
    // read: gaussian elimination
    // the "variables" are nodes; the "equations" are connections
    console.log("network:", network);
    
    let matrix = [];
    let augment = [];

    let variablesAccountedForMask = array_fill(network.nodes.length, false);
    let variablesAccountedFor = 0;
    let checkMatrix = [];
    let checkAugment = [];
    // redo this; it doesnt actually work. fghjkfgjglk
    const addRowToMatrix = (row, value)=>{
        row.forEach((value, index)=>{
            if (value && !variablesAccountedForMask[index]) {
                variablesAccountedForMask[index] = true;
                variablesAccountedFor++;
            }
        });
        if (variablesAccountedFor > matrix.length) {
            matrix.push(row);
            augment.push(value);
        } else {
            // redundant equation
            checkMatrix.push(row);
            checkAugment.push(value);
        }
    }

    network.connections.forEach(connection=>{
        let row = array_fill(network.nodes.length, 0);
        if (connection instanceof DirectConnection) {
            if (connection.itemItem.node.constrained) {
                let extraRow = array_fill(network.nodes.length, 0);
                // 1 * itemNode = quantity
                extraRow[connection.itemItem.node.networkIndex] = 1;
                addRowToMatrix(extraRow, connection.itemItem.quantity);
            }
            // throughput(recipeItem) * recipeNode = itemNode
            // :. throughPut(recipeItem) * recipeNode - itemNode = 0
            row[connection.recipeItem.node.networkIndex] = throughput(connection.recipeItem);
            row[connection.itemItem.node.networkIndex] = -1;
        } else {
            // remember, the types on the connection are given as relative to the node they come from
            // Σ(throughput(outputRecipeItem) * outputRecipeNode) = itemNode + Σ(throughput(inputRecipeItem) * inputRecipeNode)
            // :. Σ(throughput(outputRecipeItem) * outputRecipeNode) - itemNode - Σ(throughput(inputRecipeItem) * inputRecipeNode) = 0
            connection.outputs.forEach(outputItem=>{
                row[outputItem.node.networkIndex] = throughput(outputItem);
            });
            if (connection.itemNodeItem) {
                row[connection.itemNodeItem.node.networkIndex] = -1;
                if (connection.itemNodeItem.node.constrained) {
                    let extraRow = array_fill(network.nodes.length, 0);
                    // 1 * itemNode = quantity
                    extraRow[connection.itemNodeItem.node.networkIndex] = 1;
                    addRowToMatrix(extraRow, connection.itemNodeItem.quantity);
                }
            }
            connection.inputs.forEach(inputItem=>{
                row[inputItem.node.networkIndex] = -throughput(inputItem);
            });
        }
        addRowToMatrix(row, 0);
    });

    // returns the multipliers for each recipeNode; amounts for each itemNode
    console.log("matrix and augment: ", matrix, augment);
    console.log("check matrix and augment: ", checkMatrix, checkAugment);
    if (matrix.length < network.nodes.length) return "couldnt solve; node graph underconstrained";
    const result = gauss(matrix, augment);
    console.log("result: ", result);
    if (result.includes(NaN)) return "couldnt solve; NaN error; this is probably a bug; report it please";

    if (checkMatrix.some((checkRow, index)=>{
        return checkRow.reduce((total, value, column)=>total + value*result[column]) - checkAugment[index] > 0.01;
    })) return "couldnt solve; node graph overconstrained";

    network.nodes.forEach(node=>{
        if (node instanceof ItemNode) { if (!node.constrained) node.item.quantity = 0; }
        else node.machine.multiplier = 0;
    });
    result.forEach((value, nodeIndex)=>{
        const node = network.nodes[nodeIndex];
        if (node instanceof ItemNode) {
            node.item.quantity = value;
        } else {
            node.machine.multiplier = value;
        }
    });

    network.nodes.forEach(node=>{
        if (node instanceof RecipeNode) node.displayMultipliedCase();
        if (node instanceof ItemNode && !node.constrained) node.updateDisplay();
    })
}

function throughput(item) {
    // the amount of item/[time unit] that pass through the recipe run with a single machine
    return item.quantity / item.node.recipeData.time * item.node.machine.speed;
}