// Game state
const gameState = {
    players: [],
    playerTypes: [],
    originalPairs: [],
    currentRound: 1,
    totalRounds: 5,
    itemsPerPlayer: 2,
    scores: [],
    roundHistory: []
};

// Computer player names
const computerNames = [
    "AI Alice", "Bot Bob", "Cyber Charlie", "Digital Diana", "Electronic Ethan", 
    "Future Fiona", "Gadget Gary", "Hologram Hannah", "Interface Ian", "Joystick Julia",
    "Kernel Kevin", "Logic Lisa", "Mechanic Mike", "Nano Nina", "Optical Otto",
    "Processor Pam", "Quantum Quinn", "Robot Ryan", "System Sophia", "Tech Trevor"
];

// Item suggestions for computer players
const computerItems = [
    "Smartphone", "Laptop", "Headphones", "Coffee", "Book", "Watch", "Sunglasses", "Camera",
    "Gaming Console", "Backpack", "Water Bottle", "Sneakers", "Chocolate", "Wallet", "Guitar",
    "Bicycle", "Plant", "Umbrella", "Pen", "Notebook", "Basketball", "Scarf", "Hat", "Mug",
    "Keyboard", "Mouse", "Monitor", "Speaker", "Tablet", "Drone", "Charger", "USB Drive",
    "Sandwich", "Pizza", "Burger", "Taco", "Sushi", "Pasta", "Salad", "Ice Cream", "Cake",
    "Cookie", "Donut", "Popcorn", "Chips", "Candy", "Soda", "Juice", "Tea", "Pillow", "Blanket"
];

// DOM Elements
const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');
const playersContainer = document.getElementById('playersContainer');
const gamePlayersContainer = document.getElementById('gamePlayersContainer');
const startGameBtn = document.getElementById('startGameBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const restartBtn = document.getElementById('restartBtn');
const addHumanBtn = document.getElementById('addHumanBtn');
const addComputerBtn = document.getElementById('addComputerBtn');
const roundNumber = document.getElementById('roundNumber');
const totalRounds = document.getElementById('totalRounds');
const scoreTableBody = document.getElementById('scoreTableBody');
const gameOverMessage = document.getElementById('gameOverMessage');
const winnersElement = document.getElementById('winners');
const numRoundsInput = document.getElementById('numRounds');
const itemsPerPlayerInput = document.getElementById('itemsPerPlayer');

// Event Listeners
startGameBtn.addEventListener('click', startGame);
nextRoundBtn.addEventListener('click', playNextRound);
restartBtn.addEventListener('click', restartGame);
addHumanBtn.addEventListener('click', () => addPlayer('human'));
addComputerBtn.addEventListener('click', () => addPlayer('computer'));

// Initialize with one human player
addPlayer('human');

// Functions

function showLoader() {
  document.getElementById('loaderOverlay').style.display = 'flex';
}
function hideLoader() {
  document.getElementById('loaderOverlay').style.display = 'none';
}


function addPlayer(type) {
    const playerCount = document.querySelectorAll('.player-input').length;
    
    if (playerCount >= 8) {
        alert("Maximum 8 players allowed!");
        return;
    }
    
    const playerId = Date.now(); // Unique ID for this player
    const playerDiv = document.createElement('div');
    playerDiv.className = `player-input ${type}-player`;
    playerDiv.dataset.playerId = playerId;
    
    // Create player type indicator
    const typeIndicator = document.createElement('div');
    typeIndicator.className = `player-type-indicator ${type}-indicator`;
    typeIndicator.textContent = type === 'human' ? 'Human' : 'Computer';
    
    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-player';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
        if (document.querySelectorAll('.player-input').length > 1) {
            playerDiv.remove();
        } else {
            alert("At least one player is required!");
        }
    });
    
    const itemsPerPlayer = parseInt(itemsPerPlayerInput.value) || 2;
    
    let playerContent = '';
    
    if (type === 'human') {
        playerContent = `
            <label for="name-${playerId}">Player Name:</label>
            <input type="text" id="name-${playerId}" placeholder="Enter your name" required>
            <div class="items-wrapper">
                <label>Favorite Items:</label>
                <div class="items-container" id="items-${playerId}">
                    ${generateItemInputs(playerId, itemsPerPlayer)}
                </div>
                <button type="button" class="action-button add-item-btn" onclick="addItemInput('${playerId}')">Add Item</button>
            </div>
        `;
    } else {
        // Computer player - generate random name and items
        const randomName = getRandomComputerName();
        playerContent = `
            <label for="name-${playerId}">Computer Name:</label>
            <input type="text" id="name-${playerId}" value="${randomName}" readonly>
            <div class="items-wrapper">
                <label>Favorite Items:</label>
                <div class="items-container" id="items-${playerId}">
                    ${generateComputerItems(playerId, itemsPerPlayer)}
                </div>
            </div>
        `;
    }
    
    playerDiv.innerHTML = playerContent;
    playerDiv.appendChild(typeIndicator);
    playerDiv.appendChild(removeBtn);
    
    playersContainer.appendChild(playerDiv);
    
    // Update itemsPerPlayer listener when config changes
    itemsPerPlayerInput.addEventListener('change', updateItemInputs);
}

