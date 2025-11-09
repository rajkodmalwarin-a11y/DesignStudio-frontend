import React from 'react'
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store';

const ColorPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="absolute left-full ml-3">
      <SketchPicker 
        color={snap.color}
        disableAlpha
        presetColors={[
          '#FF6F61', '#6A0572', '#FFDD00', '#4B88A2',
          '#FFB6C1', '#0E79B2', '#FF3D68', '#F5A623',
          '#7FDBFF', '#B10DC9', '#81C784', '#A3CB38'
        ]}
        onChange={(color) => state.color = color.hex}
      />
    </div>
  )
}

export default ColorPicker