import React from 'react'
import Router from 'next/router'
import shortid from 'shortid'
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
import { maxLengthParams } from '../../src/constants/index'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      uniqueId: ''
    }
    this._init = this._init.bind(this);
    this._redirect = this._redirect.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this)
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
      const isEmpty = validator.isEmpty(roomId)
      const isContain1 = validator.contains(roomId, '/')
      const isContain2 = validator.contains(roomId, '#')
      const isLength = validator.isLength(roomId, { min: 0, max: maxLengthParams })
      if (isLength && !isEmpty && !isContain1 && !isContain2) {
        Router.push(`/${roomId}`)
      } else if (!isLength) {
        toast.error(`Maximum character is ${maxLengthParams}`)
      } else {
        toast.error('Room ID is not valid!')
      }
    } else {
      Router.push(`/${uniqueId}`)
    }
  }

  _handleKeyDown(e) {
    if (e.key === 'Enter') {
      this._redirect()
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
          <p>Share your code without saving it</p>
          <hr></hr>
          <div className="container_editor_area">
            <span>Room ID: </span>
            <input type="text" placeholder="ex: wXchqwnE7" value={roomId} onKeyDown={this._handleKeyDown} onChange={(e) => this.setState({ roomId: e.target.value })}></input>
            <button onClick={this._redirect}>Start / Join</button>
          </div>
        </div>
        <ToastContainer autoClose={1750} pauseOnHover={false} />
      </main>
    )
  }
}


export default Home