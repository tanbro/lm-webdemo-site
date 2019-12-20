import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './SpeechBubble.css';

class SpeechBubble extends React.Component {
    constructor(props) {
        super(props)
        this.innerRef = React.createRef()
    }

    componentDidMount() {
        const element = this.innerRef.current
        element.scrollIntoView()
    }

    render() {
        const props = this.props
        const flexClass = props.data.isReverse ? "d-flex flex-row flex-row-reverse" : "d-flex flex-row"
        const popoverClass = props.data.isReverse ? "bs-popover-left" : "bs-popover-right"
        const avatarUrl = props.data.isReverse ? `https://www.gravatar.com/avatar/?d=mp` : `https://www.gravatar.com/avatar/${props.hashKey}?d=identicon`
        const userName = props.data.isReverse ? null : `A.I. ${props.chatId}`

        return (
            <div ref={this.innerRef} className={`d-flex flex-row ${flexClass} flex-nowrap pt-3`}>
                <div className="p-1">
                    <div className="d-flex flex-column">
                        <div>
                            <img src={avatarUrl} className="rounded" alt="" width="48" height="48"></img>
                        </div>
                        <div>
                            <small className='text-muted'>{userName}</small>
                        </div>
                    </div>
                </div>
                <div className="p-1">
                    <div className="d-flex flex-column">
                        <div className={`d-flex align-items-end justify-content-${props.data.isReverse ? "end" : "start"}`}>
                            <small className='text-muted'>{props.data.time ? props.data.time.toLocaleString() : null}</small>
                        </div>
                        <div className={`d-flex align-self-${props.data.isReverse ? "end" : "start"}`}>
                            <div className={`popover ${popoverClass} position-relative shadow`}>
                                <div className="arrow"></div>
                                <div className="popover-body">
                                    {props.data.text}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SpeechBubble;
