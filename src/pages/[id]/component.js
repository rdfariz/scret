import React from 'react'
import io from 'socket.io-client'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

class Home extends React.Component {

  state = {
    code: '',
    userLength: 0
  }

  componentDidMount() {
    this._init()
  }

  async _init() {
    const { params } = this.props
    const { id } = params
    if (id) {
      this.socket = await io()
      this._join(id)
    } else {
      // Redirect
    }
  }

  _join(roomId) {
    this.socket.emit('join', { roomId })
    this._listener()
  }

  _listener() {
    this.socket.on('join', room => {
      this.setState({ userLength: room.length })
    })
    this.socket.on('bc_join', room => {
      this.setState({ userLength: room.length })
    })
    this.socket.on('update_code', data => {
      const { code } = data
      this.setState({ code })
    })
  }

  onChangeValue(code) {
    this.setState({ code })
    this.socket.emit('update_code', { code })
  }

  render() {
    const { params } = this.props
    const { id } = params
    const { userLength } = this.state;
    return (
      <main className="container">
        <div className="container__content">
          <h1 className="title">
            Room: { id }
          </h1>
          <p>We are { userLength } users in the room.</p>
          <div className="container_editor_area">
            <Editor
              placeholder="Type some code…"
              value={this.state.code}
              onValueChange={code => this.onChangeValue(code)}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              className="container__editor"
            />
          </div>
        </div>
      </main>
    )
  }
}


export default Home