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
        const convInfo = props.info
        const convMsg = props.message

        const isMyself = convMsg.direction === 'incoming'

        const avatarUrl = isMyself ? `//www.gravatar.com/avatar/?d=mp` : `//www.gravatar.com/avatar/${convInfo.pid}?d=identicon`
        const userName = isMyself ? null : `A.I.${convInfo.pid}`
        const timeStr = convMsg.time ?
            (new Date(convMsg.time)).toLocaleString(undefined, dateToStringLocaleOptions)
            : null

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
                                    {convMsg.message}
                                </div>
                            </div>
                        </div>
                        <div className={`d-flex justify-content-${isMyself ? 'end' : 'start'} px-2`}>
                            <small className='text-muted'>
                                {timeStr}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SpeechBubble;
