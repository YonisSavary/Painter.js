const PAINTER_COLORS = [
    "#000",
    "#FFF",
    "#fb3434",
    "#fbff00",
    "#3bec3e",
    "#3e9cfa",
    "#cc53ed",
]

class Painter
{
    options = {};
    tool = null;
    mouseIsDown = false;
    canvas = null;
    canvasBoundingRect = null;

    static DEFAULT_OPTIONS = {
        width: 500,
        height: 500,
        snapshots: 50,
        context: {
            color: 'black',
            size: 5,
            drawMode: 'fill'
        }
    };

    setActiveElement(element)
    {
        console.log(element);
        element.parentNode.querySelectorAll(".active").forEach(x => {
            x.classList.remove("active");
        })
        element.classList.add("active");
    }

    constructor(root, options=Painter.DEFAULT_OPTIONS)
    {
        options = this.options = {...Painter.DEFAULT_OPTIONS, ...options};
        this.root = root;


        this.root.innerHTML = `
        <section class="painter-section">
            <section class="painter-tool-bar">
                <section class="painter-tool-list">
                    ${PainterTool.toolbox.map(x => `
                    <div class="painter-tool painter-clickable" tool="${x.prototype.constructor.name}">${x.SVG}</div>
                    `).join("")}
                </section>

                <section class="painter-tool-list">
                    <div class="painter-draw-mode painter-clickable" mode="${PainterContext.STROKE}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                    </div>
                    <div class="painter-draw-mode painter-clickable" mode="${PainterContext.FILL}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>
                    </div>
                </section>


                <section class="painter-tool-list">
                    <div class="painter-size painter-clickable" size="3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2"/></svg>
                    </div>
                    <div class="painter-size painter-clickable" size="6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5"/></svg>
                    </div>
                    <div class="painter-size painter-clickable" size="10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>
                    </div>
                </section>


                <section class="painter-tool-list no-active-mode">
                    <div class="painter-undo painter-clickable">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>
                    </div>
                    <div class="painter-redo painter-clickable">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>
                    </div>
                </section>

                <section class="painter-tool-list">
                    ${PAINTER_COLORS.map(x => `
                    <div class="painter-color painter-clickable" style="background-color: ${x}" color="${x}"></div>
                    `).join("")}
                    <label class="painter-color painter-clickable painter-color-picker">
                        <input type="color">
                    </label>
                </section>
            </section>
            <section class="painter-canvas-section">
                <canvas width="${options.width}" height="${options.height}"></canvas>
            <section>
        </section>
        `



        this.root.querySelectorAll(".painter-draw-mode").forEach(x => {
            x.addEventListener("click", ()=> this.setDrawMode(x.getAttribute("mode")) );
        });

        this.root.querySelectorAll(".painter-undo").forEach(x => {
            x.addEventListener("click", ()=> this.undo() );
        });
        this.root.querySelectorAll(".painter-redo").forEach(x => {
            x.addEventListener("click", ()=> this.redo() );
        });

        this.root.querySelectorAll(".painter-color").forEach(x => {
            x.addEventListener("click", ()=> this.selectColor(x.getAttribute("color")) );
        })
        this.root.querySelectorAll(".painter-color-picker input").forEach(x => {
            x.addEventListener("change", ()=> this.selectColor(x.value) );
        });
        this.root.querySelectorAll(".painter-tool").forEach(x => {
            x.addEventListener("click", ()=> this.selectTool(x.getAttribute("tool")) );
        })

        this.root.querySelectorAll(".painter-size").forEach(x => {
            x.addEventListener("click", ()=> this.selectSize(x.getAttribute("size")) );
        })

        this.root.querySelectorAll(".painter-tool-list:not(.no-active-mode) > *").forEach(x => {
            x.addEventListener("click", ()=>this.setActiveElement(x));
        })

        let canvas = this.canvas = this.root.querySelector("canvas");
        canvas.addEventListener("click", this.handleClick.bind(this))
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))


        let context = this.context = new PainterContext(this.root.querySelector("canvas"));

        context.setColor("white");
        context.context.fillRect(0, 0, options.width, options.height)
        context.setColor("black");

        this.root.querySelectorAll(".painter-tool-list:not(.no-active-mode) > *:first-child").forEach(x => {
            x.click();
        })

        this.captureSnapshot();
    }




    setDrawMode(mode)
    {
        this.context.setDrawMode(mode);
    }

    selectColor(color)
    {
        this.context.setColor(color);
    }
    selectSize(size)
    {
        this.context.setSize(size);
    }

    selectTool(toolName)
    {
        let tool = PainterTool.toolbox.find(x => x.prototype.constructor.name == toolName);
        this.tool = new (tool)(this, this.context);
    }




    findEventCoordinates(event)
    {
        event.canvasX = Math.round(event.clientX - this.canvasBoundingRect.left);
        event.canvasY = Math.round(event.clientY - this.canvasBoundingRect.top);
        return event;
    }

    handleClick(event)
    {
        this.tool.click(this.findEventCoordinates(event));
    }

    handleMouseDown(event)
    {
        this.mouseIsDown = true;
        this.canvasBoundingRect = this.canvas.getBoundingClientRect();
        this.tool.start(this.findEventCoordinates(event));
    }

    handleMouseUp(event)
    {
        this.mouseIsDown = false;
        this.tool.end(this.findEventCoordinates(event));
        this.captureSnapshot()
    }

    handleMouseMove(event)
    {
        if (!this.mouseIsDown)
        return;

        this.tool.tick(this.findEventCoordinates(event));
    }







    snapshots = [];
    canceledSnapshots = []

    drawLast()
    {
        let toDisplay = this.snapshots[this.snapshots.length-1];
        this.context.context.putImageData(toDisplay, 0, 0);
    }

    undo()
    {
        if (this.snapshots.length < 2)
            return;

        let toCancel = this.snapshots.pop();
        this.canceledSnapshots.push(toCancel)
        this.drawLast()
    }

    redo()
    {
        if (!this.canceledSnapshots.length)
            return;

        let toDisplay = this.canceledSnapshots.pop();
        this.snapshots.push(toDisplay);
        this.context.context.putImageData(toDisplay, 0, 0);
    }

    captureSnapshot()
    {
        this.canceledSnapshots = [];

        let data = this.context.context.getImageData(0, 0, this.options.width, this.options.height);
        this.snapshots.push(data);
        if (this.snapshots.length > this.options.snapshots)
            this.snapshots.shift();
    }






    async toFile()
    {
        return new Promise((resolve, reject) => {
            try
            {
                this.canvas.toBlob(blob => {
                    let f = new File([blob], "sketch.png", {type: "image/png"})
                    resolve(f);
                })
            }
            catch(error)
            {
                reject(error);
            }
        })
    }


    download(filename="sketch.png")
    {
        this.canvas.toBlob(blob => {
            var element = document.createElement('a');
            element.href =  window.URL.createObjectURL(blob, {type: 'image/png'});
            element.download = filename;

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();
            element.remove();
        })
    }
}