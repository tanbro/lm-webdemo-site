import React from 'react'

import 'jquery/dist/jquery.min.js'
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import md5 from 'md5'

import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'
import SpeechBubbleList from './components/SpeechBubbleList'
import LoadingModal from './components/LoadingModal'

import './App.css'
import logo from './logo.svg'


const apiUrl = `${process.env.REACT_APP_API_SITE}/chat`

class App extends React.Component {

  constructor(props) {
    super(props)

    // Bind the this context to the handler function
    this.handleInputMessageSubmit = this.handleInputMessageSubmit.bind(this)
    this.handleOptionMenuClick = this.handleOptionMenuClick.bind(this)
  }

  state = {
    loadingModal: {
      isOpen: true,
      title: '',
      text: '',
    },
    chatProc: {
      hashKey: null,
      program: null,
      cwd: null,
      args: null,
      key: null,
      personality: '',
      history: []
    },
  }

  componentDidMount() {
    this.getChat()
  }

  resetChat() {
    console.info('resetChat')

    this.openLoadingModal('重置会话 ...')

    fetch(apiUrl, {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          // TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(response.statusText)
        }
        return response.body
      })
      .then(
        body => {
          return (stream => {
            // stream read
            const reader = stream.getReader()
            const utf8decoder = new TextDecoder()
            const keys = ['id', 'personality', 'program', 'cwd', 'args']
            const attrs = {}
            let buf = ''

            const pump = () => {
              return reader.read().then(({ value, done }) => {
                value = utf8decoder.decode(value)
                console.debug('response-stream:', done, value)
                buf += value  // 缓冲下来，然后按照行进行处理
                while (true) {
                  let pos = buf.indexOf('\n')
                  if (pos < 0) {
                    break
                  }
                  let line = buf.slice(0, pos).trim()
                  buf = buf.slice(pos + 1)
                  if (!line) {
                    break
                  }
                  // 刷新 loading modal
                  this.setState(state => ({
                    loadingModal: Object.assign(
                      state.loadingModal, {
                      text: line
                    })
                  }))
                  // 继续解析
                  let parts = line.split(':')
                  if (parts.length < 2) {
                    break
                  }
                  let k = parts[0].trim()
                  let v = ''
                  if (keys.indexOf(k) >= 0) {
                    v = parts.slice(1).join(':')
                    v = v.trim()
                    if (!v) {
                      break
                    }
                    attrs[k] = v
                  }
                }

                // response 结束！
                if (done) {
                  attrs.hashKey = md5(attrs['args'] + attrs['cwd'] + attrs['program'])
                  // do render
                  this.setState(state => {
                    // 更新对话历史列表
                    // 将 personality 作为一个假的对话
                    state.chatProc.history = [{
                      text: attrs.personality,
                      time: new Date()
                    }]
                    state.chatProc = Object.assign(state.chatProc, attrs)
                    // 关闭 loading modal
                    state.LoadingModal = Object.assign(
                      state.loadingModal, {
                      isOpen: false,
                      text: ''
                    })
                    return {
                      chatProc: state.chatProc,
                      loadingModal: state.LoadingModal
                    }
                  })
                  return true
                }

                ///
                return pump()
              })
            }

            return pump()

          })(body)
        },
        err => {
          this.closeLoadingModal()
          throw new Error(err)
        }
      )
  }

  reattachChat(chat) {
    console.info('reattachChat:', chat)

    this.openLoadingModal('恢复会话数据 ...')

    let url = `${apiUrl}/${chat.id}`
    fetch(url, {
      cache: 'no-cache',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(response.statusText)
        } else {
          return response.json()
        }
      })
      .then(
        result => {
          /// 将历史对话数据放上去
          let history = [{
            text: result.personality
          }]
          result.history.forEach(m => {
            history.push({
              text: m.msg,
              time: new Date(Date.parse(m.time)),
              isReverse: m.dir === 'input'
            })
          })
          result.history = history
          result.hashKey = md5(result['args'] + result['cwd'] + result['program'])
          this.setState(state => ({
            chatProc: result,
            loadingModal: Object.assign(
              state.loadingModal, {
              isOpen: false,
              text: ''
            })
          }))
        },
        err => {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(err)
        }
      )
  }

  clearChat() {
    console.info('clearChat:')

    this.openLoadingModal('清空会话历史')

    let url = `${apiUrl}/${this.state.chatProc.id}/clear`
    fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(response.statusText)
        } else {
          return response.arrayBuffer()
        }
      })
      .then(
        _ => {
          /// 将历史对话数据清空
          this.setState(state => ({
            chatProc: Object.assign(
              state.chatProc, {
              history: []
            }),
            loadingModal: Object.assign(
              state.loadingModal, {
              isOpen: false,
              text: ''
            })
          }))
        },
        err => {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(err)
        }
      )
  }

  openLoadingModal(title = '', text = '') {
    this.setState(state => ({
      loadingModal: Object.assign(
        state.loadingModal, {
        isOpen: true,
        title: title,
        text: text,
      })
    }))
  }

  closeLoadingModal() {
    this.setState(state => ({
      loadingModal: Object.assign(
        state.loadingModal, {
        isOpen: false,
        title: '',
        text: '',
      })
    }))
  }

  init() {
    this.openLoadingModal('读取配置信息 ...')
    fetch('config.json', {
      cache: 'no-cache',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          this.closeLoadingModal()
          throw new Error(response.statusText)
        } else {
          return response.json()
        }
      })
      .then(
        result => {
          Object.assign(this.config, result)
          this.getChat()
        },
        err => {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(err)
        }
      )
  }

  getChat() {
    this.openLoadingModal('加载会话信息 ...')

    fetch(apiUrl, {
      cache: 'no-cache',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          this.closeLoadingModal()
          throw new Error(response.statusText)
        } else {
          return response.json()
        }
      })
      .then(
        result => {
          let chats = result
          if (chats.length) {
            let chat = chats[0]
            this.reattachChat(chat)
          } else {
            this.resetChat()
          }
        },
        err => {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(err)
        }
      )
  }

  handleInputMessageSubmit(value) {
    value = value.trim()

    return new Promise((resolve, reject) => {
      if (!value) {
        reject(new Error('value can not be empty'))
        return
      }

      this.setState(state => {
        // 增加对话历史数据
        state.chatProc.history.push({
          text: value,
          time: new Date(),
          isReverse: true,
        })
        return {
          chatProc: state.chatProc
        }
      })

      // 请求服务器的答复
      fetch(`${apiUrl}/${this.state.chatProc.id}/input`, {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          msg: value
        })
      })
        .then(response => {
          if (!response.ok) {
            /// TODO: response 错误 status 处理
            reject()
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .then(
          result => {
            this.setState(state => {
              // 增加对话历史数据
              this.state.chatProc.history.push({
                text: result.msg,
                time: new Date(),
              })
              return {
                chatProc: state.chatProc
              }
            })
            resolve()
          },
          err => {
            /// TODO: input 错误处理
            reject(err)
          }
        )
    })
  }


  handleOptionMenuClick(data) {
    if (data.option === 'reload') {
      this.getChat()
    } else if (data.option === 'reset') {
      this.resetChat()
    } else if (data.option === 'clear') {
      this.clearChat()
    } else {
      throw new Error(`Unknown OptionMenu: ${data.option}`)
    }
  }

  render() {
    const state = this.state

    return (
      <div className='App'>
        <LoadingModal isOpen={state.loadingModal.isOpen} title={state.loadingModal.title} text={state.loadingModal.text}></LoadingModal>
        <TopBar logo={logo} title='话媒心理' onMenuItemClick={this.handleOptionMenuClick}></TopBar>
        <SpeechBubbleList data={state.chatProc}></SpeechBubbleList>
        <BottomBar onSubmit={this.handleInputMessageSubmit}></BottomBar>
      </div>
    )
  }
}

export default App
