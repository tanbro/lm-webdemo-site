import React from 'react'

import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import './BottomBar.css'


class ExampleSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
    }

    state = {
        examples: [],
    }

    componentDidMount() {
        if (process.env.NODE_ENV === 'development') {
            this.setState({
                examples: [
                    "今天老板狠狠骂了我，就因为不太重要的事情，我也和他顶了几句嘴，真窝火，我想该不该辞职，此处不留爷自有留爷处。我该怎么办，还是份不错的工作，收入还好，就是一直做的不顺心。脾气感觉也越来越不好。",
                    "我恨你，可是我还爱着你，我该怎么办？",
                    "感情方面。我跟我男朋友认识一年多了恋爱半年今天把我常在心里的秘密告诉他了我是一个结过婚的女人而且带着一个九岁的孩子他一下子接受不了这个事实所以我们决定分开一段时间让他好好想想可是我又怕他想不开不要我了。",
                    "不喜欢父母，不愿意跟他们相处。我是18岁女生。父母属于那种很容易担心的人，无论发生了什么事情到他们眼里就是一个新的需要解决的问题，印象中从没看到父母之间谈话开怀大笑过，他们永远在谈论眼前发生的事情该怎么处理，有时谈着谈着就吵起来。跟他们在一起我感到紧张。我平常干什么他们都必须要知道，如果做没有经过他们同意的事，他们就以担心我的安全为由开展心理教育，我坚持自己的观点就被说成“什么话都听不进去”，说我的态度有问题，但我却认为是他们过分担心了。生活中父母对我很好，而我却似乎处处给他们添麻烦，觉得很对不起他们。我现在感到进退两难，反抗也不是，顺从也不是，我该怎么办？"
                ]
            })

        } else if (process.env.NODE_ENV === 'production') {
            fetch('data/examples.json')
                .then(response => response.json())
                .then(result => {
                    this.setState({
                        examples: result
                    })
                })

        } else {
            throw new Error(`Un-support NODE_ENV ${process.env.NODE_ENV}`)
        }
    }

    handleClose(event) {
        const handle = this.props.onClose
        if (handle) {
            const value = this.state.examples[event.target.dataset.selectedIndex]
            handle(value)
        }
    }

    render() {
        const props = this.props
        const state = this.state

        const closeBtn = (
            <button className="close" onClick={this.handleClose}>&times;</button>
        )

        const domPhraseItems = state.examples.map((value, index) => (
            <button key={index} className='list-group-item text-left w-100'
                data-selected-index={index}
                onClick={this.handleClose}
            >
                {value}
            </button>
        ))

        return (
            <Modal isOpen={props.isOpen} toggle={this.handleClose}>
                <ModalHeader close={closeBtn}>选择要发送的例句</ModalHeader>
                <ModalBody width='50%'>
                    <div className="list-group mh-50 overflow-auto d-inline-block">
                        {domPhraseItems}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-secondary' onClick={this.handleClose}>关闭</button>
                </ModalFooter>
            </Modal>
        )
    }
}



class BottomBar extends React.Component {
    constructor(props) {
        super(props)

        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCommonPhraseButtonClick = this.handleCommonPhraseButtonClick.bind(this)
        this.handleCommonPhraseModalClose = this.handleCommonPhraseModalClose.bind(this)
    }

    state = {
        value: '',
        rows: 1,
        isSending: false,
        isOpenCommonPhraseSelectModal: false
    };

    handleChange(event) {
        event.preventDefault();
        const value = event.target.value
        const lines = value.split(/\r\n|\r|\n/)
        const linesLength = lines.length
        let rows = 1
        if (linesLength < 1) {
            rows = 1
        } else if (linesLength > 2) {
            rows = 3
        } else {
            rows = linesLength
        }
        this.setState({
            rows: rows,
            value: value
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            isSending: true
        })

        this.props.onSubmit(this.state.value)
            .then(
                () => {
                    this.setState({
                        value: '',
                        isSending: false
                    })
                },
                (_) => {
                    this.setState({
                        isSending: false
                    })
                }
            )
    }

    handleCommonPhraseButtonClick() {
        this.setState({
            isOpenCommonPhraseSelectModal: true
        })
    }

    handleCommonPhraseModalClose(value) {
        if (value) {
            this.setState(state => ({
                'value': state.value.concat(value),
                isOpenCommonPhraseSelectModal: false
            }))
        } else {
            this.setState({
                isOpenCommonPhraseSelectModal: false
            })
        }
    }

    render() {
        const state = this.state

        return (
            <div>
                <ExampleSelectModal isOpen={state.isOpenCommonPhraseSelectModal} onClose={this.handleCommonPhraseModalClose}></ExampleSelectModal>
                <nav className='navbar border-top fixed-bottom navbar-light bg-light'>
                    <form className='form-inline' onSubmit={this.handleSubmit}>
                        <div className='input-group'>
                            <textarea className='form-control'
                                required={true}
                                maxLength={256}
                                rows={state.rows}
                                value={state.value}
                                disabled={state.isSending}
                                onChange={this.handleChange}
                                placeholder='输入您要发送的内容'>
                            </textarea>
                            <div className='input-group-append'>
                                <button type='submit' value='Submit' className='x-btn-submit btn btn-sm btn-outline-secondary text-dark' disabled={state.isSending}>
                                    <span className={`${state.isSending ? 'd-none' : ''}`}>发送</span>
                                    <span className={`spinner-grow spinner-grow-sm ${state.isSending ? '' : 'd-none'}`}
                                        role="status" aria-hidden="true">
                                    </span>
                                </button>
                            </div>
                            <button className='btn btn-sm btn-outline-secondary text-dark'
                                onClick={this.handleCommonPhraseButtonClick}
                            >
                                例句
                            </button>
                        </div>
                    </form>
                </nav>
            </div>
        )
    }
}

export default BottomBar;
