import React,{Component} from "react";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {connect} from "react-redux";

class PopupReasonDropJob extends Component {
    constructor(props) {
        super(props);
        this.hidePopup = this._hidePopup.bind(this);
    }

    _hidePopup(){
        this.props.uiAction.deletePopup();
    }

    render() {
        let {note} = this.props;

        return (
        <div className="dialog-popup-body">
            <div className="popupContainer">
                <div className="row form-container">
                    <div className="col-sm-12 col-xs-12 mb15 mt10"  dangerouslySetInnerHTML={{__html: note}}/>
                </div>
            </div>
            <hr className="v-divider margin0" />
            <div className="v-card-action">
                <button type="button" className="el-button el-button-primary el-button-small" onClick={this.hidePopup}>
                    <span>Quay lại</span>
                </button>
            </div>
        </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null,mapDispatchToProps)(PopupReasonDropJob);
