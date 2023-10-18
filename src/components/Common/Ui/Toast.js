import React, {Component} from "react";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {connect} from "react-redux";

class Toast extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(newProps) {
        if (newProps.ui.toast && newProps.ui.toast !== this.props.ui.toast){
            switch (newProps.ui.toast.error){
                case 0:
                    toast.success(newProps.ui.toast.msg);
                    break;
                case 1:
                    toast.error(newProps.ui.toast.msg);
                    break;
                case 2:
                    toast.warn(newProps.ui.toast.msg);
                    break;
                default:
                    break;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextStat) {
        return false;
    }

    render() {
        return (
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover
                {...this.props}
            />
        );
    }
}

const mapStateToProps = state => ({
    ui: state.ui
});

export default connect(mapStateToProps)(Toast);
