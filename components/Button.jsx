import React from 'react'

function Button({text, onclick, classname}) {
  return (
    <button className={"btn " + classname} onClick={onclick}>{text}</button>
  )
}

export default Button