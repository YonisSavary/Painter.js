class Text extends PainterTool
{
    static SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
        <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z"/>
    </svg>`

    startX;
    startY;
    element= null;
    fontSize = 0;

    click(event)
    {
        this.startX = event.canvasX;
        this.startY = event.canvasY;

        this.element = document.createElement("textarea");
        this.element.classList = "painter-invisible-text-input"
        this.element.display = `none`;
        this.element.visibility = `hidden`;

        let canvasSection = this.painter.root.querySelector(".painter-canvas-section");
        canvasSection.appendChild(this.element);
        this.element.focus();
        this.element.addEventListener("focusout", ()=>{
            this.element.focus();
        })
        this.element.addEventListener("keyup", (event)=>{
            this.update(event);
        })


        this.fontSize = (this.painterContext.getSize()*3)+5
        this.context.font = `${this.fontSize}px sans-serif`;
        this.context.textBaseline = `top`;
    }

    update(event)
    {
        this.painter.drawLast();

        this.element.value.split("\n").forEach((line, i)=>{
            this.context.fillText(line, this.startX, this.startY + (this.fontSize*i));
        });

        if (event.keyCode == 13 && event.shiftKey == false)
        {
            this.element.remove();
            this.painter.captureSnapshot();
        }
    }
}



PainterTool.addTool(Text)