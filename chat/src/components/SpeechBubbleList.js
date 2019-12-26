import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import SpeechBubble from './SpeechBubble'

class SpeechBubbleList extends React.Component {

    render() {
        const props = this.props

        const domChildren = props.data.history.map(
            (value, index) => (
                <SpeechBubble
                    key={`${props.data.id}.${index}`}
                    data={value}
                    chatId={props.data.id}
                    hashKey={props.data.hashKey}
                >
                </SpeechBubble>
            )
        )

        return (
            <div className="d-flex flex-column mb-3">
                <div className="p-5"></div>
                {domChildren}
                <div className="p-5"></div>
            </div>
        )
    };
}

export default SpeechBubbleList;
