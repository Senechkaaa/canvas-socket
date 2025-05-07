import Tool from './Tool'
export default class Rect extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id)
        // будет вызывать конструктор родительского класс Tool

        this.listen()
        // после создания обьекта (context), будет слушать все эти функции
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
                this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'rect',
                    x: this.startX,
                    y: this.startY,
                    width: this.width,
                    height: this.height,
                }
            }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        // кнопка нажата

        this.ctx.beginPath()
        // мы начали рисовать новую линию
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        // получили стартовую координату
        this.saved = this.canvas.toDataURL()
        // сохраняем изображение из canvas
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX =  e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x, y, w, h) {

// очищает canvas каждый раз, чтобы не оставались следы от движения мыши.


        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            // работает когда событие загрузилось
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // чтобы не рисовалось несколько квадратов сразу, очищаем все
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            // рисуем, что мы сохранили
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
            //  То есть мы сохранили изображние, после очистили (чтобы не было несколько квадратов сразу) и вновь нарисовали изображение, который сохранили 
        }
        this.ctx.rect(x, y, w, h)
        this.ctx.fill()
        // fill внутренность
        this.ctx.stroke()
        // stroke - обводка
        console.log('draw rect')
    }


    static staticDraw(ctx, x, y, w, h) {
            ctx.beginPath()
            ctx.rect(x, y, w, h)
            ctx.fill()
            ctx.stroke()
    }
}