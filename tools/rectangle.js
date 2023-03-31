class Rectangle extends PainterTool
{
    static SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    </svg>`

    startX;
    startY;
    drawFunction;

    start(event)
    {
        this.startX = event.canvasX;
        this.startY = event.canvasY;
        switch (this.painterContext.getDrawMode())
        {
            case PainterContext.FILL : this.drawFunction = "fillRect"; break;
            case PainterContext.STROKE : this.drawFunction = "strokeRect"; break;
        }
    }

    tick(event)
    {
        this.painter.drawLast();
        (this.context[this.drawFunction])(this.startX, this.startY, event.canvasX-this.startX, event.canvasY-this.startY);
    }
}


PainterTool.addTool(Rectangle)