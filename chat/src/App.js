import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'
import MessageBubbleList from './components/MessageBubbleList'
import LoadingModal from './components/LoadingModal'

import './App.css'
import logo from './logo.svg'


const apiBaseUrl = `${process.env.REACT_APP_API_BASE_URL}`

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
    conv: {
      info: {},
      history: []
    },
  }

  componentDidMount() {
    // 首先，检查是否据已经有一个会话了，如果有，打开！
    this.openLoadingModal('检查会话信息 ...')

    fetch(apiBaseUrl, {
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
          console.debug('get conversations list response ok:', result)
          const convInfoList = result
          if (convInfoList.length) {
            // 找到会话了，用第一个
            const convInfo = convInfoList[0]
            this.loadConv(convInfo)

            // this.reattachChat(chat)
          } else {
            this.createConv()
          }
        },
        err => {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(err)
        }
      )
  }

  loadConv(convInfo) {
    this.openLoadingModal('加载会话信息 ...')

    // 循环等待初始化完毕！
    this.waitConvUntilStarted(convInfo.uid)
      .then(
        (result) => {
          this.closeLoadingModal()
          // 显示历史
          this.loadConvHistory(result)
        },
        error => {
          throw new Error(error)
        }
      )
  }

  reloadConv() {
    return this.loadConv(this.state.conv.info)
  }

  createConv() {
    this.openLoadingModal('新建会话 ...')

    fetch(apiBaseUrl, {
      method: 'POST',
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
          console.debug('create conversation response ok: ', result)
          const convInfo = result
          this.setState((state) => ({
            conv: Object.assign(state.conv, {
              info: convInfo
            })
          }))
          // 循环等待初始化完毕！
          this.waitConvUntilStarted(convInfo.uid)
            .then(
              result => {
                this.closeLoadingModal()
                // 显示历史
                this.loadConvHistory(result)
              },
              error => {
                throw new Error(error)
              }
            )
        },
        error => {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(error)
        }
      )
  }


  reCreateConv() {
    this.openLoadingModal('删除会话 ...')

    const url = `${apiBaseUrl}${this.state.conv.info.uid}`

    fetch(url, {
      method: 'DELETE',
      cache: 'no-cache',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          this.closeLoadingModal()
          throw new Error(response.statusText)
        } else {
          return response.arrayBuffer()
        }
      })
      .then(
        () => {
          console.debug('delete conversation response ok')
          this.setState((state) => ({
            conv: {
              info: {},
              history: [],
            }
          }))
          this.closeLoadingModal()
          this.createConv()
        },
        error => {
          //TODO: 错误处理
          this.closeLoadingModal()
          throw new Error(error)
        }
      )
  }


  traceConvOutput(convUid) {

    const perform = () => {
      const url = `${apiBaseUrl}${convUid}/trace`
      fetch(url, {
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Range': 'lines=0-'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          if ([204, 205].indexOf(response.status) >= 0) {
            // 不要继续了！
            return
          } else if (response.status === 206) {
            // 要继续！
            return response.body
          } else {
            throw new Error('Un-support status:', response.status, response.statusText)
          }
        })
        .then(
          body => {
            if (!body) {
              return
            }
            return (stream => {
              // stream read
              const reader = stream.getReader()
              const utf8decoder = new TextDecoder()
              let buf = ''

              const pump = () => {
                return reader.read().then(({ value, done }) => {
                  value = utf8decoder.decode(value)
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
                    this.setState(state => ({
                      loadingModal: Object.assign(
                        state.loadingModal, {
                        text: line
                      })
                    }))
                  }
                  // response 结束！
                  if (done) {
                    return perform()
                  }
                  ///
                  return pump()
                })
              }

              return pump()
            })(body)
          },
          error => {
            // throw new Error(error)
            console.warn('error on traceConvOutput:', error)
          }
        )
    }

    perform()

  }


  waitConvUntilStarted(convUid, interval = 5000) {
    this.traceConvOutput(convUid)
    return new Promise((resolve, reject) => {
      // 检查一次，是否启动
      const doCheck = () => {
        const url = `${apiBaseUrl}${convUid}`
        fetch(url, {
          cache: 'no-cache',
          mode: 'cors',
        })
          .then(response => {
            if (!response.ok) {
              reject(new Error(response.statusText))
            } else {
              return response.json()
            }
          })
          .then(
            result => {
              const convInfo = result
              this.setState(state => ({
                conv: Object.assign(state.conv, {
                  info: convInfo
                })
              }))
              if (convInfo.state === 'started') {
                console.info('started:', convInfo)
                resolve(convInfo)
              } else if (convInfo.state === 'pending') {
                setTimeout(doCheck, interval, convUid, interval)
              } else {
                console.error('Wrong conversation state:', convInfo)
                reject(convInfo.state)
              }
            },
            error => {
              reject(new Error(error))
            }
          )
      }
      doCheck()
    })
  }


  loadConvHistory(convInfo) {
    const url = `${apiBaseUrl}${convInfo.uid}/history`
    fetch(url, {
      cache: 'no-cache',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        } else {
          return response.json()
        }
      })
      .then(
        result => {
          const convSpeechList = result
          // 伪造第一句问候语
          convSpeechList.unshift({
            type: 'text',
            message: convInfo.personality,
            direction: 'outgoing',
          })
          this.setState(state => ({
            conv: Object.assign(state.conv, {
              history: convSpeechList
            })
          }))
        },
        error => {
          throw new Error(error)
        }
      )
  }


  clearCurrentConvHistory() {
    console.warn('clearConvHistory')

    this.openLoadingModal('清空会话历史')

    const convInfo = this.state.conv.info
    const url = `${apiBaseUrl}${convInfo.uid}/history`
    fetch(url, {
      method: 'DELETE',
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
        () => {
          this.loadConvHistory(convInfo)
          this.setState(state => ({
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


  handleInputMessageSubmit(value) {
    value = value.trim()

    return new Promise((resolve, reject) => {
      if (!value) {
        reject(new Error('value can not be empty'))
        return
      }

      const sndMsg = {
        type: 'text',
        message: value,
        time: new Date(),
        direction: 'incoming',
      }

      this.setState(state => {
        // 增加对话历史数据
        state.conv.history.push(sndMsg)
        return {
          conv: Object.assign(state.conv, {
            history: state.conv.history
          })
        }
      })

      // 请求服务器的答复
      fetch(`${apiBaseUrl}${this.state.conv.info.uid}`, {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sndMsg)
      })
        .then(response => {
          if (!response.ok) {
            reject(new Error(response.statusText))
          }
          return response.json()
        })
        .then(
          result => {
            let recvMsg = result
            if (!Array.isArray(recvMsg)){
              recvMsg=[recvMsg]
            }
            for (const msg of recvMsg) {
              this.setState(state => {
                // 增加对话历史数据
                state.conv.history.push(msg)
                return {
                  conv: Object.assign(state.conv, {
                    history: state.conv.history
                  })
                }
              })
            }
            resolve(recvMsg)
          },
          error => {
            /// TODO: input 错误处理
            reject(error)
          }
        )
    })
  }


  handleOptionMenuClick(data) {
    if (data.option === 'reload') {
      this.reloadConv()
    } else if (data.option === 'reset') {
      this.reCreateConv()
    } else if (data.option === 'clear') {
      this.clearCurrentConvHistory()
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
        <MessageBubbleList conv={state.conv}></MessageBubbleList>
        <BottomBar onSubmit={this.handleInputMessageSubmit}></BottomBar>
      </div>
    )
  }
}

export default App
