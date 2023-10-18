import React, {Component} from "react";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import Gird from "components/Common/Ui/Table/Gird";
import {getListBanner, rejectBannerV3} from "api/booking";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import {putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import queryString from "query-string";
import SpanCommon from "components/Common/Ui/SpanCommon";
import moment from "moment";
import FormReject from "./FormReject";
import * as Yup from "yup";
import PopupForm from "components/Common/Ui/PopupForm";

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = {...props.query, ...{action: 'detail'}};
        this.state = {
            columns: [
                {
                    title: "Mã đặt chỗ",
                    width: 130,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_BOOKING_BANNER}?${queryString.stringify({...paramsQuery, ...{code: row.code}})}`}>
                            <span>{row.code}</span>
                        </Link>
                    )
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 150,
                    cell: row => (
                        <Link
                            target={"_blank"}
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                id: row.employer_id,
                                action: "detail"
                            })}`}>
                            <span>{row.employer_name}</span>
                        </Link>
                    )
                },
                {
                    title: "Email NTD",
                    width: 130,
                    accessor: "employer_email"
                },
                {
                    title: "Gói dịch vụ",
                    width: 150,
                    accessor: "booking_box_name"
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_booking_status}
                                        value={row.booking_status}/>
                            {row.booking_status === Constant.BOOKING_STATUS_CANCELED && (
                                <React.Fragment>
                                    (<SpanCommon idKey={Constant.COMMON_DATA_KEY_booking_canceled_reason}
                                                 value={row.cancelled_reason}/>)
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày lên tin",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            {row.from_date && moment.unix(row.from_date)
                                .format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày đặt chỗ",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at)
                                .format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày hết hạn",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            {row.to_date && moment.unix(row.to_date)
                                .format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "CSKH đặt chỗ",
                    width: 130,
                    accessor: "created_by"
                },
                {
                    title: "",
                    width: 70,
                    cell: row => (
                        ![Constant.BOOKING_STATUS_USED, Constant.BOOKING_STATUS_CANCELED].includes(row?.booking_status) && (
                            <CanRender actionCode={ROLES.customer_care_booking_management_reject}>
                                <span className={"cursor-pointer btn-delete"} onClick={() => this.onReject(row)}>
                                    <b>Hủy</b>
                                </span>
                            </CanRender>
                        )
                    )
                }
            ],
            loading: false,
            idKey: "BookingList"
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onBeforeReject = this._onBeforeReject.bind(this);
        this.onRejectSuccess = this._onRejectSuccess.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_BOOKING_BANNER,
            search: '?action=edit&id=0'
        });
    }

    _onReject(item) {
        this.popupReject._handleShow(item);
    }

    _onBeforeReject() {
        return window.confirm("Bạn có chắc chắn muốn hủy!");
    }

    async _onRejectSuccess(res, data) {
        const {actions} = this.props;
        if(res?.code === Constant.CODE_RES_CONFIRM) {
            const confirm = window.confirm(res.msg);
            if(confirm) {
                const res_continue = await rejectBannerV3({...data, allowed_continue: true});
                if(res_continue?.code === Constant.CODE_SUCCESS) {
                    const {idKey} = this.state;
                    publish(".refresh", {}, idKey);
                } else {
                    actions.putToastError(res_continue.msg);
                }
            }
        } else if(res?.code !== Constant.CODE_SUCCESS) {
            actions.putToastError(res?.msg);
        }
    }

    render() {
        const {columns, idKey} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey}
                                query={query}
                                ComponentFilter={ComponentFilter}/>
                )}
                title={"Danh Sách Đặt Chổ Quảng bá thương hiệu"}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <CanRender actionCode={ROLES.customer_care_banner_management_create}>
                        <div className="left btnCreateNTD">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Đăng ký đặt chỗ <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                }>
                <Gird idKey={idKey} fetchApi={getListBanner}
                      query={query} columns={columns}
                      defaultQuery={{...defaultQuery}}
                      isRedirectDetail={false}
                      history={history}/>
                <PopupForm onRef={ref => (this.popupReject = ref)}
                           title={"Hủy Mã Đặt Chỗ"}
                           FormComponent={FormReject}
                           initialValues={{}}
                           validationSchema={Yup.object().shape({
                               code: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
                               cancelled_reason: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
                           })}
                           apiSubmit={rejectBannerV3}
                           apiResponseFull={true}
                           beforeSubmit={this.onBeforeReject}
                           afterSubmit={this.onRejectSuccess}
                           hideAfterSubmit/>
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
