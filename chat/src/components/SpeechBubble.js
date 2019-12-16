import React from 'react';

import 'holderjs/holder.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import './SpeechBubble.css';

class SpeechBubble extends React.Component {
    render() {
        const data = this.props.data;

        return (
            <div className="d-flex flex-row">
                <div className="p-1">
                    <img src="holder.js/64x64" className="rounded-circle p-1" alt=""></img>
                </div>
                <div className="p-1">
                    <div className="popover bs-popover-right position-relative shadow my-1 mx-0">
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
