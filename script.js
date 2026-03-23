// Draw It! - Drawing Mini Game
// Main JavaScript file

// Game data - items with hints
const items = [
    { name: "苹果", hint: "一种红色或绿色的水果，有茎，有时有叶子" },
    { name: "房子", hint: "有屋顶、窗户和门的建筑物" },
    { name: "树", hint: "有树干、树枝和绿叶" },
    { name: "汽车", hint: "有轮子、窗户和前灯的车辆" },
    { name: "猫", hint: "有尖耳朵和胡须的毛茸茸动物" },
    { name: "太阳", hint: "天空中的明亮圆盘，散发着光芒" },
    { name: "花", hint: "有花瓣、茎，有时有叶子" },
    { name: "书", hint: "长方形，有封面和里面的页面" },
    { name: "杯子", hint: "有把手的饮水容器" },
    { name: "帽子", hint: "戴在头上，通常有帽檐" },
    { name: "鱼", hint: "在水中游泳，有鳍和尾巴" },
    { name: "星星", hint: "有五个或更多点的形状" },
    { name: "云", hint: "天空中蓬松的白色云朵" },
    { name: "铅笔", hint: "用于书写，有尖尖的笔尖" },
    { name: "时钟", hint: "圆形，有数字和显示时间的指针" },
    { name: "钥匙", hint: "用于开锁，一端有齿" },
    { name: "蝴蝶", hint: "有彩色翅膀的昆虫" },
    { name: "山", hint: "有山峰的高大地形" },
    { name: "彩虹", hint: "雨后天空中的彩色拱形" },
    { name: "机器人", hint: "可以移动，有时会说话的机器" },
    { name: "冰淇淋", hint: "装在蛋筒或杯子里的冷甜点" },
    { name: "自行车", hint: "有踏板的两轮车辆" },
    { name: "气球", hint: "充气后漂浮在空中的气球" },
    { name: "吉他", hint: "有弦和琴身的乐器" },
    { name: "灯泡", hint: "通电时会发光，通常呈梨形" }
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

    console.log("画一画！游戏已初始化");
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
        '苹果': 'fas fa-apple-alt',
        '房子': 'fas fa-home',
        '树': 'fas fa-tree',
        '汽车': 'fas fa-car',
        '猫': 'fas fa-cat',
        '太阳': 'fas fa-sun',
        '花': 'fas fa-seedling',
        '书': 'fas fa-book',
        '杯子': 'fas fa-mug-hot',
        '帽子': 'fas fa-hat-cowboy',
        '鱼': 'fas fa-fish',
        '星星': 'fas fa-star',
        '云': 'fas fa-cloud',
        '铅笔': 'fas fa-pencil-alt',
        '时钟': 'fas fa-clock',
        '钥匙': 'fas fa-key',
        '蝴蝶': 'fas fa-butterfly',
        '山': 'fas fa-mountain',
        '彩虹': 'fas fa-rainbow',
        '机器人': 'fas fa-robot',
        '冰淇淋': 'fas fa-ice-cream',
        '自行车': 'fas fa-bicycle',
        '气球': 'fas fa-baloon',
        '吉他': 'fas fa-guitar',
        '灯泡': 'fas fa-lightbulb'
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

    drawingTimeElement.textContent = `时间：${timeString}`;
    strokeCountElement.textContent = `笔划：${strokeCount}`;
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
    saveButton.innerHTML = '<i class="fas fa-check"></i> 已保存！';
    saveButton.classList.add('btn-success');

    setTimeout(() => {
        saveButton.innerHTML = originalText;
    }, 2000);
}

// Initialize the game when page loads
window.addEventListener('load', init);