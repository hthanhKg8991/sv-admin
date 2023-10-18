import React, { Component } from 'react';

class LoadingSmall extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    componentWillReceiveProps(newProps) {

    }
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    render() {
        return (
            <div style={this.props.style} className={this.props.className}>
                <div className="lds-ripple"><div/><div/></div>
            </div>
        )
    }
}

export default LoadingSmall;
