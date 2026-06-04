// Clean references to the data sitting inside sokobanbase.js
const Tiles = window.Tiles;
const Entities = window.Entities;
const tileMap01 = window.tileMap01;

let moveHistory = [];
let playerPos = { x: 0, y: 0 };
let currentMap = [];
let totalGoals = 0;

function initGame() {
    const container = document.getElementById("game-container");
    if (!container) return;

    document.getElementById("win-message").style.display = "none";
    moveHistory = [];
    totalGoals = 0;

    container.innerHTML = ""; // Clear out stale elements
    const mapData = tileMap01.mapGrid;

    container.style.gridTemplateColumns = `repeat(${tileMap01.width}, 32px)`;
    container.style.gridTemplateRows = `repeat(${tileMap01.height}, 32px)`;

    for (let y = 0; y < tileMap01.height; y++) {
        currentMap[y] = [];
        for (let x = 0; x < tileMap01.width; x++) {
            const token = mapData[y][x][0].trim();

            const tileDiv = document.createElement("div");
            tileDiv.classList.add("tile");

            // Build Structural Map Background
            if (token === 'W') {
                tileDiv.classList.add(Tiles.Wall);
            } else if (token === 'G') {
                tileDiv.classList.add(Tiles.Goal);
                totalGoals++;
            } else {
                tileDiv.classList.add(Tiles.Space);
            }

            // Populate Dynamic Entities
            if (token === 'P') {
                tileDiv.classList.add(Entities.Character);
                playerPos = { x: x, y: y };
            } else if (token === 'B') {
                tileDiv.classList.add(Entities.Block);
            }

            container.appendChild(tileDiv);
            currentMap[y][x] = tileDiv;
        }
    }

    // Re-enable keyboard inputs if they were shut off after a win
    window.removeEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyDown);
}

function tryMove(dx, dy) {
    const nextX = playerPos.x + dx;
    const nextY = playerPos.y + dy;

    if (nextY < 0 || nextY >= tileMap01.height || nextX < 0 || nextX >= tileMap01.width) return;

    const nextTile = currentMap[nextY][nextX];
    if (nextTile.classList.contains(Tiles.Wall)) return;

    const hasBlock = nextTile.classList.contains(Entities.Block) || nextTile.classList.contains(Entities.BlockDone);

    if (hasBlock) {
        const blockNextX = nextX + dx;
        const blockNextY = nextY + dy;

        if (blockNextY < 0 || blockNextY >= tileMap01.height || blockNextX < 0 || blockNextX >= tileMap01.width) return;

        const blockNextTile = currentMap[blockNextY][blockNextX];

        const isBlockNextBlocked = blockNextTile.classList.contains(Tiles.Wall) ||
            blockNextTile.classList.contains(Entities.Block) ||
            blockNextTile.classList.contains(Entities.BlockDone);

        if (isBlockNextBlocked) return;

        // Save layout snapshot before box moving alterations
        saveHistoryState();

        nextTile.classList.remove(Entities.Block, Entities.BlockDone);

        if (blockNextTile.classList.contains(Tiles.Goal)) {
            blockNextTile.classList.add(Entities.BlockDone);
        } else {
            blockNextTile.classList.add(Entities.Block);
        }
    } else {
        // Save layout snapshot before step alterations
        saveHistoryState();
    }

    currentMap[playerPos.y][playerPos.x].classList.remove(Entities.Character);
    nextTile.classList.add(Entities.Character);

    playerPos.x = nextX;
    playerPos.y = nextY;

    checkWinCondition();
}

function checkWinCondition() {
    let completedBlocks = document.querySelectorAll(`.${Entities.BlockDone}`).length;
    if (completedBlocks === totalGoals && totalGoals > 0) {
        document.getElementById("win-message").style.display = "block";
        window.removeEventListener("keydown", handleKeyDown);
    }
}

function handleKeyDown(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    switch (e.key) {
        case "ArrowUp": tryMove(0, -1); break;
        case "ArrowDown": tryMove(0, 1); break;
        case "ArrowLeft": tryMove(-1, 0); break;
        case "ArrowRight": tryMove(1, 0); break;
    }
}

function saveHistoryState() {
    const stateSnapshot = {
        player: { x: playerPos.x, y: playerPos.y },
        blocks: []
    };
    for (let y = 0; y < tileMap01.height; y++) {
        for (let x = 0; x < tileMap01.width; x++) {
            if (currentMap[y][x].classList.contains(Entities.Block)) {
                stateSnapshot.blocks.push({ x: x, y: y, isDone: false });
            } else if (currentMap[y][x].classList.contains(Entities.BlockDone)) {
                stateSnapshot.blocks.push({ x: x, y: y, isDone: true });
            }
        }
    }
    moveHistory.push(stateSnapshot);
}

function undoMove() {
    if (moveHistory.length === 0) return;
    const previousState = moveHistory.pop();

    for (let y = 0; y < tileMap01.height; y++) {
        for (let x = 0; x < tileMap01.width; x++) {
            currentMap[y][x].classList.remove(Entities.Character, Entities.Block, Entities.BlockDone);
        }
    }

    playerPos = previousState.player;
    currentMap[playerPos.y][playerPos.x].classList.add(Entities.Character);

    previousState.blocks.forEach(block => {
        currentMap[block.y][block.x].classList.add(block.isDone ? Entities.BlockDone : Entities.Block);
    });
}

// Global script initializers
window.addEventListener("DOMContentLoaded", () => {
    initGame();
    document.getElementById("reset-btn").addEventListener("click", initGame);
    document.getElementById("back-btn").addEventListener("click", undoMove);
});