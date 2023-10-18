import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";


class PopupLogFileUpload extends Component {
    render() {
        const {files} = this.props;
        return (

                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                {files?.map((v,i)=>(
                                    <div key={i}>
                                        <a href={v} target="_blank" rel="noopener noreferrer" className="font-bold">{`${i+1} - ${v?.split('/').pop()}`}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupLogFileUpload);
