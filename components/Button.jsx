import React from 'react'

function Button({text, onclick, classname}) {
  return (
    <button className={classname + " btn btn-primary"} onClick={onclick}>{text}</button>
  )
}

export default Button