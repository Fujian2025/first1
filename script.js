// Draw It! - Drawing Mini Game
// Main JavaScript file

// Game data - items with hints
const items = [
    { name: "Apple", hint: "A red or green fruit with a stem and sometimes a leaf" },
    { name: "House", hint: "A building with a roof, windows, and a door" },
    { name: "Tree", hint: "Has a trunk, branches, and green leaves" },
    { name: "Car", hint: "A vehicle with wheels, windows, and headlights" },
    { name: "Cat", hint: "A furry animal with pointy ears and whiskers" },
    { name: "Sun", hint: "A bright circle in the sky with rays shining out" },
    { name: "Flower", hint: "Has petals, a stem, and sometimes leaves" },
    { name: "Book", hint: "Rectangular with a cover and pages inside" },
    { name: "Cup", hint: "A container with a handle for drinking" },
    { name: "Hat", hint: "Worn on the head, often with a brim" },
    { name: "Fish", hint: "Swims in water, has fins and a tail" },
    { name: "Star", hint: "A shape with five or more points" },
    { name: "Cloud", hint: "Fluffy and white in the sky" },
    { name: "Pencil", hint: "Used for writing, has a pointy tip" },
    { name: "Clock", hint: "Round with numbers and hands that show time" },
    { name: "Key", hint: "Used to open locks, has teeth on one end" },
    { name: "Butterfly", hint: "An insect with colorful wings" },
    { name: "Mountain", hint: "A tall landform with a peak" },
    { name: "Rainbow", hint: "An arch of colors in the sky after rain" },
    { name: "Robot", hint: "A machine that can move and sometimes talk" },
    { name: "Ice Cream", hint: "A cold dessert in a cone or cup" },
    { name: "Bicycle", hint: "A two-wheeled vehicle with pedals" },
    { name: "Balloon", hint: "Floats in the air when filled with gas" },
    { name: "Guitar", hint: "A musical instrument with strings and a body" },
    { name: "Light Bulb", hint: "Glows when turned on, usually pear-shaped" }
];

// Game state
let currentItem = null;
let drawingTime = 0;
let timerInterval = null;
let strokeCount = 0;
let drawingHistory = [];
let currentHistoryIndex = -1;

// Canvas setup
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let brushSize = 5;

// DOM elements
const itemNameElement = document.getElementById('item-name');
const hintTextElement = document.getElementById('hint-text');
const hintBoxElement = document.getElementById('hint-box');
const newItemButton = document.getElementById('new-item-btn');
const hintButton = document.getElementById('hint-btn');
const clearButton = document.getElementById('clear-btn');
const undoButton = document.getElementById('undo-btn');
const saveButton = document.getElementById('save-btn');
const colorOptions = document.querySelectorAll('.color-option');
const customColorPicker = document.getElementById('custom-color');
const brushSlider = document.getElementById('brush-slider');
const brushCircle = document.getElementById('brush-circle');
const brushSizeText = document.getElementById('brush-size-text');
const drawingTimeElement = document.getElementById('drawing-time');
const strokeCountElement = document.getElementById('stroke-count');

// Initialize the game
function init() {
    // Set canvas background to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load a random item
    getRandomItem();

    // Setup event listeners
    setupEventListeners();

    // Initialize drawing tools
    updateBrushPreview();
    setActiveColor(currentColor);

    // Start the timer
    startTimer();

    // Initialize drawing history with blank canvas
    saveDrawingState();

    console.log("Draw It! game initialized");
}

// Get a random item from the list
function getRandomItem() {
    const randomIndex = Math.floor(Math.random() * items.length);
    currentItem = items[randomIndex];

    itemNameElement.textContent = currentItem.name;
    hintTextElement.textContent = currentItem.hint;
    hintBoxElement.style.display = 'none';

    // Reset drawing time and strokes for new item
    drawingTime = 0;
    strokeCount = 0;
    updateStats();

    // Clear the canvas
    clearCanvas();

    // Reset history
    drawingHistory = [];
    currentHistoryIndex = -1;
    saveDrawingState();

    // Update icon based on item name (simple mapping)
    updateItemIcon(currentItem.name);
}

