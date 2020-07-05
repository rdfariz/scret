import React from 'react'
import Router from 'next/router'
import shortid from 'shortid'
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
import { maxLengthParams } from '../../src/constants/index'
import Help from '../../src/components/help/index'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      uniqueId: '',
      isShowHelp: false
    }
    this._init = this._init.bind(this);
    this._redirect = this._redirect.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this)
    this._toggleHowWork = this._toggleHowWork.bind(this)
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

  _toggleHowWork(e) {
    e.preventDefault();
    this.setState({ isShowHelp: !this.state.isShowHelp })
  }

  render() {
    const { roomId, isShowHelp } = this.state
    return (
      <main className="container">
        <div className="container__content">
          <h1 className="title">
            Scret Code
          </h1>
          <p style={{margin: '0px'}}>Share your code without saving it</p>
          <div>
            <br></br>
            <a href="/" onClick={this._toggleHowWork}>How it work?</a>
            {isShowHelp && (
              <Help />
            )}
            <hr></hr>
          </div>
          <div className="container_editor_area">
            <span>Input your Room ID</span>
            <br></br>
            <input style={{marginTop: '12px'}} type="text" placeholder="ex: wXchqwnE7" value={roomId} onKeyDown={this._handleKeyDown} onChange={(e) => this.setState({ roomId: e.target.value })}></input>
            <button onClick={this._redirect}>Join</button>
          </div>
        </div>
        <ToastContainer autoClose={1750} pauseOnHover={false} pauseOnFocusLoss={false} />
      </main>
    )
  }
}


export default Home