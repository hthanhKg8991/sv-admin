import React from "react";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {hideLoading, putToastSuccess, showLoading} from "actions/uiAction";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as utils from "utils/utils";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        this.goBack = this._goBack.bind(this);
        this.onEdit = this._onEdit.bind(this);
    }

    _onEdit() {
        const {history, item} = this.props;
        history.push({
            pathname: Constant.BASE_URL_COMMIT_CV,
            search: '?action=edit&id=' + item?.id
        });
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_COMMIT_CV
        });
    }

    render() {
        const {item, common} = this.props;
        const {loading} = this.state;
        const {conditions = []} = item;
        const commonPromotionsItems = common?.items[Constant.COMMON_DATA_KEY_promotion_programs_condition_items];

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <div className="row content-box">
                <div className="col-sm-6 col-xs-6">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin chung</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã campaign</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.code}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên campaign</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Thời gian áp dụng</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{moment.unix(item?.start_date).format("DD-MM-YYYY")}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Thời gian kết thúc</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{moment.unix(item?.end_date).format("DD-MM-YYYY")}</div>
                    </div>

                    <div className="col-sm-12 col-xs-12 mt20 row-content row-title padding0">Giá trị campaign</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Giá trị amount</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{utils.formatNumber(item?.amount, 0, ".", "")}đ
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Giá trị percent</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.amount_percent}%</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Vị trí áp dụng</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_promotion_programs_position_apply}
                                        value={item?.position_apply} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Vị trí phân bổ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_promotion_programs_position_allocate}
                                        value={item?.position_allocate} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Độ tự tiên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.priority}</div>
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
                <div className="col-sm-12 col-xs-12 mt20">
                    <CanRender actionCode={ROLES.sales_order_commit_cv_update}>
                        <button type="button" className="el-button el-button-info el-button-small"
                                onClick={this.onEdit}>
                            <span>Chỉnh sửa</span>
                        </button>
                    </CanRender>
                    <button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
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
        actions: bindActionCreators({putToastSuccess, showLoading, hideLoading}, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        common: state.sys.common
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
