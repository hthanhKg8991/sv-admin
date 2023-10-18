import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/CustomerPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {deleteCustomer, getListCustomer} from "api/employer";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";
import SpanSystem from "components/Common/Ui/SpanSystem";
import {Link} from "react-router-dom";
import moment from "moment";

const idKey = "CustomerList";

class List extends Component {
    constructor(props) {
        super(props);
        const {vsics, listRoom} = props;
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Mã code",
                    width: 100,
                    accessor: "code"
                },
                {
                    title: "Loại code",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_type_code}
                                             value={row?.type_code} notStyle />
                },
                {
                    title: "Tên company",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Loại phòng",
                    width: 120,
                    cell: row => Array.isArray(listRoom) ?
                        listRoom.find(room => row?.room_id == room?.id)?.name : null,
                },
                {
                    title: "Ngày vào giỏ",
                    width: 100,
                    cell: row => <span>{moment.unix(row?.assigning_changed_at).format('DD-MM-YYYY')}</span>
                },
                {
                    title: "Nhãn",
                    width: 120,
                    cell: row => <>
                        {row?.assigning_changed_at &&
                            moment.unix(row?.assigning_changed_at).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ?
                            <span className="label ml10" typeof="assigning_changed_new" title="Mới"
                              style={{background: '#437c49', color: '#ffffff'}}>
                                Mới
                            </span>
                        :
                        <></>
                    }</>
                },
                {
                    title: "Phân loại company",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_premium_status}
                                             value={row?.premium_status}
                                             />,
                },
                {
                    title: "Trạng thái company",
                    width: 120,
                    cell: row => <SpanCommon  idKey={Constant.COMMON_DATA_KEY_customer_status}
                                              value={row.status}/>,
                },
                {
                    title: "Tỉnh thành",
                    width: 120,
                    cell: row => row?.province_id && <SpanSystem value={row?.province_id} type={"province"} notStyle/>
                },
                {
                    title: "Địa chỉ",
                    width: 120,
                    accessor: "address"
                },
                {
                    title: "Lĩnh vực hoạt động",
                    width: 120,
                    cell: row => Array.isArray(vsics) ?
                        vsics.filter(v => Array.isArray(row?.fields_activity) &&
                            row?.fields_activity.includes(v?.id))
                            .map(m => m?.name) : null,
                },
                {
                    title: "Quy mô",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                             value={row?.company_kind}
                                             notStyle />,
                },
                {
                    title: "CSKH",
                    width: 120,
                    accessor: "assigned_staff_username"
                },
            ],
            loading : false,
            isImport: true,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_CUSTOMER,
            search: '?action=edit&id=0'
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, vsics, listRoom} = this.props;
        const newDefaultQuery = {...defaultQuery, 'order_by[assigning_changed_at]': 'desc'};
        
        return (
            <Default
                    left={(
                        <WrapFilter 
                            idKey={idKey} 
                            query={query} 
                            ComponentFilter={ComponentFilter} 
                        />
                    )}
                    title="Danh Sách Quản Lý Company"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.customer_care_customer_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListCustomer}
                      query={query}
                      columns={columns}
                      defaultQuery={newDefaultQuery}
                      history={history}
                    //   isRedirectDetail={false}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
