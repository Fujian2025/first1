# Draw It! - Drawing Mini Game

A fun web-based drawing game where you get a random item name and draw it on a canvas.

## Features

- **Random Item Generator**: Get a random item to draw from a list of 25+ items
- **Drawing Canvas**: Full-featured drawing canvas with mouse and touch support
- **Drawing Tools**:
  - 8 preset colors + custom color picker
  - Adjustable brush size (1px to 50px)
  - Undo functionality
  - Clear canvas
- **Game Features**:
  - Timer to track drawing time
  - Stroke counter
  - Hints for each item
  - Save your drawing as PNG
- **Responsive Design**: Works on desktop and mobile devices

## How to Play

1. Open `index.html` in a web browser
2. You'll see a random item name at the top
3. Use the drawing tools on the left to customize your brush
4. Draw the item on the canvas as best as you can!
5. Use "New Random Item" to get a new challenge
6. Save your masterpiece with the "Save Drawing" button

## Files

- `index.html` - Main HTML file
- `style.css` - Styling for the game
- `script.js` - Game logic and drawing functionality

## Running the Game

### Option 1: Direct File Open
Simply open `index.html` in your web browser (Chrome, Firefox, Edge, etc.).

### Option 2: Local Server (Recommended)
For best results, run a local HTTP server:

**Using Python:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Using Node.js with http-server:**
```bash
npx http-server
```

## Browser Compatibility

The game works on all modern browsers that support HTML5 Canvas:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Customization

### Adding More Items
Edit the `items` array in `script.js` to add more drawing challenges:

```javascript
const items = [
    { name: "Your Item", hint: "Your hint here" },
    // ... more items
];
```

### Changing Colors
Edit the color options in `index.html` (look for `color-option` elements) and `style.css`.

### Adjusting Canvas Size
Change the canvas dimensions in `index.html`:
```html
<canvas id="drawing-canvas" width="800" height="600"></canvas>
```

## Credits

Created with Claude Code as a fun drawing mini game.

## License

Free to use and modify for personal or educational purposes.