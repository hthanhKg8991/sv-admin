import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {employerCheckEmail} from "api/employer";
import Default from "components/Layout/Page/Default";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {getDetailStaff} from "api/auth";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMessage: false,
            isImport: true,
            totalSearch: null,
            userInfo: null
        };
        this.textInput = React.createRef();
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onImportFile = this._onImportFile.bind(this);
    }

    async _onChangeFileImport(event) {
        const {actions} = this.props;
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.setState({isImport: false});
        const {name} = file;
        const ext = name?.split(".").pop();
        if (Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
            let data = new FormData();
            data.append("file", file);
            const body = {file: data, up_file: true};
            const resImport = await employerCheckEmail(body);
            if (resImport) {
                this.setState({loading: false});
                this.setState({showMessage: true});
                actions.putToastSuccess("Import file thành công");
                this.setState({totalSearch: resImport?.total_search});
            }
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
        }
        this.setState({isImport: true});
    }

    async _onImportFile() {
        this.textInput.current.click();
    }

    async _getUserInfo() {
        const {user} = this.props;
        const res = await getDetailStaff(user?.id);
        if (res) {
            this.setState({userInfo: res});
        }
    }

    componentDidMount() {
        this._getUserInfo();
    }

    render() {
        const {showMessage, isImport, totalSearch, userInfo} = this.state;

        return (
            <Default
                title="Tra cứu email NTD"
                buttons={(
                    <>
                        {showMessage && (
                            <div className="alert alert-success mb-3">
                                Import thành công. <br/>
                                Vui lòng chờ hệ thống xử lý và gửi kết quả đến <b>{userInfo?.email}</b> <br/>
                                Số lượng Email tra cứu: <b>{totalSearch}</b>
                            </div>
                        )}

                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.customer_care_search_check_email_create}>
                                {isImport &&
                                <input type="file" ref={this.textInput} className="form-control mb10 hidden"
                                       onChange={this.onChangeFileImport}/>}
                                <button type="button" className="el-button el-button-warning el-button-small"
                                        onClick={this.onImportFile}>
                                    <span>Import file <i className="glyphicon glyphicon-upload"/></span>
                                </button>
                            </CanRender>
                        </div>
                    </>
                )}>
                <p>Lưu ý: File tải lên phải thỏa mãn:</p>
                <ul>
                    <li>Định dạng: .xls hoặc .xlsx</li>
                    <li>Cột 1 là cột Email cần tra cứu (Bắt đầu lấy giá trị từ ô A1)</li>
                </ul>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
