import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilterDetail";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "./Popup/PopupDetailForm";
import * as Constant from "utils/Constant";
import {
    createByImport,
    deleteListContactDetail,
    getListListContactDetail,
} from "api/zalo";
import SpanCommon from "components/Common/Ui/SpanCommon";
import config from "config";
import moment from "moment";

const idKey = "ZaloZNSContactDetailList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Phone",
                    width: 200,
                    accessor: "phone"
                },
                {
                    title: "Email",
                    width: 200,
                    accessor: "email"
                },
                {
                    title: "Ref ID",
                    width: 200,
                    accessor: "ref_id"
                },
                {
                    title: "Loại",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_zalo_zns_list_contact_type}
                                    value={row.type}/>
                    )
                },
                {
                    title: "Ngày đăng ký",
                    width: 200,
                    cell: row =>
                        <span>{row.regist_date > 0 ? moment.unix(row.regist_date).format("DD-MM-YYYY") : null}</span>
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.email_marketing_list_contact_crud}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.email_marketing_list_contact_crud}>
                                {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <>
                                        <span className="text-link text-red font-bold ml5"
                                              onClick={() => this.onDelete(row?.id)}>
                                            Xóa
                                        </span>
                                    </>
                                )}
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onDownFileSample = this._onDownFileSample.bind(this);
    }

    _onClickAdd() {
        const {actions, query} = this.props;
        const {list_contact_id} = query;
        actions.createPopup(PopupForm, 'Thêm mới', {idKey, list_contact_id: list_contact_id});
    }

    _onEdit(object) {
        const {actions, query} = this.props;
        const {list_contact_id} = query;
        actions.createPopup(PopupForm, 'Chỉnh sửa', {idKey, list_contact_id: list_contact_id, object});
    }

    _onDownFileSample() {
        window.open(`${config.apiZaloDomain}${Constant.ZALO_ZNS_LIST_CONTACT_FILE_IMPORT_SAMPLE}`)
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa nhóm ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteListContactDetail({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    async _onChangeFileImport(event) {
        const {actions, query} = this.props;
        const {list_contact_id} = query;
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        let data = new FormData();
        data.append("file", file);
        data.append("list_contact_id", list_contact_id);
        const body = {file: data, up_file: true};
        const res = await createByImport(body);
        if (res) {
            if (res.total_items > 0) {
                actions.putToastSuccess(`Import thành công ${res.total_items} contract`);
            } else {
                actions.putToastError(`Import thất bại`);
            }
            publish(".refresh", {}, idKey);
        }
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <>
                <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh Sách Chi Tiết List Contact"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.email_marketing_list_contact_crud}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                            <CanRender actionCode={ROLES.email_marketing_list_contact_import_list}>
                                <label className="el-button el-button-primary el-button-small">
                                    <span>Import danh sách <i className="glyphicon glyphicon-plus"/></span>
                                    <input type="file" className="hidden"
                                           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                           onChange={this.onChangeFileImport}/>
                                </label>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onDownFileSample}>
                                    <span>Tải file import mẫu <i className="glyphicon glyphicon-download"/></span>
                                </button>
                            </CanRender>
                            <div>
                                <span className={"text-red"}>File định dạng  *.xlsx, *.xls, dung lượng 2MB.</span>
                            </div>
                        </div>
                    )}>
                    <Gird idKey={idKey}
                          fetchApi={getListListContactDetail}
                          query={query}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                          isPushRoute={true}
                          isReplaceRoute={true}
                          isRedirectDetail={false}
                    />
                </Default>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
