import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './SpeechBubble.css';


const dateToStringLocaleOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit' }

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
        const avatarUrl = props.data.isReverse ? `https://www.gravatar.com/avatar/?d=mp` : `https://www.gravatar.com/avatar/${props.hashKey}?d=identicon`
        const userName = props.data.isReverse ? null : `A.I. ${props.chatId}`
        const domTime = props.data.time ? (
            <small className='text-muted'>{props.data.time.toLocaleString(undefined, dateToStringLocaleOptions)}</small>
        ) : null

        return (
            <div ref={this.innerRef} className={`d-flex ${props.data.isReverse ? "flex-row-reverse" : "flex-row"} flex-nowrap pt-3`}>
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
                        <div className={`d-flex align-self-${props.data.isReverse ? 'end' : 'start'}`}>
                            <div className={`popover bs-popover-${props.data.isReverse ? 'left' : 'right'} position-relative shadow`}>
                                <div className='arrow'></div>
                                <div className='popover-body'>
                                    {props.data.text}
                                </div>
                            </div>
                        </div>
                        <div className={`d-flex justify-content-${props.data.isReverse ? 'end' : 'start'} px-2`}>
                            {domTime}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SpeechBubble;
