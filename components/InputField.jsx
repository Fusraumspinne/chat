import React from 'react'

function InputField({placeholder, onchange, type, classname, label, accept }) {
  return (
    <div>
      <div>{label}</div>
      <input className={classname + " form-control"} placeholder={placeholder} onChange={onchange} type={type} accept={accept}/>
    </div>
  )
}

export default InputField