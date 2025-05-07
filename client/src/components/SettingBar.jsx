import React from 'react'
import '../styles/toolbar.scss'
import toolState from '../store/toolState'

const SettingBar = () => {
  return (
    <div className='setting-bar'>
        <label htmlFor='line-width'>
            Толщина линии
        </label>
        <input style={{margin: '0 10px'}} onChange={e => toolState.setLineWidth(e.target.value)} type='number' max={50} min={1} defaultValue={1} id='line-width'/>
        <label htmlFor='stroke-color'>
            Цвет обводки
        </label>
        <input style={{margin: '0 10px'}} onChange={e => toolState.setStrokeColor(e.target.value)} type='color'  id='stroke-color'/>
    </div>
  )
}

export default SettingBar