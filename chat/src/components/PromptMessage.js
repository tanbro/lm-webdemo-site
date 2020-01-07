import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

class SuggestCounselorMessage extends React.Component {
    constructor(props) {
        super(props)
        this.handlePrompt = this.handlePrompt.bind(this)
    }

    handlePrompt(event) {

    }

    render() {
        const message = this.props.message

        let yesLabel = message['yes_label']
        if (! yesLabel) {
            yesLabel = '是'
        }
        let noLabel = message['no_label']
        if (! noLabel) {
            noLabel = '否'
        }

        return (
            <div>
                <p>{message.text}</p>
                <div className='row justify-content-center'>
                    <div className='col-4'>
                        <button type="button" className="btn btn-sm btn-primary">{yesLabel}</button>
                    </div>
                    <div className='col-4'>
                        <button type="button" className="btn btn-sm btn-secondary">{noLabel}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SuggestCounselorMessage
