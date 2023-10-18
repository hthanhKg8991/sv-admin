import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import ComponentFilter from "pages/Payment/StatementPage/ComponentFilter";
import {exportStatement, getListStatement, importStatement, updateStatement, deleteStatement} from "api/statement";
import {mappingManualStatement} from "api/saleOrder";
import {formatNumber} from "utils/utils";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {IS_STATEMENT_TEST_YES} from "utils/Constant";
import PopupNote from "pages/Payment/StatementPage/Popup/Note";
import PopupCustomerCare from "pages/Payment/StatementPage/Popup/CustomerCare";
import PopupInv from "pages/Payment/StatementPage/Popup/Inv";
import {getDetailStaff} from "api/auth";

const idKey = "StatementPageList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Tên ngân hàng",
                    width: 140,
                    accessor: "bank_name"
                },
                {
                    title: "Mã giao dịch",
                    width: 100,
                    accessor: "transaction_code",
                },
                {
                    title: "Ngày giao dịch",
                    width: 120,
                    time: true,
                    accessor: "transaction_date",
                },
                {
                    title: "Nội dung giao dịch",
                    width: 140,
                    accessor: "content",
                },
                {
                    title: "Trạng thái map transaction",
                    width: 120,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_statement_mapping}
                                           value={row?.is_mapping}/>;
                    }
                },
                {
                    title: "Số tiền ghi nợ",
                    width: 120,
                    cell: row => row?.transaction_type === Constant.TRANSACTION_TYPE_SUB && formatNumber(row?.amount, 0, ".", "đ")
                },
                {
                    title: "Số tiền ghi có",
                    width: 120,
                    cell: row => row?.transaction_type === Constant.TRANSACTION_TYPE_ADD && formatNumber(row?.amount, 0, ".", "đ")
                },
                {
                    title: "QR code",
                    width: 100,
                    accessor: "qr_code"
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    time: true,
                    accessor: "created_at",
                },
                {
                    title: "Người tạo",
                    width: 100,
                    accessor: "created_by",
                },
                {
                    title: "Thông tin",
                    width: 120,
                    cell: row => (
                        <>
                            <p className="mb5">KT đánh dấu: <SpanCommon idKey={Constant.COMMON_DATA_KEY_statement_test}
                                                                        value={row?.is_test}/>
                            </p>
                            <p className="mb5">CSKH: {row?.customer_care}</p>
                            <p className="mb5">INV: {row?.inv}</p>
                            <p className="mb5">Ghi chú: {row?.note}</p>
                        </>
                    )
                },
                {
                    title: "Hành động",
                    width: 200,
                    cell: row => {
                        const isMapping = Number(row?.is_mapping) === Constant.STATEMENT_NOT_MAPPING &&
                            row?.transaction_type === Constant.TRANSACTION_TYPE_ADD;
                        const isTest = Number(row?.is_test) !== Constant.IS_STATEMENT_TEST_YES;
                        return (
                            <>
                                {isMapping && (
                                    <CanRender actionCode={ROLES.payment_manage_statement_mapping_manual}>
                                          <span className="text-link text-blue font-bold"
                                                onClick={() => this.onMapping(row.id)}>
                                                      Map tay
                                          </span>
                                        <br/>
                                    </CanRender>
                                )}
                                {isTest && (
                                    <>
                                        <span className="text-danger text-underline cursor-pointer font-bold"
                                              onClick={() => this.onIsTest(row.id)}>
                                            Đánh dấu Rồi
                                        </span>
                                        <br/>
                                    </>
                                )}
                                <span className="text-link text-blue font-bold"
                                      onClick={() => this.onCustomerCare(row)}>
                                    {row?.customer_care?.length > 0 ? 'Sửa CSKH' : 'Thêm CSKH'}
                                </span> <br/>
                                <span className="text-link text-blue font-bold"
                                      onClick={() => this.onInv(row)}>
                                    {row?.inv?.length > 0 ? 'Sửa INV' : 'Thêm INV'}
                                </span> <br/>
                                <span className="text-link text-blue font-bold"
                                      onClick={() => this.onNote(row)}>
                                       {row?.note?.length > 0 ? 'Sửa ghi chú' : 'Thêm ghi chú'}
                                </span> <br/>
                                {
                                    <CanRender actionCode={ROLES.payment_manage_statement_delete_transaction}>
                                        <span className="text-underline text-danger cursor-pointer font-bold"
                                            onClick={() => this.onDelete(row)}>
                                            Xóa
                                        </span>
                                    </CanRender>
                                }
                            </>
                        )
                    }
                }
            ],
            loading: false,
            isImport: true,
            resImport: null,
            resExport: false,
        };
        this.textInput = React.createRef();
        this.onMapping = this._onMapping.bind(this);
        this.onIsTest = this._onIsTest.bind(this);
        this.onCustomerCare = this._onCustomerCare.bind(this);
        this.onNote = this._onNote.bind(this);
        this.onInv = this._onInv.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onImportFile = this._onImportFile.bind(this);
        this.onExport = this._onExport.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    async _onMapping(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc chắn map tay ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                actions.showLoading();
                const res = await mappingManualStatement({
                    statement_id: id
                });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideLoading();
            }
        });
    }

    async _onIsTest(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc chắn đánh dấu Rồi ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                actions.showLoading();
                const res = await updateStatement({
                    id: id,
                    is_test: IS_STATEMENT_TEST_YES,
                });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideLoading();
            }
        });
    }

    async _onExport() {
        this.setState({resExport: false});
        const {query, actions} = this.props;
        const res = await exportStatement(query);
        actions.showLoading();
        if(res) {
            actions.putToastSuccess(`Export thành công`);
            this.setState({resExport: true});
        }
        actions.hideLoading();
    }

    async _onDelete(data) {
        const {actions} = this.props;

        actions.SmartMessageBox({
            title: `Xác nhận xóa sao kê. Bạn có muốn xóa sao kê ID ${data?.id}?`,
            content: "",
            buttons: ['Không', 'Có']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Có") {
                actions.hideSmartMessageBox();
                actions.showLoading();
                const res = await deleteStatement({id: data?.id});
                if (res) {
                    actions.putToastSuccess(`Xóa thành công`);
                    publish(".refresh", {}, idKey);
                }
                actions.hideLoading();
            } else {
                actions.hideSmartMessageBox();
            }
        });
    }

    _onNote(object) {
        const {actions} = this.props;
        actions.createPopup(PopupNote, "Thêm ghi chú", {object: object, idKey: idKey});
    }

    _onInv(object) {
        const {actions} = this.props;
        actions.createPopup(PopupInv, "Thêm Inv", {object: object, idKey: idKey});
    }

    _onCustomerCare(object) {
        const {actions} = this.props;
        actions.createPopup(PopupCustomerCare, "Thêm CSKH", {object: object, idKey: idKey});
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_PAYMENT_MANAGE_STATEMENT,
            search: '?action=edit&id=0'
        });
    }

    async _onChangeFileImport(event) {
        const {actions} = this.props;
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.setState({isImport: false, resImport: null});
        const {name} = file;
        const ext = name?.split(".").pop();
        if (Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
            let data = new FormData();
            data.append("file", file);
            const body = {file: data, up_file: true};
            const resImport = await importStatement(body);
            if (resImport) {
                this.setState({loading: false});
                actions.putToastSuccess(`Import thành công ${resImport?.success} dòng`);
                this.setState({resImport: resImport});
                publish(".refresh", {}, idKey);
            }
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
        }
        this.setState({isImport: true});
    }

    _onImportFile() {
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
        const {columns, isImport, resImport, resExport, userInfo} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                title="Danh Sách Statement"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <ComponentFilter idKey={idKey} query={query}/>
                <div className="mt10 mb10">
                    <CanRender actionCode={ROLES.payment_manage_statement_create}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </CanRender>
                    {isImport && <input type="file" ref={this.textInput} className="form-control mb10 hidden"
                                        onChange={this.onChangeFileImport}/>}
                    <CanRender actionCode={ROLES.payment_manage_statement_import}>
                        <button type="button" className="el-button el-button-warning el-button-small ml10"
                                onClick={this.onImportFile}>
                            <span>Import dữ liệu <i className="glyphicon glyphicon-upload"/> </span>
                        </button>
                        <a type="button" href={Constant.LINK_TEMPLATE_IMPORT_STATEMENT} download
                           className="el-button el-button-success el-button-small ml10">
                            <span>Tải mẫu import <i className="glyphicon glyphicon-download"/></span>
                        </a>
                    </CanRender>
                    <CanRender actionCode={ROLES.payment_manage_statement_export}>
                        <button type="button" className="el-button el-button-bricky el-button-small ml10"
                                onClick={this.onExport}>
                            <span>Export <i className="glyphicon glyphicon-export"/></span>
                        </button>
                    </CanRender>
                </div>
                {resImport && (
                    <div className="alert alert-success">
                        <p>Import thành công: <b>{resImport?.success} dòng</b></p>
                        <p>Import lỗi các dòng: <b>{resImport?.fail.join(', ')}</b></p>
                    </div>
                )}
                {resExport && (
                    <div className="alert alert-success">
                        Export dữ liệu thành công. <br/>
                        Vui lòng chờ hệ thống xử lý và gửi kết quả đến <b>{userInfo?.email}</b> <br/>
                    </div>
                )}
                <Gird idKey={idKey}
                      fetchApi={getListStatement}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      perPage={5}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
