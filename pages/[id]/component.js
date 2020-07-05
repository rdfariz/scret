import io from 'socket.io-client'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import * as clipboardy from 'clipboardy'
import { ToastContainer, toast } from 'react-toastify';
import validator from 'validator';
import { maxLengthParams, BASE_URL, SERVER_URL } from '../../src/constants/index'

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      userLength: 0,
      message: '',
      url: ''
    }
    this._init = this._init.bind(this);
    this._join = this._join.bind(this);
    this._listener = this._listener.bind(this);
    this.onShareLink = this.onShareLink.bind(this);
    this.onCopyCode = this.onCopyCode.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  componentDidMount() {
    this._init()
  }

  static getInitialProps ({ res, query: { id } }) {
    if (id !== 'favicon.ico') {
      const isLength = validator.isLength(id, { min: 0, max: maxLengthParams })
      if (!id || !isLength) {
        res.writeHead(301, { Location: '/' });
        res.end();
        return { id }
      } else {
        return { id }
      }
    } else {
      return { id }
    }
  }

  async _init() {
    const { id } = this.props
    this.socket = await io(SERVER_URL)
    this._join(id)
    const url = `${BASE_URL}${id}`
    this.setState({ url })
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

  onShareLink() {
    const { url } = this.state
    clipboardy.write(url)
    toast.info("Copy Link Successfully");
  }
  onCopyCode() {
    const { code } = this.state
    clipboardy.write(code)
    toast.success("Copy Code Successfully");
  }

  onChangeValue(code) {
    this.setState({ code })
    this.socket.emit('update_code', { code })
  }

  render() {
    const { params } = this.props
    const { id } = params
    const { url, userLength } = this.state;
    return (
      <main className="container">
        <div className="container__content">
          <h2 className="title">
            Room ID: { id }
          </h2>
          <p><b>{ userLength }</b> users in the room.</p>
          {url && (
            <div className="message" onClick={this.onShareLink}>
              {url}
            </div>
          )}
          <br></br>
          <button className="share_btn" onClick={this.onCopyCode}>Copy All Code</button>
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
        <ToastContainer autoClose={1750} pauseOnHover={false} />
      </main>
    )
  }
}


export default Component