import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

class TextMessage extends React.Component {
    render() {
        return(
            <span>{this.props.message}</span>
        )
    }
}

export default TextMessage