function updateItemInputs() {
    const newItemsPerPlayer = parseInt(itemsPerPlayerInput.value) || 2;
    const playerDivs = document.querySelectorAll('.player-input');
    
    playerDivs.forEach(playerDiv => {
        const playerId = playerDiv.dataset.playerId;
        const itemsContainer = document.getElementById(`items-${playerId}`);
        const isComputer = playerDiv.classList.contains('computer-player');
        
        // Clear current items
        itemsContainer.innerHTML = '';
        
        // Add new items
        if (isComputer) {
            itemsContainer.innerHTML = generateComputerItems(playerId, newItemsPerPlayer);
        } else {
            itemsContainer.innerHTML = generateItemInputs(playerId, newItemsPerPlayer);
        }
    });
}

function generateItemInputs(playerId, count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        const itemId = `item-${playerId}-${i}`;
        html += `
            <div class="item-input">
                <input type="text" id="${itemId}" placeholder="Enter item ${i+1}" required>
                <button type="button" class="remove-item" onclick="removeItemInput('${playerId}', '${itemId}')">&times;</button>
            </div>
        `;
    }
    return html;
}

function generateComputerItems(playerId, count) {
    let html = '';
    const items = getRandomComputerItems(count);
    
    for (let i = 0; i < count; i++) {
        const itemId = `item-${playerId}-${i}`;
        html += `
            <div class="item-input">
                <input type="text" id="${itemId}" value="${items[i]}" readonly>
            </div>
        `;
    }
    return html;
}

function addItemInput(playerId) {
    const itemsContainer = document.getElementById(`items-${playerId}`);
    const itemCount = itemsContainer.querySelectorAll('.item-input').length;
    
    if (itemCount >= 5) {
        alert("Maximum 5 items per player allowed!");
        return;
    }
    
    const itemId = `item-${playerId}-${itemCount}`;
    const newItemDiv = document.createElement('div');
    newItemDiv.className = 'item-input';
    newItemDiv.innerHTML = `
        <input type="text" id="${itemId}" placeholder="Enter item ${itemCount+1}" required>
        <button type="button" class="remove-item" onclick="removeItemInput('${playerId}', '${itemId}')">&times;</button>
    `;
    
    itemsContainer.appendChild(newItemDiv);
}

function removeItemInput(playerId, itemId) {
    const itemsContainer = document.getElementById(`items-${playerId}`);
    const itemCount = itemsContainer.querySelectorAll('.item-input').length;
    
    if (itemCount <= 1) {
        alert("At least one item is required!");
        return;
    }
    
    document.getElementById(itemId).parentElement.remove();
}

function getRandomComputerName() {
    return computerNames[Math.floor(Math.random() * computerNames.length)];
}

function getRandomComputerItems(count) {
    // Shuffle the array and take 'count' items
    return shuffle([...computerItems]).slice(0, count);
}

function startGame() {
    // Get game configuration
    gameState.totalRounds = parseInt(numRoundsInput.value) || 10;
    gameState.itemsPerPlayer = parseInt(itemsPerPlayerInput.value) || 2;
    totalRounds.textContent = gameState.totalRounds;
    
    // Validate players
    const playerDivs = document.querySelectorAll('.player-input');
    if (playerDivs.length < 2) {
        alert("At least 2 players are required to play!");
        return;
    }
    
    // Reset game state
    gameState.players = [];
    gameState.playerTypes = [];
    gameState.originalPairs = [];
    gameState.scores = [];
    gameState.currentRound = 1;
    gameState.roundHistory = [];
    
    // Process each player
    let allItems = [];
    
    for (const playerDiv of playerDivs) {
        const playerId = playerDiv.dataset.playerId;
        const playerName = document.getElementById(`name-${playerId}`).value.trim();
        const isComputer = playerDiv.classList.contains('computer-player');
        
        if (!playerName) {
            alert("All player names must be filled!");
            return;
        }
        
        // Get player items
        const itemInputs = playerDiv.querySelectorAll('.item-input input');
        const playerItems = [];
        
        for (const input of itemInputs) {
            const item = input.value.trim();
            if (!item) {
                alert("All items must be filled!");
                return;
            }
            playerItems.push(item);
            allItems.push(item);
        }
        
        gameState.players.push(playerName);
        gameState.playerTypes.push(isComputer ? 'computer' : 'human');
        gameState.originalPairs.push(playerItems);
        gameState.scores.push(0);
    }
    
    // Check for unique items
    if (new Set(allItems).size !== allItems.length) {
        alert("All items must be unique! Please enter different items for each slot.");
        return;
    }
    
    // Switch to game section
    setupSection.style.display = 'none';
    gameSection.style.display = 'block';
    
    // Initialize scoreboard
    updateScoreTable();
    
    // Play first round
    playRound();
}

