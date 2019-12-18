import React from 'react';
import uuid from 'uuid/index'

import 'jquery/dist/jquery.min.js'
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'

import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'
import SpeechBubbleList from './components/SpeechBubbleList'
import LoadingModal from './components/LoadingModal'


import './App.css';
import logo from './logo.svg';

const serverUrl = "http://10.1.1.174:8090/chat";

class App extends React.Component {

  constructor(props) {
    super(props);

    // Bind the this context to the handler function
    this.handleInputMessageSubmit = this.handleInputMessageSubmit.bind(this);
  }

  state = {
    loadingModal: {
      isOpen: true,
      text: "loading ...",
    },
    speechData: {
      id: null,
      personality: '',
      history: [
        // { text: "Hello" }, { "text": "Hi!", "isReverse": true }
      ]
    },
  }

  setLoadingModal(options) {
    this.setState(state => ({
      loadingModal: Object.assign(
        this.state.loadingModal,
        Object.assign(options, { key: uuid() })
      )
    }));
  }


  componentDidMount() {

    /// 重新初始化
    console.debug('重新初始化 ...')

    const readInitStream = (readableStream) => {
      const reader = readableStream.getReader();
      const utf8decoder = new TextDecoder();
      const chunks = []

      return pump();

      function pump() {
        return reader.read().then(({ value, done }) => {
          value = utf8decoder.decode(value)
          console.debug("response-stream", value)
          if (done) {
            return chunks;
          }
          chunks.push(value);
          return pump();
        });
      }
    }

    fetch(serverUrl, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache',
      mode: "cors",  // no-cors, cors, *same-origin
    })
      .then((response) => {
        if (!response.ok) {
          this.setLoadingModal({ isOpen: false });
          throw new Error('Network response was not ok.');
        }
        return response.body;
      })
      .then(
        (body) => {
          this.setLoadingModal({ isOpen: false });
          return readInitStream(body);
        },
        (error) => {
          this.setLoadingModal({ isOpen: false });
          console.error('fetch failed', error);
        }
      )
      .then(chunks => {  /// 读取返回的 pid 和 personality
        const keys = ['id', 'personality'];
        const attrs = {};
        const txt = chunks.join("").trim();
        const lines = txt.split("\n");
        lines.forEach(line => {
          if (line) {
            line = line.trim()
            if (!line) {
              return;
            }
            let parts = line.split(":");
            if (parts.length < 2) {
              return;
            }
            let k = parts[0].trim();
            let v = "";
            if (keys.indexOf(k) >= 0) {
              v = parts.slice(1).join(":");
              v = v.trim();
              if (!v) {
                throw new Error(`Wrong chunk response string from server: ${line}`);
              }
              attrs[k] = v;
            }
          }
        });

        // 将 personality 作为一个假的对话
        this.state.speechData.history.push({
          text: attrs.personality
        })
        // reader
        this.setState(state => ({
          speechData: Object.assign(this.state.speechData, attrs)
        }));
      })
  }

  handleInputMessageSubmit(value) {
    console.log("this in handleSubmit:", this)

    // 增加对话历史数据
    value = value.trim();
    this.state.speechData.history.push({
      text: value,
      isReverse: true,
    })
    // reader
    this.setState(state => ({
      speechData: this.state.speechData
    }));

    // 请求服务器的答复
    fetch(`${serverUrl}/${this.state.speechData.id}/input`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache',
      mode: "cors",  // no-cors, cors, *same-origin
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg: value,
      })
    })
      .then(response => response.json())
      .then(
        (result) => {
          // 增加对话历史数据
          this.state.speechData.history.push({
            text: result.msg,
          })
          // reader
          this.setState(state => ({
            speechData: this.state.speechData
          }));
        },
        (error) => {

        }
      )
  }

  render() {
    const state = this.state;

    return (
      <div className="App">
        <LoadingModal key={state.loadingModal.key} isOpen={state.loadingModal.isOpen} text={state.loadingModal.text}></LoadingModal>
        <TopBar logo={logo} title="Chat Demo"></TopBar>
        <SpeechBubbleList key={state.speechData.id} data={state.speechData.history}></SpeechBubbleList>
        <BottomBar onSubmit={this.handleInputMessageSubmit}></BottomBar>
      </div>
    );
  }
}

export default App;
