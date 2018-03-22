import React, { Component } from 'react'
import './App.css'
import { times } from 'lodash'

class App extends Component {
  constructor(){
    super()
    this.state = {
      cells:0,
      grid: [...times(10)].map(row => [...times(10)]),
      gridWithItems: [],
      spans: {
        hearts: [],
        spades: [],
        diams: [],
        clubs: []
      }
    }
  }
  
  handleClick = (x, y) => {
    if(this.state.cells > 1){
      this.setState(prevState => {
        this.setState(state => {
          return {
            grid: state.grid.map((row,i) => row.map((col,j) => {
              if(col.marked)
                return {...col, visible: false}
              else return col
            }))
          }
        })
        return {
          gridWithItems: 
            prevState.gridWithItems.map((rows,i) => {
            return rows.map((col,j) => {
              if(this.state.grid[i][j]["marked"])
                return <span></span>
              else return col
            })
          })
        }
      })
    }
  }

  checkAndMark = (x, y, target) => {
    this.setState(prevState => {
      if (prevState.grid[x][y]["target"] === target && !prevState.grid[x][y]["marked"]) {
        this.setState(prevState => {
          return {
            grid: 
              prevState.grid.map((row,i) => 
                row.map((col,j) => (i === x && j === y && col.target === target) ? {...col, marked: true} : col)
            ),
            cells: prevState.cells + 1
          }
        })
        if (x > 0) this.checkAndMark(x-1, y, target)
        if (x < 9) this.checkAndMark(x+1, y, target)
        if (y > 0) this.checkAndMark(x, y-1, target)
        if (y < 9)this.checkAndMark(x, y+1, target)
      }
      return {
        gridWithItems:
          (prevState.cells > 1)
            ? prevState.gridWithItems.map((rows, i) => 
                rows.map((col,j) => {
                  if (prevState.grid[i][j]["marked"] && prevState.grid[i][j]["visible"]) {
                    let className = "white"
                    switch(prevState.grid[i][j]["target"]){
                      case "hearts":
                        return <span className={className}>&hearts;</span>
                      case "spades":
                        return <span className={className}>&spades;</span>
                      case "diams":
                        return <span className={className}>&diams;</span>
                      case "clubs":
                        return <span className={className}>&clubs;</span>
                      default: <span></span>
                    }
                  } else return col
                })
              ) : prevState.gridWithItems
      }
    })
  }

  handleOver = (x, y) => {
      this.setState({cells: 0})
      this.checkAndMark(x, y, this.state.grid[x][y]["target"])
  }

  handleOut = (x, y) => {
    this.setState(prevState => {
      this.setState(state => {
        return {
          gridWithItems:
            state.gridWithItems.map((rows, i) => 
              rows.map((col,j) => {
                if (!state.grid[i][j]["marked"] && state.grid[i][j]["visible"]) {
                  switch(state.grid[i][j]["target"]){
                    case "hearts":
                      return <span className="hearts">&hearts;</span>
                    case "spades":
                      return <span className="spades">&spades;</span>
                    case "diams":
                      return <span className="diams">&diams;</span>
                    case "clubs":
                      return <span className="clubs">&clubs;</span>
                    default: <span></span>
                  }
                } else return col
              })
            )
        } 
      })
    return {
      grid: 
        prevState.grid.map((row,i) => 
          row.map((col,j) => (col.marked === true) ? {...col, marked: false} : col)
        )
    }})
  }
  
  renderTable = () => {
      const randomizer = (x, y) => {
        let randomNumber = 1+ Math.floor(Math.random()*4) 
        switch(randomNumber) {
          case 1:
            this.setState(state => ({
              spans: {
                ...state.spans,
                hearts: [
                  ...state.spans.hearts,
                  { x: x, y: y }
                ]
              }}))
            return <span className="hearts">&hearts;</span>
          case 2:
            this.setState(state => ({
              spans: {
                ...state.spans,
                spades: [
                  ...state.spans.spades, 
                  { x: x, y: y }
                ]
              }
            }))
            return <span className="spades" >&spades;</span>
          case 3: 
          this.setState(state => ({
            spans: {
              ...state.spans,
              diams: [
                ...state.spans.diams,
                { x: x, y: y }
              ]
            }
          }))
            return <span  className={"diams"} >&diams;</span>
          case 4:
          this.setState(state => ({
            spans: {
              ...state.spans,
              clubs: [
                ...state.spans.clubs,
                { x: x, y: y }
              ]
            }
          }))
            return <span className="clubs">&clubs;</span>
          default: <span></span>
        }
      }

      let table = new Array(10).fill(new Array(10).fill(null)).map((rows, i) => {
        let row = () =>  {
          return rows.map((item,j) => {
            return randomizer(i, j)
          })
        }
        return row()
      })

      this.setState(state => ({
        grid: 
          state.grid.map((row,i) => 
            row.map((col,j) => {
              let el = ""
              for (let key in this.state.spans){
                state.spans[key].forEach(item => {
                  if(item.x === i && item.y === j) el = key
                })
              }
              return {
                target: el,
                marked: false,
                visible: true
              }
            })
          ),
          gridWithItems: table
      }))
  }

  componentDidMount() {
    this.renderTable()
  }
  
  render() {
    const { gridWithItems } = this.state
    return (
      <div className="App">
        <table cellPadding="0" border="0" cellSpacing="0">
          <tbody>
            {gridWithItems.map((rows, i) => {
                let row = () =>  {
                  return rows.map((cell,j) => (
                    <td 
                      id={i+'_'+j} 
                      key={j}
                      onMouseOver={() => this.handleOver(i, j)}
                      onMouseOut={() => this.handleOut(i, j)}
                      onClick={() => this.handleClick(i, j)}
                    >{cell}</td>
                  ))
                }
                return <tr key={i}>{row()}</tr>
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
