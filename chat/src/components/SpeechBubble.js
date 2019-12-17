import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import logo from '../logo.svg';
import './SpeechBubble.css';

class SpeechBubble extends React.Component {
    state = {
        data: this.props.data
    };

    render() {
        const data = this.props.data;
        const flexClass = data.isReverse ? "d-flex flex-row flex-row-reverse" : "d-flex flex-row";
        const popoverClass = data.isReverse ? "bs-popover-left" : "bs-popover-right";

        return (
            <div className={`d-flex flex-row ${flexClass}`}>
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
