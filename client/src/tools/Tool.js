export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.ctx = canvas.getContext('2d')
        // нейкий обьект, который позволяет производить манипуляции на канвасу. Оставлять линии, фигуры 

        this.destroyEvents()
    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width
    }


    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
        // Когда меняем инструмент. Обнуляем события. Например сначала кисть, а потом кружок
    }
}