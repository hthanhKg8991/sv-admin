import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import SpanText from "components/Common/Ui/SpanText";
import * as Constant from "utils/Constant";

class PopupViewNotification extends Component {
    render () {
        let {object, status, fnReqChangeStatus, fnClosePopup} = this.props;

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="alert alert-danger mt10" role="alert">
                        Vui lòng kiểm tra lại nội dung thông báo trước khi kích hoạt
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-xs-12">
                            <p><b>Tiêu đề:</b> {object?.title}</p>
                            <p className="d-flex"><b>Đối tượng:</b> <SpanText idKey={Constant.COMMON_DATA_KEY_notification_object} value={object?.notify_object} /></p>
                            <p className="d-flex"><b>Hình thức:</b> <SpanText idKey={Constant.COMMON_DATA_KEY_notification_type} value={object?.notify_type} /></p>
                            <p><b>Nội dung:</b>
                                <div className="content mt10 ml10" dangerouslySetInnerHTML={{__html: object?.content}} />
                            </p>
                        </div>
                    </div>
                </div>
                <hr className="v-divider margin0" />
                <div className="v-card-action text-center">
                    <button type="button" className="el-button el-button-success el-button-small" onClick={() => fnReqChangeStatus(object, status)}>
                        <span>Kích hoạt</span>
                    </button>
                    <button type="button" className="el-button el-button-default el-button-small" onClick={() => fnClosePopup()}>
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
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupViewNotification);
