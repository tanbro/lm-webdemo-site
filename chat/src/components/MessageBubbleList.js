import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

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

        const domChildren = props.conv.history.map(
            (value, index) => {
                if (
                    (value.direction === 'incoming')
                    && (value.is_result)
                ) {
                    // 不显示这种消息
                    console.debug('不显示该消息: ', index, value)
                    return null
                }
                return (
                    <MessageBubble
                        key={`${props.conv.info.uid}.${index}`}
                        info={props.conv.info}
                        message={value}
                        isLatest={index === props.conv.history.length - 1}
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
