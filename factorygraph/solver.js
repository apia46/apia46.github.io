class Network {
    constructor(node) {
        if (node) this.nodes = [node];
        else this.nodes = [];
        this.connections = [];
    }

    joinTo(network) {
        if (network === this) return;
        network.nodes.push(...this.nodes);
        network.connections.push(...this.connections);
        this.nodes.forEach(node=>node.network=network);
        this.connections.forEach(connection=>connection.network=network);
        network.updateSolve();
    }

    setNetworkIndices() {
        this.nodes.forEach((node, index)=>node.networkIndex=index);
    }

    findDisconnected() {
        let visitId = 0;
        this.nodes.forEach(node=>delete node.visitId);
        this.connections.forEach(connection=>delete connection.visitId);
        let subnets = [];
        this.nodes.forEach(node=>{
            if (node.visitId) return;
            visitId++;
            let subnet = new Network();
            subnets.push(subnet);
            // flood fill from node
            let queue = [node];
            while (queue.length) {
                let thisNode = queue.pop();
                thisNode.visitId = visitId;
                subnet.nodes.push(thisNode);
                thisNode.network = subnet;
                const [connectedNodes, connections] = thisNode.unvisitedConnectedNodesAndConnections(visitId);
                subnet.connections.push(...connections);
                connections.forEach(connection=>connection.network=subnet);
                queue.push(...connectedNodes);
            }
        });
        subnets.forEach(network=>network.updateSolve());
    }

    updateSolve() {
        let itemNode;
        if (itemNode = this.nodes.find(node=>node instanceof ItemNode)) itemNode.solveFromThis();
        else this.nodes.forEach(node=>{if (node instanceof RecipeNode) node.displayBaseCase()});
    }
}

function solve(network) {
    // read: gaussian elimination
    // the "variables" are nodes; the "equations" are connections
    
    if (network.nodes.length == 1) return;

    let matrix = [];
    let augment = [];

    network.setNetworkIndices();

    const addRowToMatrix = (row, value)=>{
        matrix.push(row);
        augment.push(value);
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
    if (matrix.length < network.nodes.length) {
        network.nodes.forEach(node=>{if (node instanceof RecipeNode) node.displayBaseCase()});
        return "couldnt solve; node graph underconstrained";
    }
    const result = gauss(matrix, augment);
    if (!result) {
        network.nodes.forEach(node=>{if (node instanceof RecipeNode) node.displayBaseCase()});
        return "couldnt solve; overconstrained";
    }
    if (result.includes(NaN)) {
        network.nodes.forEach(node=>{if (node instanceof RecipeNode) node.displayBaseCase()});
        return "couldnt solve; NaN error; this is probably a bug; report it please";
    }

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
    });
}

function throughput(item) {
    // the amount of item/[time unit] that pass through the recipe run with a single machine
    return item.quantity / item.node.recipeData.time * item.node.machine.speed;
}