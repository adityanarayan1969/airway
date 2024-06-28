const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

const nodes = [
    { id: 0, x: 100, y: 100 },
    { id: 1, x: 200, y: 100 },
    { id: 2, x: 300, y: 100 },
    { id: 3, x: 200, y: 200 },
    { id: 4, x: 400, y: 200 },
];

const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
];

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';

    edges.forEach(edge => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
    });

    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeText(node.id, node.x - 5, node.y + 5);
    });
}

drawGraph();

const visited = new Set();
let animationId;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    // Highlight the current node
    highlightNode(nodeId, 'red');
    await sleep(1000);

    for (let edge of edges) {
        if (edge.from === nodeId && !visited.has(edge.to)) {
            await dfs(edge.to);
        }
    }
}

function highlightNode(nodeId, color) {
    const node = nodes[nodeId];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.strokeText(node.id, node.x - 5, node.y + 5);
}

document.getElementById('startDFS').addEventListener('click', async () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    visited.clear();
    drawGraph();
    await dfs(0);
});
