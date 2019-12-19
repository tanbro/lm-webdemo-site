import React from 'react'

import 'jquery/dist/jquery.min.js'
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'
import SpeechBubbleList from './components/SpeechBubbleList'
import LoadingModal from './components/LoadingModal'

import './App.css'
import logo from './logo.svg'


const apiUrl = process.env.REACT_APP_API_URL

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
      text: '',
    },
    speechData: {
      id: null,
      personality: '',
      history: []
    },
  }

  resetChat() {
    console.info('resetChat')

    this.openLoadingModal('重置会话 ...')

    fetch(apiUrl, {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors',
    })
      .then((response) => {
        if (!response.ok) {
          // TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(response.statusText)
        }
        return response.body
      })
      .then(
        (body) => {
          return (stream => {
            // stream read
            const reader = stream.getReader()
            const utf8decoder = new TextDecoder()
            const keys = ['id', 'personality']
            const attrs = {}
            let buf = ''

            const pump = () => {
              return reader.read().then(({ value, done }) => {
                value = utf8decoder.decode(value)
                console.debug('response-stream:', value)
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
                  console.debug('重置 chat:', attrs)
                  // do render
                  this.setState(state => {
                    // 更新对话历史列表
                    // 将 personality 作为一个假的对话
                    state.speechData.history = [{
                      text: attrs.personality
                    }]
                    state.speechData = Object.assign(state.speechData, attrs)
                    // 关闭 loading modal
                    state.LoadingModal = Object.assign(
                      state.loadingModal, {
                      isOpen: false,
                      text: ''
                    })
                    return {
                      speechData: state.speechData,
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
        (err) => {
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
          let chat = result
          let history = [{
            text: chat.personality
          }]
          chat.history.forEach(m => {
            history.push({
              text: m.msg,
              isReverse: m.dir === 'input'
            })
          })
          this.setState(state => ({
            speechData: {
              id: chat.id,
              personality: chat.personality,
              history: history,
            },
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

  openLoadingModal(text) {
    this.setState(state => ({
      loadingModal: Object.assign(
        state.loadingModal, {
        isOpen: true,
        text: text,
      })
    }))
  }

  closeLoadingModal() {
    this.setState(state => ({
      loadingModal: Object.assign(
        state.loadingModal, {
        isOpen: false,
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
    .then(response=>{
      if (!response.ok) {
        this.closeLoadingModal()
        throw new Error(response.statusText)
      } else {
        return response.json()
      }
    })
    .then(
      result=>{
        Object.assign(this.config, result)
        this.getChat()
      },
      err=>{
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

  componentDidMount() {
    this.getChat()
  }

  handleInputMessageSubmit(value) {
    value = value.trim()

    return new Promise((resolve, reject) => {
      if (!value) {
        reject(new Error('value can not be empty'))
        return
      }

      // 增加对话历史数据
      this.state.speechData.history.push({
        text: value,
        isReverse: true,
      })
      this.setState(state => ({
        speechData: state.speechData
      }))

      // 请求服务器的答复
      fetch(`${apiUrl}/${this.state.speechData.id}/input`, {
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
          (result) => {
            // 增加对话历史数据
            this.state.speechData.history.push({
              text: result.msg
            })
            this.setState(state => ({
              speechData: state.speechData
            }))
            resolve()
          },
          (err) => {
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
    } else {
      throw new Error(`Unknown OptionMenu: ${data.option}`)
    }
  }

  render() {
    const state = this.state

    return (
      <div className='App'>
        <LoadingModal isOpen={state.loadingModal.isOpen} text={state.loadingModal.text}></LoadingModal>
        <TopBar logo={logo} title='Chat Demo' onMenuItemClick={this.handleOptionMenuClick}></TopBar>
        <SpeechBubbleList key={state.speechData.id} data={state.speechData.history}></SpeechBubbleList>
        <BottomBar onSubmit={this.handleInputMessageSubmit}></BottomBar>
      </div>
    )
  }
}

export default App
