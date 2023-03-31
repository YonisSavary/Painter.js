# Painter.js
Basic paint library for Javascript

## Usage

```html
<link rel="stylesheet" href="painter.css">

<script src="./tools/common.js"></script>

<script src="./tools/pencil.js"></script>
<script src="./tools/rectangle.js"></script>
<script src="./tools/line.js"></script>
<script src="./tools/circle.js"></script>
<script src="./tools/text.js"></script>

<script src="painter.js"></script>

<div id="painterSlot"></div>
```
```js
let instance = new Painter(painterSlot, {width: 1000})

// Accessing Canvas Element
instance.canvas

// Accessing PainterContext
instance.context

// Access Raw CanvasRenderingContext2D
instance.context.context

// Get a file that you can upload
await instance.toFile()

// Directly download the picture
instance.download("mySketch.png")
```


# Add a tool

To add a tool, create a class that respects `PainterTool` and add it with `PainterTool.addTool()` before you create any instance

- `start` is called when the mouse primary button is down
- `tick` is called when the mouse primary button is down and moving
- `end` is called when the mouse primary button is up
- `click` is called when the canvas is clicked

for each function an event parameter is given, those event got two specials attributes :
- `canvasX` : relative X click coordinate to the canvas
- `canvasY` : relative Y click coordinate to the canvas


```js
class MyNewTool extends PainterTool
{
    static SVG = "..."

    start() { }
    end() { }
    tick() { }
    click() { }
}

PainterTool.addTool(MyNewTool)
```