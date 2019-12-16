import React from 'react';

import logo from './logo.svg';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'
import SpeechBubbleList from './components/SpeechBubbleList'

const speeches = [
  { text: '你好' },
  { text: '很高新认识你', isSelf: true },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' },
  { text: '我也是' }
]

function App() {
  // <TopBar logo={logo} title="Chat Demo"></TopBar>
  // <SpeechBubbleList data={speeches}></SpeechBubbleList>
  // <BottomBar></BottomBar>

  return (
    <div class="d-flex justify-content-center align-items-center h-50">
      <div class="spinner-grow spinner-grow-lg text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default App;
