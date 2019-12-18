import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import './BottomBar.css'


class BottomBar extends React.Component {
    constructor(props) {
        super(props)


        this.inputRef = React.createRef()

        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    state = {
        value: '',
        isSending: false,
    };

    focusInput(){
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

    render() {
        const state = this.state

        return (
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
                            <button type='submit' value='Submit' className='x-btn-submit btn btn-outline-secondary' disabled={state.isSending}>
                                <span className={`${state.isSending ? 'd-none' : ''}`}>发送</span>
                                <span className={`spinner-grow spinner-grow-sm ${state.isSending ? '' : 'd-none'}`}
                                    role="status" aria-hidden="true">
                                </span>
                            </button>
                        </div>
                        <button type='button' className='btn btn-outline-secondary'>...</button>
                    </div>
                </form>
            </nav>
        )
    }
}

export default BottomBar;
