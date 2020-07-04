import React from 'react'
import Router from 'next/router'
import shortid from 'shortid'
import validator from 'validator';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      uniqueId: ''
    }
    this._init = this._init.bind(this);
    this._redirect = this._redirect.bind(this);
  }

  componentDidMount() {
    this._init()
  }

  _init() {
    const roomId = shortid.generate()
    if (roomId) {
      this.setState({ roomId, uniqueId: roomId })
    }
  }

  _redirect() {
    const { roomId, uniqueId } = this.state
    if (roomId) {
      const isValid = validator.isEmpty(roomId)
      if (!isValid) {
        Router.push(`/${roomId}`)
      } else {
        alert("Not valid Room ID")
      }
    } else {
      Router.push(`/${uniqueId}`)
    }
  }

  render() {
    const { roomId } = this.state
    return (
      <main className="container">
        <div className="container__content">
          <h1 className="title">
            Scret Code
          </h1>
          <p>Share your code without saving</p>
          <hr></hr>
          <div className="container_editor_area">
            <input type="text" placeholder="Your Custom RoomId" value={roomId} onChange={(e) => this.setState({ roomId: e.target.value })}></input>
            <button onClick={this._redirect}>Start / Join</button>
          </div>
        </div>
      </main>
    )
  }
}


export default Home