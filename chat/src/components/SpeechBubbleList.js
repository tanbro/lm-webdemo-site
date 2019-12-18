import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import SpeechBubble from './SpeechBubble'

class SpeechBubbleList extends React.Component {

    render() {
        const itemsDom = this.props.data.map((m, i) =>{
            return <SpeechBubble key={i} data={m}></SpeechBubble>
        });

        return (
            <div className="d-flex flex-column mb-3">
                <div className="p-5"></div>
                {itemsDom}
                <div className="p-5"></div>
            </div>
        )
    };
}

export default SpeechBubbleList;
