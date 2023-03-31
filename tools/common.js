

class PainterContext
{
    static STROKE = "stoke";
    static FILL = "fill";

    context = null;
    #color = "black";
    #size = 3;
    #drawMode = PainterContext.STROKE;

    constructor(element) {
        this.context = element.getContext("2d", {alpha:false});
        this.context.lineCap = "round"
        this.setColor("black");
        this.setSize(5);
        this.setDrawMode(PainterContext.STROKE)
    }

    setDrawMode(mode){
        this.#drawMode = mode;
    }

    setColor(color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
        this.#color = color;
    }

    setSize(size) {
        this.context.lineWidth = size;
        this.#size = size;
    }

    getDrawMode() { return this.#drawMode }
    getSize() { return this.#size; }
    getColor() { return this.#color; }
}








class PainterTool
{
    static toolbox = [];

    static addTool(tool) {
        PainterTool.toolbox.push(tool);
    }

    constructor(painter, painterContext) {
        this.painter = painter;
        this.painterContext = painterContext;
        this.context = painterContext.context
    }
    start() {}
    end() {}
    tick() {}
    click() {}
}
