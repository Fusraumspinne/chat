import React from 'react'

function InputField({placeholder, onchange, type, classname, label}) {
  return (
    <div>
      <div>{label}</div>
      <input className={classname + " form-control"} placeholder={placeholder} onChange={onchange} type={type}/>
    </div>
  )
}

export default InputField