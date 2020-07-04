import React from 'react'
import Router from 'next/router'

class Home extends React.Component {
  componentDidMount() {
  }

  _redirect() {
    const roomId = 'wkkw'
    if (roomId) {
      Router.push(`/${roomId}`)
    } else {
      alert('Room Id is required')
    }
  }

  render() {
    return (
      <main className="container">
        <div className="container__content">
          <button onClick={this._redirect}>Start</button>
        </div>
      </main>
    )
  }
}


export default Home