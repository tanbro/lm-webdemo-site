import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

class SuggestCounselorMessage extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    state = {
        submitted: false,
        submitting: false,
        value: null,
    }

    handleSubmit(event) {
        const handler = this.props.onSubmit
        if (handler) {
            const value_ = event.target.dataset.value
            this.setState({
                submitting: true,
                value: value_,
            })
            const result = handler(event)
            if (Promise.isPrototypeOf(result)) {
                result.then(
                    () => {
                        this.setState({
                            submitted: true,
                            submitting: false,
                            value: value_,
                        })
                    },
                    (err) => {
                        this.setState({
                            submitting: false,
                            value: value_,
                        })
                        throw err
                    }
                )
            } else {
                this.setState({
                    submitted: true,
                    submitting: false,
                    value: value_,
                })
            }
        }
    }

    render() {
        const state = this.state
        const props = this.props

        let yesLabel = props.message['yes_label']
        if (!yesLabel) {
            yesLabel = '是'
        }
        let noLabel = props.message['no_label']
        if (!noLabel) {
            noLabel = '否'
        }

        const submitDisabled = (!props.isLatest) || state.submitting || state.submitted

        return (
            <div>
                <p>{props.message.text}</p>
                <div className='row justify-content-center'>
                    <div className='col-4'>
                        <button
                            type="button" className="btn btn-sm btn-primary btn-block shadow"
                            data-type='prompt.result' data-value='yes'
                            onClick={this.handleSubmit}
                            disabled={submitDisabled}
                        >
                            <span role="status" aria-hidden="true"
                                className={`spinner-border spinner-border-sm ${!(state.submitting && state.value === 'yes') ? 'd-none' : ''}`}
                            />
                            {yesLabel}
                        </button>
                    </div>
                    <div className='col-4'>
                        <button
                            type="button" className="btn btn-sm btn-secondary btn-block shadow"
                            data-type='prompt.result' data-value='no'
                            onClick={this.handleSubmit}
                            disabled={submitDisabled}
                        >
                            <span role="status" aria-hidden="true"
                                className={`spinner-border spinner-border-sm ${!(state.submitting && state.value === 'no') ? 'd-none' : ''}`}
                            />
                            {noLabel}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SuggestCounselorMessage
