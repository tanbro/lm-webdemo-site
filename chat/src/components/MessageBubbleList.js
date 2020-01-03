import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import MessageBubble from './MessageBubble'

class MessageBubbleList extends React.Component {

    render() {
        const props = this.props
        const conv = props.conv

        const domChildren = conv.history.map(
            (value, index) => (
                <MessageBubble
                    key={`${conv.info.uid}.${index}`}
                    info={conv.info}
                    message={value}
                >
                </MessageBubble>
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

export default MessageBubbleList;
