import React from 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'

import 'jquery/dist/jquery.min.js'
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import LoadingModal from './components/LoadingModal'

import './App.css';


class ExampleSelectModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSelected = this.handleSelected.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  state = {
    examples: [],
  }

  componentDidMount() {
    const url = `./data/input-examples.json`
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.setState({
          examples: result
        })
      })
  }

  handleCancel() {
    const handle = this.props.onClose
    if (handle) {
      handle(null)
    }
  }

  handleSelected(event) {
    const handle = this.props.onClose
    if (handle) {
      const example = this.state.examples[event.target.dataset.selectedIndex]
      handle(example)
    }
  }

  render() {
    const props = this.props
    const state = this.state

    const closeBtn = (
      <button className="close" onClick={this.handleCancel}>&times;</button>
    )

    const domExamples = state.examples.map((value, index) => (
      <div key={index} className='list-group shadow-sm my-3' >
        <a href="#" className="list-group-item list-group-item-action" data-selected-index={index} onClick={this.handleSelected}>
          <h5 data-selected-index={index} onClick={this.handleSelected}>{value.title}</h5>
          <p data-selected-index={index} onClick={this.handleSelected}>{value.text}</p>
        </a>
      </div>
    ))

    return (
      <Modal isOpen={props.isOpen} toggle={this.handleCancel}>
        <ModalHeader close={closeBtn}>选择要使用的例句</ModalHeader>
        <ModalBody width='50%'>
          <div className="list-group mh-50 overflow-auto d-inline-block">
            {domExamples}
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-secondary' onClick={this.handleCancel}>关闭</button>
        </ModalFooter>
      </Modal>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props)

    // This binding is necessary to make `this` work in the callback
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormReset = this.handleFormReset.bind(this)
    this.handleOptionMenuItemClick = this.handleOptionMenuItemClick.bind(this)
    this.handleOutputCollapseClick = this.handleOutputCollapseClick.bind(this)
    this.handleOpenExample = this.handleOpenExample.bind(this)
    this.handleCloseExample = this.handleCloseExample.bind(this)
  }

  apiBaseUrl = `${process.env.REACT_APP_API_BASE_URL}`

  state = {
    backend: '',
    title: '',
    text: '',
    loadingModal: {
      isOpen: true,
      title: '',
      text: '',
    },
    showOutputCollapse: false,
    outputText: '',
    showExample: false
  }

  handleInputChange(event) {
    event.preventDefault()
    const element = event.target
    const value = element.value
    if (element.id === 'inputTitle') {
      this.setState({
        title: value
      })
    } else if (element.id === 'inputText') {
      this.setState({
        text: value
      })
    } else {
      throw new Error(`Unknown form-control ${element}`)
    }
  }


  handleFormSubmit(event) {
    event.preventDefault()

    const url = `${this.apiBaseUrl}${this.state.backend.uid}`
    const reqBody = {
      title: this.state.title.trim(),
      text: this.state.text.trim(),
    }

    this.setState(state => ({
      loadingModal: Object.assign(state.loadingModal, {
        isOpen: true,
        title: '正在进行推理 ...',
        text: '',
      })
    }))

    fetch(url, {
      cache: 'no-cache',
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(reqBody),
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(res.statusText)
        }
      })
      .then(
        result => {
          const answer = result
          this.setState(state => ({
            loadingModal: Object.assign(state.loadingModal, {
              isOpen: false,
              title: '',
              text: '',
            }),
            showOutputCollapse: true,
            outputText: answer.text.trim()
          }))
        },
        err => {
          throw err
        }
      )
  }


  handleFormReset(event) {
    event.preventDefault()

    this.setState({
      title: '',
      text: '',
      outputText: '',
    })
  }


  handleOptionMenuItemClick(event) {
    const option = event.target.dataset.option

    if (option === 'reset') {
      const closeLoadingModal = () => {
        this.setState(state => ({
          loadingModal: Object.assign(state.loadingModal, {
            isOpen: false,
            title: '',
            text: '',
          })
        }))
      }

      this.setState(state => ({
        title: '',
        text: '',
        outputText: '',
        loadingModal: Object.assign(state.loadingModal, {
          isOpen: true,
          title: '删除后端进程',
          text: ''
        })
      }))

      this.deleteBackend(this.state.backend.uid)
        .then(
          () => {
            this.createBackend()
              .then(
                () => {
                  closeLoadingModal()
                },
                err => {
                  closeLoadingModal()
                  throw err
                }
              )
          },
          err => {
            closeLoadingModal()
            throw err
          }
        )
    } else {
      throw new Error(`Unknown data-option ${option}`)
    }
  }

  handleOutputCollapseClick() {
    this.setState(state => ({
      showOutputCollapse: !state.showOutputCollapse
    }))
  }


  handleCloseExample(example) {
    if (example) {
      this.setState({
        title: example.title,
        text: example.text,
        showExample: false
      })
    } else {
      this.setState({
        showExample: false
      })
    }
  }

  handleOpenExample() {
    this.setState({
      showExample: true
    })
  }


  componentDidMount() {
    const closeLoadingModal = () => {
      this.setState(state => ({
        loadingModal: Object.assign(state.loadingModal, {
          isOpen: false,
          title: '',
          text: '',
        })
      }))
    }

    this.setState(state => ({
      loadingModal: Object.assign(state.loadingModal, {
        isOpen: true,
        title: '加载后端信息',
        text: '',
      })
    }))

    this.getBackend()
      .then(
        result => {
          const backend = result
          if (backend) {
            closeLoadingModal()
          }
          else {
            this.createBackend()
              .then(
                () => {
                  closeLoadingModal()
                },
                err => {
                  closeLoadingModal()
                  throw err
                }
              )
          }
        },
        err => {
          closeLoadingModal()
          throw err
        }
      )
  }

  getBackend() {
    // 是否已经有后端实例存在?
    // 我们只管第一个。如果有，返回，否则返回 null
    // 使用 Promise!

    return new Promise((resolve, reject) => {
      const url = this.apiBaseUrl

      fetch(url, {
        cache: 'no-cache',
        mode: 'cors',
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error(res.statusText)
          }
        })
        .then(
          result => {
            const backendList = result
            if (backendList.length) {
              // 有后端存在了！我们只管第一个
              const backend = backendList[0]
              console.info('getCurrentBackend existed:', backend)
              this.setState({
                'backend': backend
              })
              this.traceBackendStarting(backend.uid)
                .then(
                  () => {
                    return resolve(backend)
                  },
                  err => {
                    console.info('getCurrentBackend started fail:', backend)
                    return reject(err)
                  }
                )

            } else {
              // 还没，返回 null
              this.setState({ 'backend': null })
              return resolve(null)
            }
          },
          err => {
            return reject(err)
          }
        )
    })
  }


  createBackend() {
    return new Promise((resolve, reject) => {
      const url = this.apiBaseUrl

      fetch(url, {
        cache: 'no-cache',
        mode: 'cors',
        method: 'POST',
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error(res.statusText)
          }
        })
        .then(
          result => {
            const backend = result
            console.info('createBackend created:', backend)
            this.setState({
              'backend': backend
            })
            this.traceBackendStarting(backend.uid)
              .then(
                () => {
                  console.info('createBackend started ok:', backend)
                  resolve(backend)
                },
                err => {
                  console.info('createBackend started fail:', backend)
                  return reject(err)
                }
              )
          },
          err => {
            return reject(err)
          }
        )
    })
  }

  deleteBackend(uid) {
    return new Promise((resolve, reject) => {
      const url = `${this.apiBaseUrl}${uid}`

      fetch(url, {
        cache: 'no-cache',
        mode: 'cors',
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) {
            return res.arrayBuffer()
          } else {
            throw new Error(res.statusText)
          }
        })
        .then(
          () => {
            console.info('deleteBackend ok')
            this.setState({
              backend: null
            })
            resolve()
          },
          err => reject(err)
        )
    })
  }

  traceBackendStarting(uid) {
    return new Promise((resolve, reject) => {

      const perform = () => {
        const url = `${this.apiBaseUrl}${uid}/trace`
        fetch(url, {
          cache: 'no-cache',
          mode: 'cors',
          headers: {
            'Range': 'lines=0-'
          }
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(res.statusText)
            }
            if ([204, 205].indexOf(res.status) >= 0) {
              // 不要继续了！
              this.setState(state => ({
                backend: Object.assign(
                  state.backend, {
                  state: 'started',
                })
              }))
              resolve()
              return
            } else if (res.status === 206) {
              // 要继续！
              return res.body
            } else {
              reject(new Error('Un-support status:', res.status, res.statusText))
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
                        loadingModal: Object.assign(state.loadingModal, {
                          isOpen: true,
                          title: '后端进程正在启动 ...',
                          text: line,
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
            err => reject(err)
          )
      }

      perform()
    })
  }



  render() {
    const state = this.state

    return (
      <div className='App'>

        <LoadingModal isOpen={state.loadingModal.isOpen} title={state.loadingModal.title} text={state.loadingModal.text}></LoadingModal>
        <ExampleSelectModal isOpen={state.showExample} onClose={this.handleCloseExample}></ExampleSelectModal>

        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <div className="row align-items-center justify-content-around">
              <div className='col-8'>
                <h1 className="display-4 text-left">Q/A</h1>
              </div>
              <div className='col-4'>
                <div className="btn-group">
                  <button type='button'
                    className='btn btn-sm btn-secondary dropdown-toggle'
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                  >
                    选项
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    <button className="dropdown-item" type="button"
                      data-option='reset'
                      onClick={this.handleOptionMenuItemClick}
                    >
                      重置 QA 模型
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="lead text-left">提出一个情感方面的问题，看看 AI 能作出怎样的回答。</p>

            <hr />

            <form className="form" onSubmit={this.handleFormSubmit} onReset={this.handleFormReset}>
              <div className="form-group row">
                <label htmlFor="inputText" className='col-form-label col-2'>标题</label>
                <div className="col">
                  <input id="inputTitle"
                    type="text"
                    className="form-control"
                    placeholder="问题的标题"
                    required={true}
                    maxLength='256'
                    value={state.title}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputText" className='col-form-label col-2'>正文</label>
                <div className="col">
                  <textarea id="inputText"
                    type="text"
                    className="form-control"
                    placeholder="问题的正文"
                    required={true}
                    maxLength='256'
                    rows={3}
                    value={state.text}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="col-4">
                  <button type='button' className="btn btn-lg btn-info" onClick={this.handleOpenExample}>示例</button>
                </div>
                <div className="col-4">
                  <button type="reset" value='reset' className="btn btn-lg btn-danger">清空</button>
                </div>
                <div className="col-4">
                  <button type="submit" value='submit' className="btn btn-lg btn-primary">提交</button>
                </div>
              </div>
            </form>

            <div className="row my-3 justify-content-start">
              <div className="col-6">
                <button className="btn btn-lg btn-success" type="button"
                  onClick={this.handleOutputCollapseClick}
                >
                  {`输出内容 ${state.showOutputCollapse ? '↑' : '↓'}`}
                </button>
              </div>
            </div>
          </div>

          <div className={`collapse ${state.showOutputCollapse ? 'show' : ''}`} id="outputCollapse">
            <p className="card card-body text-left">{state.outputText}</p>
          </div>

        </div>

      </div>
    )
  }
}

export default App;
