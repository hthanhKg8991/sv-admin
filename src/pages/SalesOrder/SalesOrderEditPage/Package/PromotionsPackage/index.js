import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import Gird from "components/Common/Ui/Table/Gird";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import Checkbox from '@material-ui/core/Checkbox';
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import CanAction from "components/Common/Ui/CanAction";
import {applyPromotionV2, getListBySalesOrderPromotion} from "api/saleOrderV2";

const idKey = Constant.IDKEY_PROMOTION;

class PromotionsPackage extends Component {
    constructor(props) {
        super(props);
        const {sales_order} = props;
        const isDisableCheck = [
            Constant.SALES_ORDER_V2_STATUS_SUBMITTED,
            Constant.SALES_ORDER_V2_STATUS_CONFIRMED,
            Constant.SALES_ORDER_V2_STATUS_APPROVED,
            Constant.SALES_ORDER_V2_STATUS_REJECTED,
            Constant.SALES_ORDER_V2_STATUS_DELETED,

        ].includes(sales_order.status);

        this.state = {
            isShow: true,
            checked: [],
            applied: [],
            columns: [
                {
                    title: "",
                    width: 40,
                    cell: row => {
                        if (row.position_apply === 1) return <></>;
                        return (
                            <CanAction actionCode={ROLES.customer_care_sales_order_apply_promotions}>
                                <div className="text-center">
                                    <Checkbox
                                        checked={row?.sales_order_info?.is_applied === 1}
                                        color="primary"
                                        classes={{root: 'custom-checkbox-root'}}
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                        onChange={(e) => this.onApply(row?.code, null)}
                                        value={row?.id}
                                        disabled={isDisableCheck}
                                    />
                                </div>
                            </CanAction>
                        )
                    }
                },
                {
                    title: "Mã chương trình",
                    width: 80,
                    accessor: "code"
                },
                {
                    title: "Chương trình",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Tỉ lệ %",
                    width: 120,
                    cell: row => <>{row?.amount_percent}%</>
                },
                {
                    title: "Tiền mặt",
                    width: 120,
                    cell: row => utils.formatNumber(row?.amount, 0, ".", "đ")
                },
                {
                    title: "Áp dụng",
                    width: 160,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_promotion_programs_position_apply}
                                             value={row?.position_apply} notStyle/>
                },
                {
                    title: "Ghi chú",
                    width: 200,
                    accessor: "description"
                },
                {
                    title: "Gói dịch vụ",
                    width: 240,
                    cell: row => {
                        const {sales_order_item_info} = row;
                        if (!Array.isArray(sales_order_item_info)) {
                            return <></>;
                        }
                        return (
                            <>
                                {sales_order_item_info?.map((s, idx) => {
                                    const itemID = s?.id;
                                    return (
                                        <CanAction actionCode={ROLES.customer_care_sales_order_apply_promotions}
                                                   key={idx.toString()}>
                                            <div className="ml5">
                                                <Checkbox
                                                    checked={s.is_applied === 1}
                                                    color="primary"
                                                    classes={{root: 'custom-checkbox-root'}}
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                    onChange={(e) => this.onApply(row.code, s?.id)}
                                                    value={itemID}
                                                    disabled={isDisableCheck}
                                                />
                                                <span
                                                    className="ml5">Mã dịch vụ: {itemID} - {s?.sku_code}</span>
                                            </div>
                                        </CanAction>
                                    )
                                })}
                            </>
                        )
                    }
                },
                {
                    title: "Tiền giảm",
                    width: 160,
                    cell: row => {
                        if (row.position_apply === Constant.PROMOTION_PROGRAM_POSITION_APPLY_PACKAGE && row.sales_order_item_info){
                            return row?.sales_order_item_info?.map((a, idx) => {
                                return <p key={idx.toString()}>{utils.formatNumber(a?.promotion_amount_discount || 0, 0, ".", "đ")}</p>
                            });
                        }else {
                            return <p>{utils.formatNumber(row?.sales_order_info?.promotion_amount_discount || 0, 0, ".", "đ")}</p>
                        }


                    }
                },
            ]
        };
        this.toggleShow = this._toggleShow.bind(this);
        this.onApply = this._onApply.bind(this);
    }

    _toggleShow() {
        const {isShow} = this.state;
        this.setState({isShow: !isShow});
    }
    async _onApply(promotion_code,sales_order_item_id) {
        const {sales_order, uiAction, idKeySalesOrder} = this.props;
        const res = await applyPromotionV2({sales_order_id: sales_order.id,promotion_code,sales_order_item_id})
        if (res) {
            uiAction.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, idKey);
            publish(".refresh", {}, idKeySalesOrder);
            publish(".refresh", {}, Constant.IDKEY_ITEM_PACKAGE);
        }
    }

    render() {
        const {history, sales_order} = this.props;
        const {isShow, columns} = this.state;

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.toggleShow}>
                        <span className="title left">Promotions Campaign</span>
                        <div className={classnames("right", isShow ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={isShow}>
                        <div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-xs-12">
                                        <Gird idKey={idKey}
                                              fetchApi={getListBySalesOrderPromotion}
                                              query={{sales_order_id: sales_order.id}}
                                              columns={columns}
                                              defaultQuery={{}}
                                              history={history}
                                              isRedirectDetail={false}
                                              isPushRoute={false}
                                              isPagination={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsPackage);
