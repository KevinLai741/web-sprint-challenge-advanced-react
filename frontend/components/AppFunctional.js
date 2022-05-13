import React, { useState } from 'react'
import axios from 'axios'

export default function AppFunctional(props) {
  const URL = 'http://localhost:9000/api/result'
  const initialGrid = [[false, false, false], 
                       [false, true, false], 
                       [false, false, false]]
  const [totalSteps, setTotalSteps] = useState(0)
  const [grid, setGrid] = useState(initialGrid)
  const [message, setMessage] = useState()
  const [emailInput, setEmailInput] = useState('')

  const getCoordinates = grid => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid.length; col++) { 
        if (grid[row][col]) return [row, col] 
      }
    }
  }

  const getFormattedCoordinates = (grid) => {
    const [row, col] = getCoordinates(grid)
    return `(${col + 1}, ${row + 1})`
  }

  const moveActiveSquare = (row, col) => {
    setGrid(grid.map((rowArr, i) => 
      rowArr.map((_, j) => (i === row && j === col) ? true : false
      )
    ))
    setTotalSteps(totalSteps + 1)
    setMessage()
  }

  const moveHandler = direction => {
    let [row, col] = getCoordinates(grid)

    if (direction === "left" && col > 0) {
      moveActiveSquare(row, col - 1)
    } else if (direction === "right" && col < 2) {
      moveActiveSquare(row, col + 1)
    } else if (direction === "up" && row > 0) {
      moveActiveSquare(row - 1, col)
    } else if (direction === "down" && row < 2) {
      moveActiveSquare(row + 1, col)
    } else {
      setMessage(`You can't go ${direction}`)
    }
  }

  const resetHandler = () => {
    setTotalSteps(0)
    setGrid(initialGrid)
    setEmailInput('')
    setMessage()
  }

  const inputChangeHandler = event => {
    const { value } = event.target
    setEmailInput(value)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    const [y, x] = getCoordinates(grid)
    const newPayload = { "x": x + 1, "y": y + 1, "steps": totalSteps, "email": emailInput } 
    axios.post(URL, newPayload)
      .then(response => setMessage(response.data.message))
      .catch(error => setMessage(error.response.data.message))
    setEmailInput('')
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getFormattedCoordinates(grid)}</h3>
        <h3 id="steps">You moved {totalSteps} time{totalSteps === 1 ? null : "s"}</h3>
      </div>
      <div id="grid">
        {
          grid.map((row, i) => {
            return row.map((square, j) => {
              const id = i * grid.length + j
              return square ? <div className="square active" key={id}>B</div> : <div className="square" key={id}></div>
            })
          })
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => moveHandler("left")}>LEFT</button>
        <button id="up" onClick={() => moveHandler("up")}>UP</button>
        <button id="right" onClick={() => moveHandler("right")}>RIGHT</button>
        <button id="down" onClick={() => moveHandler("down")}>DOWN</button>
        <button id="reset" onClick={resetHandler}>reset</button>
      </div>
      <form onSubmit={submitHandler}>
        <input id="email" type="email" placeholder="type email" onChange={inputChangeHandler} value={emailInput}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}