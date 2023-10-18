import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import moment from "moment";

class PopupInfo extends Component {
    constructor(props) {
        super(props);

        this.onClose = this._onClose.bind(this);
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    render () {
        const {object} = this.props;
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        <div className="row">
                            <div className="col-sm-8 col-xs-8 mb10">
                                <div className="col-sm-5 col-xs-5 padding0">Tên nhà tuyển dụng</div>
                                <div className="col-sm-7 col-xs-7"><b>{object?.employer_info?.name}</b></div>
                            </div>
                            <div className="col-sm-8 col-xs-8 mb10">
                                <div className="col-sm-5 col-xs-5 padding0">Người thêm</div>
                                <div className="col-sm-7 col-xs-7"><b>{object?.created_by}</b></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-8 col-xs-8 mb10">
                                <div className="col-sm-5 col-xs-5 padding0">Thời gian thêm</div>
                                <div className="col-sm-7 col-xs-7"><b>{moment.unix(object?.created_at).format("DD-MM-YYYY HH:mm:ss")}</b></div>
                            </div>
                            <div className="col-sm-8 col-xs-8 mb10">
                                <div className="col-sm-5 col-xs-5 padding0">Lý do</div>
                                <div className="col-sm-7 col-xs-7"><b>{object?.reason}</b></div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="v-divider margin0" />
                <div className="v-card-action">
                    <button type="button" className="el-button el-button-primary el-button-small" onClick={this.onClose}>
                        <span>Đóng</span>
                    </button>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupInfo);
