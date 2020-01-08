import React from 'react';

import 'jquery/dist/jquery.min.js'
import 'popper.js/dist/umd/popper.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


class TopBar extends React.Component {
    constructor(props) {
        super(props)
        // This binding is necessary to make `this` work in the callback
        this.handleMenuItemItemClick = this.handleMenuItemItemClick.bind(this)
    }


    handleMenuItemItemClick(event) {
        const handler = this.props.onMenuItemClick
        if (handler) {
            const data = {
                option: event.target.dataset.option
            }
            return handler(data)
        }
    }

    render() {
        return (
            <nav className="navbar fixed-top shadow navbar-dark bg-dark">
                <img src={this.props.logo} alt="" className="rounded-circle" width="48" height="48"></img>
                <span className="navbar-brand"><small className='no-wrap'>{this.props.title}</small></span>
                <div className="btn-group">
                    <button type="button"
                        className="btn btm-sm btn-primary dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                    >
                        选项
                    </button>

                    <div className="dropdown-menu dropdown-menu-right">
                        <button className="dropdown-item" type="button"
                            data-option='reload'
                            onClick={this.handleMenuItemItemClick}
                        >
                            重新加载当前会话
                        </button>
                        <button className="dropdown-item" type="button"
                            data-option='clear'
                            onClick={this.handleMenuItemItemClick}
                        >
                            重置当前会话
                        </button>

                        <div className="dropdown-divider"></div>

                        <button className="dropdown-item" type="button"
                            data-option='reset'
                            onClick={this.handleMenuItemItemClick}
                        >
                            重启语言模型(警告: 将耗费较长时间)
                        </button>

                        <div className="dropdown-divider"></div>

                        <button className="dropdown-item" type="button"
                            data-option='more'
                            onClick={this.handleMenuItemItemClick}
                        >
                            更多 ...
                        </button>
                    </div>
                </div>
            </nav>

        )
    }
}

export default TopBar;