// Update the item icon based on name
function updateItemIcon(itemName) {
    const iconMap = {
        'Apple': 'fas fa-apple-alt',
        'House': 'fas fa-home',
        'Tree': 'fas fa-tree',
        'Car': 'fas fa-car',
        'Cat': 'fas fa-cat',
        'Sun': 'fas fa-sun',
        'Flower': 'fas fa-seedling',
        'Book': 'fas fa-book',
        'Cup': 'fas fa-mug-hot',
        'Hat': 'fas fa-hat-cowboy',
        'Fish': 'fas fa-fish',
        'Star': 'fas fa-star',
        'Cloud': 'fas fa-cloud',
        'Pencil': 'fas fa-pencil-alt',
        'Clock': 'fas fa-clock',
        'Key': 'fas fa-key',
        'Butterfly': 'fas fa-butterfly',
        'Mountain': 'fas fa-mountain',
        'Rainbow': 'fas fa-rainbow',
        'Robot': 'fas fa-robot',
        'Ice Cream': 'fas fa-ice-cream',
        'Bicycle': 'fas fa-bicycle',
        'Balloon': 'fas fa-baloon',
        'Guitar': 'fas fa-guitar',
        'Light Bulb': 'fas fa-lightbulb'
    };

    const itemIcon = document.querySelector('.item-icon i');
    const defaultIcon = 'fas fa-question-circle';
    const iconClass = iconMap[itemName] || defaultIcon;

    // Remove all existing classes and add new ones
    itemIcon.className = iconClass;
}

// Setup all event listeners
function setupEventListeners() {
    // Canvas drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Control buttons
    newItemButton.addEventListener('click', getRandomItem);
    hintButton.addEventListener('click', showHint);
    clearButton.addEventListener('click', clearCanvas);
    undoButton.addEventListener('click', undoLastStroke);
    saveButton.addEventListener('click', saveDrawing);

    // Color picker
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            setActiveColor(color);
            customColorPicker.value = color;
        });
    });

    customColorPicker.addEventListener('input', function() {
        setActiveColor(this.value);
    });

    // Brush size slider
    brushSlider.addEventListener('input', function() {
        brushSize = parseInt(this.value);
        updateBrushPreview();
    });
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);

    // Start a new path
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

function draw(e) {
    if (!isDrawing) return;

    e.preventDefault();

    const [x, y] = getCoordinates(e);

    // Set drawing style
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;

    // Draw line
    ctx.lineTo(x, y);
    ctx.stroke();

    // Update last coordinates
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;

        // Increment stroke count
        strokeCount++;
        updateStats();

        // Save drawing state for undo functionality
        saveDrawingState();
    }
}

// Touch handling for mobile
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing(touch);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    draw(touch);
}

function handleTouchEnd(e) {
    e.preventDefault();
    stopDrawing();
}

// Get coordinates from mouse or touch event
function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return [
        (clientX - rect.left) * scaleX,
        (clientY - rect.top) * scaleY
    ];
}

// Tool functions
function setActiveColor(color) {
    currentColor = color;

    // Update active color in picker
    colorOptions.forEach(option => {
        if (option.getAttribute('data-color') === color) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function updateBrushPreview() {
    brushCircle.style.width = `${brushSize * 2}px`;
    brushCircle.style.height = `${brushSize * 2}px`;
    brushSizeText.textContent = `${brushSize}px`;
}

function showHint() {
    hintBoxElement.style.display = 'block';
}

function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reset stroke count
    strokeCount = 0;
    updateStats();

    // Save cleared state
    saveDrawingState();
}

function undoLastStroke() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        restoreDrawingState();

        // Decrement stroke count if possible
        if (strokeCount > 0) {
            strokeCount--;
            updateStats();
        }
    } else if (currentHistoryIndex === 0) {
        // Go back to blank canvas
        currentHistoryIndex = -1;
        clearCanvas();
    }
}

function saveDrawingState() {
    // Save current canvas state as image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Remove any future states if we're not at the end
    drawingHistory = drawingHistory.slice(0, currentHistoryIndex + 1);

    // Add new state
    drawingHistory.push(imageData);
    currentHistoryIndex = drawingHistory.length - 1;

    // Update undo button state
    undoButton.disabled = currentHistoryIndex < 0;
}

function restoreDrawingState() {
    if (currentHistoryIndex >= 0 && currentHistoryIndex < drawingHistory.length) {
        const imageData = drawingHistory[currentHistoryIndex];
        ctx.putImageData(imageData, 0, 0);
    }
}

// Timer functions
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        drawingTime++;
        updateStats();
    }, 1000);
}

function updateStats() {
    // Format time as MM:SS
    const minutes = Math.floor(drawingTime / 60);
    const seconds = drawingTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    drawingTimeElement.textContent = `Time: ${timeString}`;
    strokeCountElement.textContent = `Strokes: ${strokeCount}`;
}

// Save drawing as image
function saveDrawing() {
    // Create a temporary link
    const link = document.createElement('a');
    link.download = `draw-it-${currentItem.name.toLowerCase().replace(' ', '-')}-${Date.now()}.png`;

    // Convert canvas to data URL
    link.href = canvas.toDataURL('image/png');

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show feedback
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-check"></i> Saved!';
    saveButton.classList.add('btn-success');

    setTimeout(() => {
        saveButton.innerHTML = originalText;
    }, 2000);
}

// Initialize the game when page loads
window.addEventListener('load', init);