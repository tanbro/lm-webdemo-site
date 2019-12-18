import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import './BottomBar.css'


class BottomBar extends React.Component {
    constructor(props) {
        super(props)

        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    state = {
        value: '',
        isSending: false,
    };

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
                },
                (_) => {
                    this.setState({
                        isSending: false
                    })

                }
            )
    }

    render() {
        const state = this.state

        // let sendingDom = null
        // if (state.isSending) {
        //     sendingDom =
        //         <div class="spinner-grow text-secondary" role="status">
        //             <span class="sr-only">发送...</span>
        //         </div>
        // } else {
        //     sendingDom =
        //         <button type='submit' value='Submit' className='btn btn-outline-secondary' disabled={state.isSending}>
        //             发送
        //         </button>
        // }

        return (
            <nav className='navbar border-top fixed-bottom navbar-light bg-light'>
                <form className='form-inline' onSubmit={this.handleSubmit}>
                    <div className='input-group'>
                        <input type='text' className='form-control'
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
