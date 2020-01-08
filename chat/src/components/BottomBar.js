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
        const url = `${process.env.PUBLIC_URL}/data/input-examples.json`
        fetch(url)
            .then(response => response.json())
            .then(result => {
                this.setState({
                    examples: result
                })
            })
    }

    handleClose(event) {
        const handle = this.props.onClose
        if (handle) {
            const value = this.state.examples[event.target.dataset.selectedIndex]
            return handle(value)
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
        isSending: false,
        isOpenCommonPhraseSelectModal: false
    };

    handleChange(event) {
        event.preventDefault();
        const element = event.target

        this.setState({ value: element.value })

        setTimeout(() => {
            element.style.height = 'auto'
            element.style.height = `${element.scrollHeight}px`
        }, 0)
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
                () => {
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
        const props = this.props

        return (
            <div>
                <ExampleSelectModal isOpen={state.isOpenCommonPhraseSelectModal} onClose={this.handleCommonPhraseModalClose}></ExampleSelectModal>
                <nav className='navbar border-top fixed-bottom navbar-light bg-light'>
                    <form className='form-inline' onSubmit={this.handleSubmit}>
                        <div className='input-group'>
                            <textarea className='form-control x-bottombar-textarea'
                                required={true}
                                maxLength='256'
                                rows='1'
                                value={state.value}
                                disabled={state.isSending || props.inputDisabled}
                                onChange={this.handleChange}
                                placeholder='输入您要发送的内容'>
                            </textarea>
                            <div className='input-group-append'>
                                <button type='submit' value='Submit' className='btn btn-sm btn-outline-secondary text-dark x-bottombar-submit' disabled={state.isSending}>
                                    <span className={`${state.isSending ? 'd-none' : ''}`}>发送</span>
                                    <span className={`spinner-border spinner-border-sm ${state.isSending ? '' : 'd-none'}`}
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
