import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {subscribe} from "utils/event";
import {
    approveSalesOrderByField,
    cancelSalesOrderByField,
    copySalesOrderByField,
    deleteSalesOrderByField, fieldSalesOrderPrintReport,
    getDetailSalesOrderByField,
    printFieldPrintTemplate,
    submitSalesOrderByField
} from "api/saleOrder";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import ROLES from "utils/ConstantActionCode";
import {Link} from "react-router-dom";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            object: {},
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.asyncData = this._asyncData.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.onPrint = this._onPrint.bind(this);
        this.goBack = this._goBack.bind(this);
        this.onComplete = this._onComplete.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onPrintReport = this._onPrintReport.bind(this);
        this.onCancel = this._onCancel.bind(this);
        this.btnCopy = this._btnCopy.bind(this);
    }

    _asyncData() {
        const {id} = this.props;
        this.setState({loading: true}, async () => {
            const res = await getDetailSalesOrderByField({id});
            this.setState({object: res, loading: false});
        });
    }

    _btnDelete() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteSalesOrderByField({id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    this.goBack();
                }
                uiAction.hideLoading();
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SALES_ORDER_BY_FIELD,
            search: '?action=list'
        });
        return true;
    }

    async _onPrint(code, pdf = null) {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printFieldPrintTemplate({sales_order_id: this.state.object.id, code: code, pdf });
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _onPrintReport() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await fieldSalesOrderPrintReport({id: this.state.object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _onComplete() {
        const {uiAction, id} = this.props;
        this.setState({loading: true});
        const res = await submitSalesOrderByField({id: id});
        if (res) {
            uiAction.putToastSuccess('Thao tác thành công');
            this.asyncData();
        }
        this.setState({loading: false});
    }

    _onApprove() {
        const { uiAction, id } = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn duyệt PĐK',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                this.setState({loading: true});
                const res = await approveSalesOrderByField({id: id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    this.asyncData();
                }
                this.setState({loading: false});
            }
        });
    }

    _onCancel() {
        const { uiAction, id } = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn hủy PĐK',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                this.setState({loading: true});
                const res = await cancelSalesOrderByField({id: id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    this.asyncData();
                }
                this.setState({loading: false});
            }
        });
    }

    async _btnCopy() {
        const { uiAction, id } = this.props;
        const res = await copySalesOrderByField({id: id});
        if(res) {
            uiAction.putToastSuccess('Thao tác thành công');
            const url = `${Constant.BASE_URL_SALES_ORDER_BY_FIELD}?action=edit&id=${res.id}`;
            window.open(url);
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="row content-box">
                    <div className="relative card-body text-center">
                        <LoadingSmall/>
                    </div>
                </div>
            )
        }
        const {object} = this.state;
        return (
            <div className="content-box">
                <div className="row mt10">
                    <div className="col-sm-5 col-xs-5">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            <span>Thông tin phiếu</span>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">ID</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.id}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">NTD</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.employer_info?.name}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">CSKH</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.employer_info?.assigned_staff_username}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Trạng thái</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status} value={object?.status}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ngày tạo</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {moment.unix(object.created_at).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Người tạo</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {_.get(object, 'created_by', null)}
                            </div>
                        </div>
                        {object.approved_at && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày duyệt phiếu</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object.approved_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        )}
                        {object.expired_at && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày hết hạn</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object.expired_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-sm-12 col-xs-12 mt15">
                        <Link to={Constant.BASE_URL_SALES_ORDER_BY_FIELD + "?action=edit&id=" + object.id}>
                            <button className="el-button el-button-primary el-button-small" type={"button"}>
                                Chi tiết
                            </button>
                        </Link>
                        {[
                            Constant.SALE_ORDER_INACTIVE,
                            Constant.SALE_ORDER_ACTIVED,
                            Constant.SALE_ORDER_EXPIRED,
                            Constant.SALE_ORDER_EXPIRED_ACTIVE,
                            Constant.SALE_ORDER_CANCEL,
                        ].includes(parseInt(object.status)) && (
                            <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_print}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={() => this.onPrint('hop_dong_check_mate')}>
                                    <span>In hợp đồng (Không bảo hành)</span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={() => this.onPrint('hop_dong_check_mate', 1)}>
                                    <span>In hợp đồng (Không bảo hành) (pdf)</span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={() => this.onPrint('hop_dong_check_mate_bao_hanh')}>
                                    <span>In hợp đồng (Có bảo hành)</span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={() => this.onPrint('hop_dong_check_mate_bao_hanh',1)}>
                                    <span>In hợp đồng (Có bảo hành) (pdf)</span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={() => this.onPrint('phu_luc_hop_dong_checkmate')}>
                                    <span>Phụ lục hợp đồng</span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={() => this.onPrint('phu_luc_hop_dong_checkmate', 1)}>
                                    <span>Phụ lục hợp đồng (pdf)</span>
                                </button>
                            </CanRender>
                        )}
                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(object?.status)) && (
                            <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_submit}>
                                <button type="button" className="el-button el-button-success el-button-small"
                                        onClick={this.onComplete}
                                >
                                    <span>Hoàn thành</span>
                                </button>
                            </CanRender>
                        )}
                        {[Constant.SALE_ORDER_INACTIVE].includes(parseInt(object?.status)) && (
                            <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_approve}>
                                <button type="button" className="el-button el-button-bricky el-button-small"
                                        onClick={this.onApprove}
                                >
                                    <span>Duyệt</span>
                                </button>
                            </CanRender>
                        )}
                        <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_print_report}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onPrintReport}
                            >
                                <span>In phiếu</span>
                            </button>
                        </CanRender>
                        {[
                            Constant.SALE_ORDER_ACTIVED,
                            Constant.SALE_ORDER_DISABLED,
                            Constant.SALE_ORDER_INACTIVE,
                            Constant.SALE_ORDER_NOT_COMPLETE,
                        ].includes(parseInt(object?.status)) && (
                            <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_cancel}>
                                <button type="button" className="el-button el-button-bricky el-button-small"
                                        onClick={this.onCancel}
                                >
                                    <span>Hủy phiếu</span>
                                </button>
                            </CanRender>
                        )}
                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(object.status)) && (
                            <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_delete}>
                                <button type="button" className="el-button el-button-bricky el-button-small"
                                        onClick={this.btnDelete}>
                                    <span>Xóa phiếu</span>
                                </button>
                            </CanRender>
                        )}
                        {![Constant.SALE_ORDER_DELETED].includes(parseInt(object.status)) && (
                            <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_copy}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.btnCopy}>
                                    <span>Sao chép</span>
                                </button>
                            </CanRender>
                        )}
                        <button type="button" className="el-button el-button-default el-button-small"
                                onClick={this.goBack}>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
