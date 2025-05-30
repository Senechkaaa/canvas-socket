import React, { useEffect, useRef, useState } from 'react'
import '../styles/canvas.scss'
import {observer} from 'mobx-react-lite'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush' 
import  {Modal, Button} from "react-bootstrap";
import {useParams} from 'react-router-dom'
import Rect from '../tools/Rect'
import axios from 'axios'

const Canvas = observer(() => {
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()

        useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])


    useEffect(() => {
    if (canvasState.username) {
        const socket = new WebSocket(`ws://localhost:5000/`)
        canvasState.setSocket(socket)
        canvasState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))

        socket.onopen = () => {
            socket.send(JSON.stringify({
                id: params.id,
                usernameRef: canvasState.username,
                method: 'connection'
            }))
        }   
        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data)
            switch(msg.method) {
                case "connection":
                    console.log(`Пользователь ${msg.username} присоединился`)
                break
                case "draw":
                    drawHandler(msg)
                break

            }
        }
    }  
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        console.log(msg)
        const ctx = canvasRef.current.getContext('2d')
        switch(figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
            break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height)
            break
            case "finish":
                ctx.beginPath()
            break

        }
    }

    const mouseDownHandler = () => {
        // когда пользователь отпустил линию, и записываем undo
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        // делаем снимок и добавляем в состояние

        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
        .then(responce => console.log(responce.data))
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

  return (
    <div className='canvas'>
         <Modal show={modal} onHide={() => {}}>
                <Modal.Header >
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input  ref={usernameRef} type="text"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
        <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}>
           
        </canvas>
    </div>
  )
})

export default Canvas