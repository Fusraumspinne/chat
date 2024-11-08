import React from 'react'

function InputField({placeholder, onchange}) {
  return (
    <input type="text" placeholder={placeholder} onChange={onchange}/>
  )
}

export default InputField