import Tool from './Tool'
export default class Brush extends Tool {
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
                    type: 'finish',
                }
            }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        // кнопка нажата

        this.ctx.beginPath()
        // мы начали рисовать новую линию
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        // перемещаем курсор. Длина страницы - отнимаем левый оступ от канваса
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                }
            }))
        }
    }

    static draw(ctx, x, y) {
        ctx.lineTo(x, y)
        // рисуем линию
        ctx.stroke()
        // добавляем цвет линии
    }
}