import React from 'react'
import axios from 'axios'

export default class AppClass extends React.Component {
  URL = 'http://localhost:9000/api/result'
  initialGrid = [[false, false, false], 
                 [false, true, false], 
                 [false, false, false]]
  initialState = { totalSteps: 0, grid: this.initialGrid, message: null, emailInput: '' }
  constructor(props) {
    super(props)
    this.state = this.initialState
  }

  getCoordinates = grid => {
    for (let row = 0; row < grid.length; row++) { 
      for (let col = 0; col < grid.length; col++) { 
        if (grid[row][col]) return [row, col] 
      }
    }
  }

  getFormattedCoordinates = grid => {
      const [row, col] = this.getCoordinates(grid)
      return `(${col + 1}, ${row + 1})`
    }

  moveActiveSquare = (row, col) => {
      this.setState({...this.state, grid: 
        this.state.grid.map((rowArr, i) => 
          rowArr.map((_, j) => (i === row && j === col) ? true : false)
        ),
        totalSteps: this.state.totalSteps + 1, 
        message: null
      })
  }

  moveHandler = direction => {
    let [row, col] = this.getCoordinates(this.state.grid)

    if (direction === "left" && col > 0) {
      this.moveActiveSquare(row, col - 1)
    } else if (direction === "right" && col < 2) {
      this.moveActiveSquare(row, col + 1)
    } else if (direction === "up" && row > 0) {
      this.moveActiveSquare(row - 1, col)
    } else if (direction === "down" && row < 2) {
      this.moveActiveSquare(row + 1, col)
    } else {
      this.setState({...this.state, message: `You can't go ${direction}`})
    }
  }

  resetHandler = () => {
    this.setState(this.initialState)
  }

  inputChangeHandler = event => {
    const { value } = event.target
    this.setState({...this.state, emailInput: value})
  }

  submitHandler = event => {
    event.preventDefault()
    const [y, x] = this.getCoordinates(this.state.grid)
    const newPayload = { "x": x + 1, "y": y + 1, "steps": this.state.totalSteps, "email": this.state.emailInput } 
    axios.post(this.URL, newPayload)
      .then(response => this.setState({...this.state, message: response.data.message}))
      .catch(error => this.setState({...this.state, message: error.response.data.message}))
    this.setState({...this.state, emailInput: ''})
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.getFormattedCoordinates(this.state.grid)}</h3>
          <h3 id="steps">You moved {this.state.totalSteps} time{this.state.totalSteps === 1 ? null : "s"}</h3>
        </div>
        <div id="grid">
          {
            this.state.grid.map((row, i) => {
              return row.map((square, j) => {
                const id = i * this.state.grid.length + j
                return square ? <div className="square active" key={id}>B</div> : <div className="square" key={id}></div>
              })
            })
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.moveHandler("left")}>LEFT</button>
          <button id="up" onClick={() => this.moveHandler("up")}>UP</button>
          <button id="right" onClick={() => this.moveHandler("right")}>RIGHT</button>
          <button id="down" onClick={() => this.moveHandler("down")}>DOWN</button>
          <button id="reset" onClick={this.resetHandler}>reset</button>
        </div>
        <form onSubmit={this.submitHandler}>
          <input id="email" type="email" placeholder="type email" onChange={this.inputChangeHandler} value={this.state.emailInput}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
