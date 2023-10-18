import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getEmployerNotDisturbList, deleteEmployerNotDisturb, importEmployerNotDisturb} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerNotDisturbPage/ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
const idKey = "EmployerNotDisturbList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên NTD",
                    width: 160,
                    accessor: "name"
                },
                {
                    title: "Email",
                    width: 160,
                    accessor: "email"
                },
                {
                    title: "Số ĐT",
                    width: 160,
                    accessor: "phone"
                },
                {
                    title: "Ngày thêm vào DS",
                    width: 160,
                    cell: row => (
                        <>{moment.unix(row?.start_date).format("DD-MM-YYYY")}</>
                    )
                },
                {
                    title: "Số NTD phù hợp trùng từ khóa cấm làm phiền",
                    width: 160,
                    accessor: "total_employer",
                },
                {
                    title: "Hành động",
                    width: 160,
                    cell: row => (row?.status !== Constant.STATUS_DELETED) && (
                        <CanRender actionCode={ROLES.customer_care_employer_not_disturb_delete}>
                            <span onClick={() => this.onDelete(row.id, row?.total_employer)} className="btn-delete font-weight-bold">
                                Xóa
                            </span>
                        </CanRender>
                    )
                },
            ],
            file: null,
            loading: false,
            isImport: true,
        };
        this.textInput = React.createRef();
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onImportFile = this._onImportFile.bind(this);
    }

    async _onChangeFileImport(event) {
        const {actions} = this.props;
        const file = event.target.files[0];
        if(!file){
            return;
        }
        this.setState({isImport: false});
        const {name} = file;
        const ext = name?.split(".").pop();
        if(Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
            let data = new FormData();
            data.append("file", file);
            const body = {file: data,up_file: true};
            const resImport = await importEmployerNotDisturb(body);
            if(resImport) {
                this.setState({loading: false});
                actions.putToastSuccess(`Import thành công ${resImport?.total_add} NTD cấm làm phiền`);
                publish(".refresh", {}, idKey);
            }
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
        }
        this.setState({isImport: true});
    }

    async _onImportFile() {
        this.textInput.current.click();
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER_NOT_DISTURB,
            search: '?action=edit&id=0'
        });
    }

    _onDelete(id, total) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                const res = await deleteEmployerNotDisturb({id});
                const {code} = res;
                if(code === Constant.CODE_RES_CONFIRM) {
                    const confirm = window.confirm(`Có ${total} NTD trùng từ khóa này, bạn có chắc xóa từ khóa không ?`);
                    if(confirm) {
                        const resRely = await deleteEmployerNotDisturb({id, allowed_continue: Constant.ALLOW_COUNTINUE_VALUE});
                        if (resRely) {
                            actions.putToastSuccess('Thao tác thành công');
                            publish(".refresh", {}, idKey);
                        }
                    }
                }
                else if(code === Constant.CODE_SUCCESS) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    render() {
        const {columns, isImport} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh sách NTD cấm làm phiền"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <>
                            <div className="left btnCreateNTD">
                                <CanRender actionCode={ROLES.customer_care_employer_not_disturb_import}>
                                    {isImport && <input type="file" ref={this.textInput} className="form-control mb10 hidden" onChange={this.onChangeFileImport}/>}
                                    <button type="button" className="el-button el-button-warning el-button-small" onClick={this.onImportFile}>
                                       <span>Import dữ liệu <i className="glyphicon glyphicon-upload"/> </span>
                                    </button>
                                    <p className="mt5">Lưu ý: File tải lên phải thỏa mãn:</p>
                                    <p className="mb5">1. Bắt buộc nhập Email/SĐT, Ngày cấm làm phiền</p>
                                    <p className="mb0">2. Nhập đúng thứ tự:</p>
                                    <ul className="list-unstyled">
                                        <li>+ Cột A (Bắt đầu từ A1): Tên công ty</li>
                                        <li>+ Cột B (Bắt đầu từ B1): Email</li>
                                        <li>+ Cột C (Bắt đầu từ C1): Số điện thoại</li>
                                        <li>+ Cột D (Bắt đầu từ D1): Ngày cấm làm phiền (dd-mm-yyyy)</li>
                                    </ul>
                                </CanRender>
                                <CanRender actionCode={ROLES.customer_care_employer_not_disturb_create}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.onClickAdd}>
                                        <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                    </button>
                                </CanRender>
                            </div>
                        </>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getEmployerNotDisturbList}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, status: Constant.STATUS_ACTIVED}}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
