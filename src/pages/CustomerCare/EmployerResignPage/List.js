import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as uiAction from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import ROLES from "utils/ConstantActionCode";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";
import Gird from "components/Common/Ui/Table/Gird";
import CanRender from "components/Common/Ui/CanRender";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerResignPage/ComponentFilter";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupInfo from "pages/CustomerCare/EmployerResignPage/PopupInfo";
import {deleteEmployerResign, getListEmployerResign} from "api/saleOrder";

const idKey = "EmployerResignList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 200,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail",
                                id: row?.employer_id
                            })}`}>
                            <span>{row?.employer_id} - {row?.employer_info?.name}</span>
                        </Link>
                    )
                },
                {
                    title: "Loại tài khoản",
                    width: 120,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                                    value={row?.employer_info?.premium_status}/>
                    )
                },
                {
                    title: "Phân loại NTD",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                    value={row?.employer_info?.employer_classification}/>
                    )
                },
                {
                    title: "Nhãn",
                    width: 120,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                    value={row?.employer_info?.company_kind || row?.employer_info?.company_size}/>
                    )
                },
                {
                    title: "Ngày vào DS",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Hết hạn tái ký",
                    width: 120,
                    cell: row => row?.end_at ? moment.unix(row?.end_at).format("DD-MM-YYYY HH:mm:ss") : null
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_resign_status} value={row?.status} />
                },
                {
                    title: "CSKH",
                    width: 120,
                    cell: row => row?.employer_info?.assigned_staff_username
                },
                {
                    title: "Hành động",
                    width: 80,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.customer_care_employer_resign_view}>
                                <span className="text-link text-blue font-bold mr5" onClick={() => this.onView(row)}>Xem</span>
                            </CanRender>
                            {row?.status !== Constant.STATUS_DELETED &&
                                <CanRender actionCode={ROLES.customer_care_employer_resign_delete}>
                                    <span className="text-link text-red font-bold" onClick={() => this.onDelete(row?.id)}>Xóa</span>
                                </CanRender>
                            }
                        </>
                    )
                },
            ],
            loading : false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onView = this._onView.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER_RESIGN,
            search: '?action=edit&id=0'
        });
    }

    _onView(object) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupInfo, "Thông tin NTD tái ký",{object: object});
    }

    _onDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa NTD tái ký ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteEmployerResign({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh Sách NTD Được Hưởng Tái Ký"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.customer_care_employer_resign_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListEmployerResign}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
