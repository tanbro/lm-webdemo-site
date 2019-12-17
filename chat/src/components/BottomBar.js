import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';



class BottomBar extends React.Component {
    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        value: ''
    };

    handleChange(event) {
        event.preventDefault();
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.value);
        this.setState({ value: '' });
    }

    render() {
        return (
            <nav className="navbar border-top fixed-bottom navbar-light bg-light">
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <div className="input-group">
                        <input type="text" className="form-control"
                            value={this.state.value} onChange={this.handleChange}
                            placeholder="输入您要发送的内容"></input>
                        <div className="input-group-append">
                            <button type="submit" value="Submit" className="btn btn-outline-secondary">发送</button>
                        </div>
                        <button type="button" className="btn btn-outline-secondary">...</button>
                    </div>
                </form>
            </nav>
        )
    }
}

export default BottomBar;
