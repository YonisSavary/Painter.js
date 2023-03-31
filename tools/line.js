class Line extends PainterTool
{
    static SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
    </svg>`

    startX;
    startY;

    start(event)
    {
        this.startX = event.canvasX;
        this.startY = event.canvasY;
    }

    tick(event)
    {
        this.painter.drawLast();

        this.context.beginPath()
        this.context.moveTo(this.startX, this.startY);
        this.context.lineTo(event.canvasX, event.canvasY);
        this.context.stroke();
    }
}

PainterTool.addTool(Line)
