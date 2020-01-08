import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import CounselorCard from './CounselorCard'

class SuggestMessage extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    state = {
        submitted: false,
        submitting: false,
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
        const props = this.props
        const state = this.state

        const submitDisabled = (!props.isLatest) || state.submitting || state.submitted

        const domItems = props.message.counselors.map(
            (value, index) => (
                <div key={index} className='list-group-item px-0'>
                    <CounselorCard data={value} submitDisabled={submitDisabled} onSubmit={this.handleSubmit}></CounselorCard>
                </div>
            )
        )

        return (
            <div>
                <span>{props.message.text}</span>
                <div className="list-group list-group-flush">
                    {domItems}
                </div>
            </div>
        )
    }
}

export default SuggestMessage
