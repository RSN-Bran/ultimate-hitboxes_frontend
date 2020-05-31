import React from "react"

import '../css/DataTable.css'
function DataEntry(props) {

  let style = {}
  if (props.hitbox.frames.includes(props.currentFrame)) {
    style.backgroundColor = props.hitbox.color
    if (props.hitbox.color === "yellow" || props.hitbox.color === "white") {
      style.color = "black"
    }
    else {
      style.color = "white"
    }
  }

  let frametd;
  if (props.hitbox.frames[0] !== undefined) {
    frametd = <td style={{ "cursor": "pointer"}}onClick={props.jumpToFrame.bind(this, props.hitbox.frames[0])}> {props.hitbox.frames[0]}</td>
  }
  else {
    frametd = <td></td>
  }

  return (
    <tr style={style}>

      {frametd}
      <td>{props.damageMultiplier ? parseFloat(props.hitbox.damage * 1.2).toFixed(1) : parseFloat(props.hitbox.damage).toFixed(1)}</td>
      <td>{props.hitbox.shielddamage}</td>
      <td>{props.hitbox.angle}&#176;</td>
      <td>{props.hitbox.bkb}</td>
      <td>{props.hitbox.kbg}</td>
      <td>{props.hitbox.fkb}</td>
      <td>{props.hitbox.trip}</td>
      <td><button onClick={props.updateHitboxData.bind(this, props.hitbox)} src="moreInfo"> More Data </button></td>
    </tr>

    
  )
}

export default DataEntry