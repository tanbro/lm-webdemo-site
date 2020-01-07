import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import MessageBubble from './MessageBubble'

class MessageBubbleList extends React.Component {
    constructor(props) {
        super(props)

        // This binding is necessary to make `this` work in the callback
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        const handler = this.props.onSubmit
        if (handler) {
            return handler(event)
        }
    }

    render() {
        const props = this.props
        const conv = props.conv

        const domChildren = conv.history.map(
            (value, index) => {
                if (value.type === 'suggest.result') {
                    // 不显示这种消息
                    return null
                }
                if (value.type === 'prompt.result') {
                    // 不显示这种消息
                    return null
                }
                return (
                    <MessageBubble
                        key={`${conv.info.uid}.${index}`}
                        info={conv.info}
                        message={value}
                        isLatest={index === conv.history.length - 1}
                        onSubmit={this.handleSubmit}
                    />
                )
            }
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
