import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import TextMessage from './TextMessage'
import SuggestMessage from './SuggestMessage'
import PromptMessage from './PromptMessage'

import './MessageBubble.css';


class MessageBubble extends React.Component {
    constructor(props) {
        super(props)
        this.innerRef = React.createRef()
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        const element = this.innerRef.current
        element.scrollIntoView()
    }

    handleSubmit(event) {
        const handler = this.props.onSubmit
        if (handler) {
            return handler(event)
        }
    }

    render() {
        const props = this.props
        const info = props.info
        const message = props.message

        const isMyself = message.direction === 'incoming'

        const avatarUrl = isMyself ? `//www.gravatar.com/avatar/?d=mp` : `//www.gravatar.com/avatar/${info.pid}?d=identicon`
        const userName = isMyself ? null : `A.I.${info.pid}`

        const dtNow = new Date()
        let timeString = null
        if (message.time) {
            const dtThen = new Date(message.time)
            if (dtThen.year === dtNow.year) {
                timeString = dtThen.toLocaleString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                })
            } else {
                timeString = dtThen.toLocaleString(undefined, {
                    year: '2-digit',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                })
            }
        }

        let domMessage = null
        if (message.type === 'text') {
            domMessage = (
                <TextMessage message={message.message} isLatest={props.isLatest} />
            )
        } else if (message.type === 'suggest') {
            domMessage = (
                <SuggestMessage message={message.message} isLatest={props.isLatest} onSubmit={this.handleSubmit} />
            )
        } else if (message.type === 'prompt') {
            domMessage = (
                <PromptMessage message={message.message} isLatest={props.isLatest} onSubmit={this.handleSubmit} />
            )
        } 
        else {
            console.warn('Un-support message:', message)
            throw new Error(`Un-support message type ${message.type}`)
        }

        return (
            <div ref={this.innerRef} className={`d-flex ${isMyself ? "flex-row-reverse" : "flex-row"} flex-nowrap pt-3`}>
                <div className='p-1'>
                    <div className='d-flex flex-column'>
                        <div>
                            <img src={avatarUrl} className='rounded' alt='' width='48' height='48'></img>
                        </div>
                        <div>
                            <small>{userName}</small>
                        </div>
                    </div>
                </div>
                <div className='p-1'>
                    <div className='d-flex flex-column'>
                        <div className={`d-flex align-self-${isMyself ? 'end' : 'start'}`}>
                            <div className={`popover bs-popover-${isMyself ? 'left' : 'right'} position-relative shadow`}>
                                <div className='arrow'></div>
                                <div className='popover-body'>
                                    {domMessage}
                                </div>
                            </div>
                        </div>
                        <div className={`d-flex justify-content-${isMyself ? 'end' : 'start'} px-2`}>
                            <small className='text-muted'>
                                {timeString}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessageBubble;
