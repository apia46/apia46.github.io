let visitIdIter = 0;

function propagate(node, graph) {
    if (!graph) graph = new Graph();

    if (node.visitId == graph.visitId) return graph;
    node.visitId = graph.visitId;
    graph.nodes.push(node);

    node.allItems().forEach(item => {
        if (item.connection) propagate(item.connection[oppositeType(item.type)].node, graph);
    });

    return graph;
}

class Graph {
    constructor() {
        this.visitId = visitIdIter++;
        this.nodes = [];
    }
}

function solve(matrix) {
    
}
