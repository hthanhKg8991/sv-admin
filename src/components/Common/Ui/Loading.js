import React, { Component } from 'react';
import {connect} from "react-redux";

class Loading extends Component {
    constructor (props) {
        super(props);
        this.state = {
            ui: props.ui
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({ui: newProps.ui});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        if (this.state.ui.loading && this.state.ui.loading.isShowLoading && !this.state.ui.loading.id) {
            return (
                <div className="dialog-wrapper-loading" style={this.props.style}>
                    <div className="boxes box-loading">
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                        <div className="box">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                    </div>
                </div>
            )
        }else {
            return null;
        }
    }
}

function mapStateToProps(state) {
    return {
        ui: state.ui,
    };
}

export default connect(mapStateToProps)(Loading);
