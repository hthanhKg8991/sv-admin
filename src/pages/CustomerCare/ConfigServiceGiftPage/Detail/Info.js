import React from "react";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import {hideLoading, hideSmartMessageBox, putToastSuccess, showLoading, SmartMessageBox} from "actions/uiAction";
import _ from "lodash";
import {bindActionCreators} from "redux";
import queryString from "query-string";
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {toggleActiveExtendPrograms, checkExtendPrograms} from "api/saleOrder";
import {publish} from "utils/event";
import * as utils from "utils/utils";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.onCheck = this._onCheck.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    async _onCheck() {
        const {item} = this.props;
        this.setState({loading: true});
        const res = await checkExtendPrograms({id: item.id});
        if (res) {
            window.open(res?.url);
        }
        this.setState({loading: false});
    }

    _onApprove() {
        const {actions, item, idKey} = this.props;
        const {id} = item;
        actions.SmartMessageBox({
            title: item?.status === Constant.STATUS_INACTIVED 
                    ? 'Bạn có chắc muốn duyệt cấu hình tặng phí dịch vụ ID: ' + id
                    : `Xác nhận ngừng chạy cấu hình tặng phí dịch vụ (ID: ${id})?`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleActiveExtendPrograms({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }


    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    render() {
        const {item, sys} = this.props;
        const {conditions = []} = item;
        const commonPromotionsItems = sys?.items[Constant.COMMON_DATA_KEY_config_service_gift_condition_items];

        return (
            <div className="row content-box">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Tài Khoản</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">ID</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên chương trình</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.title}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_extend_programs_status}
                                        value={item?.status} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Gói dịch vụ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {item?.service_type?.map((service, idx) => (
                                <p key={String(idx)}>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_extend_programs_service_type}
                                                value={service} notStyle/>
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Loại gói phí</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {item?.fee_type?.map((type, idx) => (
                                <p key={String(idx)}>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_extend_programs_fee_type}
                                                value={type} notStyle/>
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Thời gian hiệu lực</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {moment.unix(item?.start_date).format("DD-MM-YYYY")} -
                            {moment.unix(item?.end_date).format("DD-MM-YYYY")}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ghi chú</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.note}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content mt20 row-title padding0">Điều kiện áp dụng</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        {conditions.map((c, idx) => {
                            const promotion = commonPromotionsItems.find(p => p?.value === c?.left);
                            const type = promotion?.from;
                            return (
                                <div className="row mb5" key={idx.toString()}>
                                    <div className="col-sm-2 col-xs-2 padding0">
                                        {promotion?.name}
                                    </div>
                                    <div className="col-sm-1 col-xs-1">
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_promotion_programs_condition_operation}
                                                    value={c?.operation} notStyle/>
                                    </div>
                                    <div className="col-sm-2 col-xs-2 padding0">
                                        {[
                                            Constant.PROMOTIONS_CONDITION_TYPE.input,
                                            Constant.PROMOTIONS_CONDITION_TYPE.select,
                                            Constant.PROMOTIONS_CONDITION_TYPE.select_multi,
                                        ].includes(type) && (
                                            <>{c?.right}</>
                                        )}
                                        {type === Constant.PROMOTIONS_CONDITION_TYPE.currency && (
                                            <>{utils.formatNumber(c?.right, 0, ".", "đ")}</>
                                        )}
                                        {type === Constant.PROMOTIONS_CONDITION_TYPE.date && (
                                            <>{moment.unix(c?.right).format("DD-MM-YYYY HH:mm:ss")}</>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt10">
                    <CanRender actionCode={ROLES.customer_care_config_service_gift_review}>
                        <button type="button" className="el-button el-button-primary el-button-small mr5"
                                onClick={() => this.onCheck()}>
                            <span>Xem trước</span>
                        </button>
                    </CanRender>
                    {item?.status === Constant.STATUS_INACTIVED && (
                        <CanRender actionCode={ROLES.customer_care_config_service_gift_approve}>
                            <button type="button" className="el-button el-button-bricky el-button-small mr5"
                                    onClick={() => this.onApprove()}>
                                <span>Duyệt</span>
                            </button>
                        </CanRender>
                    )}
                    {item?.status === Constant.STATUS_ACTIVED && (
                        // <CanRender actionCode={ROLES.customer_care_config_service_gift_shut_down}>
                            <button type="button" className="el-button el-button-primary el-button-small mr5"
                                    onClick={() => this.onApprove()}>
                                <span>Ngưng hoạt động</span>
                            </button>
                        // </CanRender>
                    )}
                    <br/>
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={() => this.goBack()}>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({
            putToastSuccess,
            showLoading,
            hideLoading,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        sys: state.sys.common
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
