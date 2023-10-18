import React, {Component} from "react";
import {connect} from "react-redux";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as Constant from "utils/Constant";

class StepContainer extends Component {
    constructor(props) {
        super(props);
        this.onStepGetEmployer = this._onStepGetEmployer.bind(this);
        this.onStepTransfer = this._onStepTransfer.bind(this);
    }

    _onStepGetEmployer() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_GET_EMPLOYER,
        });
    }

    _onStepTransfer() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_PROCESS,
        });
    }

    render() {
        return (
            <Default
                title="Tool chuyển giỏ nhà tuyển dụng số lương lớn"
            >
                <div className="description">
                    <p>Hướng dẫn: Để thực hiện chuyển giỏ NTD số lượng lớn, bạn cần thực hiện 2 bước: <br/>
                        + Bước 1. Lấy danh sách NTD cần chuyển giỏ theo yêu cầu ( Bỏ qua bước này nếu bạn đã có sẵn danh
                        sách) <br/>
                        + Bước 2. Chia giỏ NTD từ danh sách có sẵn
                    </p>
                </div>
                <div className="button-group">
                    <button type="button" className="btn btn-primary btn-sm mr5" onClick={this.onStepGetEmployer}>
                        Bước 1. Lấy DS NTD cần chuyển
                    </button>
                    <button type="button" className="btn btn-primary btn-sm mr5" onClick={this.onStepTransfer}>
                        Bước 2. Chia giỏ NTD từ DS có sẵn
                    </button>
                </div>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StepContainer);
