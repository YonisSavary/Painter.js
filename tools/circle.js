class Circle extends PainterTool
{
    static SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
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
            case PainterContext.FILL : this.drawFunction = "fill"; break;
            case PainterContext.STROKE : this.drawFunction = "stroke"; break;
        }
    }

    tick(event)
    {
        let deltaX = Math.abs(this.startX - event.canvasX);
        let deltaY = Math.abs(this.startY - event.canvasY);
        let radius = Math.sqrt( deltaX**2 + deltaY**2 )

        this.painter.drawLast();

        this.context.beginPath()
        this.context.arc(this.startX, this.startY, radius, 0, Math.PI*2);
        (this.context[this.drawFunction])();
    }
}

PainterTool.addTool(Circle)