function playRound() {
    roundNumber.textContent = gameState.currentRound;
    
    // Get all items
    const allItems = gameState.originalPairs.flat();
    
    // Shuffle items
    const shuffledItems = shuffle([...allItems]);
    
    // Calculate items per player for this round
    const itemsPerPlayer = Math.floor(allItems.length / gameState.players.length);
    const remainder = allItems.length % gameState.players.length;
    
    // Distribute items to players
    const roundDistribution = [];
    const roundPoints = Array(gameState.players.length).fill(0);
    
    let itemIndex = 0;
    for (let i = 0; i < gameState.players.length; i++) {
        // Calculate how many items this player gets
        const playerItemCount = itemsPerPlayer + (i < remainder ? 1 : 0);
        const playerItems = [];
        
        for (let j = 0; j < playerItemCount; j++) {
            playerItems.push(shuffledItems[itemIndex++]);
        }
        
        roundDistribution.push(playerItems);
        
        // Check if this matches any original pair
        for (const [pIndex, pair] of gameState.originalPairs.entries()) {
            if (isSubsetMatch(playerItems, pair)) {
                roundPoints[i] = 1;
                break;
            }
        }
    }
    
    // Update scores
    for (let i = 0; i < gameState.players.length; i++) {
        gameState.scores[i] += roundPoints[i];
    }
    
    // Save round history
    gameState.roundHistory.push({
        distribution: roundDistribution,
        points: roundPoints
    });
    
    // Update UI
    updateRoundDisplay(roundDistribution, roundPoints);
    updateScoreTable();
    
    // Check if game is over
    if (gameState.currentRound === gameState.totalRounds) {
        nextRoundBtn.disabled = true;
        showGameResults();
    }
}

function isSubsetMatch(playerItems, originalPair) {
    // Check if originalPair is a subset of playerItems in any order
    if (originalPair.length > playerItems.length) return false;
    
    // For every possible subset of playerItems of size originalPair.length
    if (originalPair.length === 2) {
        // Optimization for the common case of pairs
        return playerItems.includes(originalPair[0]) && playerItems.includes(originalPair[1]);
    } else {
        // For the general case
        return originalPair.every(item => playerItems.includes(item));
    }
}

function updateRoundDisplay(distribution, points) {
    gamePlayersContainer.innerHTML = '';
    
    for (let i = 0; i < gameState.players.length; i++) {
        const playerCard = document.createElement('div');
        playerCard.className = `player-card ${points[i] === 1 ? 'match' : ''} ${gameState.playerTypes[i]}`;
        
        playerCard.innerHTML = `
            <div class="player-name">${gameState.players[i]} ${gameState.playerTypes[i] === 'computer' ? '(Computer)' : ''}</div>
            <div class="player-items">Items: ${distribution[i].join(', ')}</div>
            <div class="points">Round Points: <span class="round-point">${points[i]}</span></div>
            <div class="points">Total Score: ${gameState.scores[i]}</div>
        `;
        
        gamePlayersContainer.appendChild(playerCard);
    }
}

function updateScoreTable() {
    scoreTableBody.innerHTML = '';
    
    for (let i = 0; i < gameState.players.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gameState.players[i]}</td>
            <td>${gameState.playerTypes[i]}</td>
            <td>${gameState.scores[i]}</td>
        `;
        scoreTableBody.appendChild(row);
    }
}

function playNextRound() {
    const btn = this;
    btn.disabled = true;
    showLoader();

    gameState.currentRound++;

    const delay = Math.floor(Math.random() * 2000) + 1000; // 2000–5000 ms
    
    setTimeout(() => {
        btn.disabled = false;
        playRound();
        hideLoader();
    }, delay);
}

function showGameResults() {
    // Find the highest score
    const maxScore = Math.max(...gameState.scores);
    
    // Find all winners (could be tied)
    const winners = gameState.players.filter((_, index) => gameState.scores[index] === maxScore);
    
    // Highlight winners in scoreboard
    const rows = scoreTableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        if (gameState.scores[i] === maxScore) {
            rows[i].classList.add('winner');
        }
    }
    
    // Show winners message
    winnersElement.textContent = winners.join(', ');
    gameOverMessage.style.display = 'block';
}

function restartGame() {
    // Reset game state
    // gameState.players = [];
    // gameState.playerTypes = [];
    // gameState.originalPairs = [];
    gameState.currentRound = 1;

    gameState.scores = [];
    
    for (let index = 0; index < gameState.players.length; index++) {
        gameState.scores.push(0);        
    }

    

    gameState.roundHistory = [];
    
    // Reset UI
    // setupSection.style.display = 'block';
    //gameSection.style.display = 'none';
    nextRoundBtn.disabled = false;
    gameOverMessage.style.display = 'none';
    
    // Clear players except first one
    // const playerDivs = document.querySelectorAll('.player-input');
    // for (let i = 1; i < playerDivs.length; i++) {
    //     playerDivs[i].remove();
    // }
    
    // Reset first player to default
    //playersContainer.innerHTML = '';
    //addPlayer('human');

    updateScoreTable();

    playRound();
}

// Utility function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    
    return array;
}