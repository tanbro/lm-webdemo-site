import React from 'react'

import { Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import './BottomBar.css'



class CommonPhraseSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
    }

    state = {
        phrases: [
            '婚姻的定义是：“得到一个人，失去全世界。”',
            '都说证书具有一定的含金量，我把证书拿去烧了，但铁屑也没有找着！',
            '系统居然怀疑我灌水，我身边又没有水龙头。哦…明白了，身上有一个…',
            '有没有听过“大猪说有，小猪说没有”的故事？',
            '哥哥是灰狼，妹妹是绵羊；哥家不缺粮，想你做新娘；“砰”的一声响，哥哥把命丧；“猎人”举枪笑，看看是你娘！',
            '网上总说女人如衣服，我却郁闷了，找件合适的衣服怎么就那么难呢！',
            '我不想再影响你的前途，你可以找到比我更好的人……我不想再欺骗你和自己，希望你原谅我吧！我会永远祝福你的。'
        ],
    }

    handleClose(event) {
        const handle = this.props.onClose
        if (handle) {
            const value = this.state.phrases[event.target.dataset.selectedIndex]
            handle(value)
        }
    }

    render() {
        const props = this.props
        const state = this.state

        const closeBtn = (
            <button className="close" onClick={this.handleClose}>&times;</button>
        )

        const domPhraseItems = state.phrases.map((value, index) => (
            <button key={index} className='list-group-item text-left'
                data-selected-index={index}
                onClick={this.handleClose}
            >
                {value}
            </button>
        ))

        return (
            <Modal isOpen={props.isOpen} toggle={this.handleClose} returnFocusAfterClose={false}>
                <ModalHeader close={closeBtn}>选择常用短语</ModalHeader>
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

        this.inputRef = React.createRef()

        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCommonPhraseButtonClick = this.handleCommonPhraseButtonClick.bind(this)
        this.handleCommonPhraseModalClose = this.handleCommonPhraseModalClose.bind(this)
    }

    state = {
        value: '',
        isSending: false,
        isOpenCommonPhraseSelectModal: false
    };

    focusInput() {
        const element = this.inputRef.current
        element.focus()
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({ value: event.target.value });
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
                    this.focusInput()
                },
                (_) => {
                    this.setState({
                        isSending: false
                    })
                    this.focusInput()
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
            this.setState(state=>({
                'value': state.value.concat(value),
                isOpenCommonPhraseSelectModal: false
            }))
        } else {
            this.setState({
                isOpenCommonPhraseSelectModal: false
            })
        }
        this.focusInput()
    }

    render() {
        const state = this.state

        return (
            <div>
                <CommonPhraseSelectModal isOpen={state.isOpenCommonPhraseSelectModal} onClose={this.handleCommonPhraseModalClose}></CommonPhraseSelectModal>
                <nav className='navbar border-top fixed-bottom navbar-light bg-light'>
                    <form className='form-inline' onSubmit={this.handleSubmit}>
                        <div className='input-group'>
                            <input type='text' className='form-control'
                                ref={this.inputRef}
                                value={state.value}
                                disabled={state.isSending}
                                onChange={this.handleChange}
                                placeholder='输入您要发送的内容'>
                            </input>
                            <div className='input-group-append'>
                                <button type='submit' value='Submit' className='x-btn-submit btn btn-outline-secondary text-dark' disabled={state.isSending}>
                                    <span className={`${state.isSending ? 'd-none' : ''}`}>发 送</span>
                                    <span className={`spinner-grow spinner-grow-sm ${state.isSending ? '' : 'd-none'}`}
                                        role="status" aria-hidden="true">
                                    </span>
                                </button>
                            </div>
                            <button className='btn btn-outline-secondary text-dark'
                                onClick={this.handleCommonPhraseButtonClick}
                            >
                                常用语
                        </button>
                        </div>
                    </form>
                </nav>
            </div>
        )
    }
}

export default BottomBar;
