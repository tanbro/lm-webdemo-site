import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import SpeechBubble from './SpeechBubble'

class SpeechBubbleList extends React.Component {

    render() {
        const domChildren = this.props.data.map(
            (value, index) => (
                <SpeechBubble key={index} data={value}></SpeechBubble>
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

export default SpeechBubbleList;
