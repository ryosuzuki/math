import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this
  }

  componentDidMount() {
    console.log('hello')
  }

  render() {
    return (
      <>
        <h1>Hello World</h1>
      </>
    )
  }
}

export default App
