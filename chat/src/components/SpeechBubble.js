import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import logo from '../logo.svg';
import './SpeechBubble.css';

class SpeechBubble extends React.Component {
    constructor(props) {
        super(props)
        this.innerRef = React.createRef()
    }

    state = {
        data: this.props.data
    };

    componentDidMount() {
        const element = this.innerRef.current
        element.scrollIntoView()
    }

    render() {
        const data = this.props.data;
        const flexClass = data.isReverse ? "d-flex flex-row flex-row-reverse" : "d-flex flex-row"
        const popoverClass = data.isReverse ? "bs-popover-left" : "bs-popover-right"

        return (
            <div ref={this.innerRef} className={`d-flex flex-row ${flexClass}`}>
                <div className="p-1">
                    <img src={logo} className="rounded-circle p-1" alt="" width="48" height="48"></img>
                </div>
                <div className="p-1">
                    <div className={`popover ${popoverClass} position-relative shadow my-1 mx-0`}>
                        <div className="arrow"></div>
                        <div className="popover-body">
                            {data.text}
                        </div>
                    </div>
                </div>
            </div>

        )
    };
}

export default SpeechBubble;
