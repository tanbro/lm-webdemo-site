import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import SpeechBubble from './SpeechBubble'
import SelfSpeechBubble from './SelfSpeechBubble'


class ListItemWrapper extends React.Component {
    render() {
        const data = this.props.data;

        return (
            <div>
                {data.isSelf ? (
                    <SelfSpeechBubble data={data}></SelfSpeechBubble>
                ) : (
                    <SpeechBubble data={data}></SpeechBubble>
                )}
            </div>
        )
    }
}

class SpeechBubbleList extends React.Component {
    render() {
        const itemsDom = this.props.data.map((m, i) =>
            <ListItemWrapper key={i} data={m}></ListItemWrapper>
        );
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