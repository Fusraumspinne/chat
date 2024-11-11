import React from 'react'

function InputField({placeholder, onchange, type, classname, label, accept, value }) {
  return (
    <div>
      <div>{label}</div>
      <input className={classname + " form-control"} placeholder={placeholder} onChange={onchange} type={type} accept={accept} value={value}/>
    </div>
  )
}

export default InputField