import {makeAutoObservable} from 'mobx'

class ToolState {
    tool = null
    constructor() {
        makeAutoObservable(this)
    }

    setTool(tool) {
        this.tool = tool
    }

    setFillColor(color) {
        this.tool.fillColor = color
        // изменяем context
    }

    setStrokeColor(color) {
        this.tool.strokeColor = color
        // изменяем context
    }

    setLineWidth(width) {
        this.tool.lineWidth = width
        // изменяем context
    }



}

export default new ToolState()