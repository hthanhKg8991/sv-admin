import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import Gird from "components/Common/Ui/Table/Gird";
import {
    applySalesOrderPromotionPrograms,
    getPromotionProgramAppliedsBySalesOrder,
    getPromotionProgramsBySalesOrder
} from "api/saleOrder";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import Checkbox from '@material-ui/core/Checkbox';
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import CanAction from "components/Common/Ui/CanAction";

const idKey = "PromotionsPackage";

class PromotionsPackage extends Component {
    constructor(props) {
        super(props);
        const {sales_order} = props;

        const isDisableCheck = [Constant.SALE_ORDER_DELETED, Constant.SALE_ORDER_ACTIVED, Constant.SALE_ORDER_INACTIVE]
            .includes(parseInt(sales_order.status));

        this.state = {
            isShow: true,
            checked: [],
            applied: [],
            columns: [
                {
                    title: "",
                    width: 40,
                    cell: row => {
                        const {checked} = this.state;
                        const isChecked = checked.map(c => c.id).includes(Number(row?.id));
                        return (
                            <CanAction actionCode={ROLES.customer_care_sales_order_apply_promotions}>
                                <div className="text-center">
                                    <Checkbox
                                        checked={isChecked}
                                        color="primary"
                                        classes={{root: 'custom-checkbox-root'}}
                                        inputProps={{'aria-label': 'secondary checkbox'}}
                                        onChange={(e) => this.onCheckedPromotion(e, row)}
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
                    accessor: "title"
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
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_promotion_programs_position_allocate}
                                             value={row?.position_allocate} notStyle/>
                },
                {
                    title: "Gói dịch vụ",
                    width: 240,
                    cell: row => {
                        const {sales_order_items_info} = row;
                        const {checked} = this.state;
                        if (!Array.isArray(sales_order_items_info)) {
                            return <></>;
                        }
                        return (
                            <>
                                {sales_order_items_info.map((s, idx) => {
                                    const itemID = s?.id;
                                    const promotion = checked.find(c => c.id === row?.id);
                                    const itemsPromotion = promotion?.items || [];
                                    const isChecked = Array.isArray(itemsPromotion) && itemsPromotion.includes(Number(itemID));
                                    return (
                                        <CanAction actionCode={ROLES.customer_care_sales_order_apply_promotions}
                                                   key={idx.toString()}>
                                            <div className="ml5">
                                                <Checkbox
                                                    checked={isChecked}
                                                    color="primary"
                                                    classes={{root: 'custom-checkbox-root'}}
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                    onChange={(e) => this.onCheckedService(e, row?.id)}
                                                    value={itemID}
                                                    disabled={isDisableCheck}
                                                />
                                                <span
                                                    className="ml5">Mã dịch vụ: {itemID} - {s?.cache_service_name}</span>
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
                        const {applied} = this.state;
                        return applied.map((a, idx) => {
                            if (Number(a?.promotion_programs_id) === Number(row?.id)) {
                                return <p key={idx.toString()}>{utils.formatNumber(a?.discount_amount || 0, 0, ".", "đ")}</p>
                            }
                            return <></>;
                        });
                    }
                },
            ]
        };
        this.toggleShow = this._toggleShow.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.onApplyPromotions = this._onApplyPromotions.bind(this);
        this.onCheckedPromotion = this._onCheckedPromotion.bind(this);
        this.onCheckedService = this._onCheckedService.bind(this);
        this.getCheckedPromotions = this._getAppliedPromotions.bind(this);
    }

    _onCheckedPromotion(e, row) {
        const {uiAction} = this.props;
        const {checked} = this.state;
        const value = Number(e.target.value);
        const isChecked = e.target.checked;

        // add new id to state if checked
        // remove id from state if unchecked
        const itemsChecked = checked.find(c => c.id === value)?.items || [];
        const promotionsRemoveCurrent = checked.filter(c => c.id !== value);
        const newChecked = isChecked ?
            [...promotionsRemoveCurrent, {id: value, items: itemsChecked}] :
            promotionsRemoveCurrent;
        // set new state checked
        this.setState({checked: newChecked});

        // notify message if item empty
        const isPromotionApplyOrder = row?.position_apply === Constant.PROMOTION_PROGRAMS_APPLY_ORDER;
        if (isChecked && itemsChecked.length === 0 && !isPromotionApplyOrder) {
            uiAction.putToastWarning("Vui lòng chọn gói dịch vụ!");
        } else {
            this.onApplyPromotions(newChecked);
        }
    }

    _onCheckedService(e, promotionId) {
        const {checked} = this.state;
        // get value, check status of item
        const value = Number(e.target.value);
        const isChecked = e.target.checked;

        /*
           add new id to state item of programs if checked
           remove id from state item of programs if unchecked
        */
        const itemsPromotions = checked.find(c => c.id === promotionId)?.items || [];
        const serviceChecked = isChecked ?
            [...itemsPromotions, value] :
            itemsPromotions.filter(i => i !== value);

        // if uncheck last then promotion is deleted
        const serviceRemoveCurrent = checked.filter(c => c.id !== promotionId);
        const newChecked = (!isChecked && serviceChecked?.length === 0) ?
            serviceRemoveCurrent
            :
            [...serviceRemoveCurrent, {
                id: promotionId,
                items: serviceChecked
            }]
        ;

        // set new state checked
        this.setState({checked: newChecked});
        this.onApplyPromotions(newChecked);
    }

    async _onApplyPromotions(checked) {
        const {sales_order, uiAction} = this.props;
        const res = await applySalesOrderPromotionPrograms({
            sales_order_id: sales_order.id,
            promotion_programs: checked
        });
        if (res) {
            uiAction.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, 'SalesOrderEditPage');
            this.asyncData();
        }
    }

    _asyncData() {
        publish(".refresh", {}, idKey);
        this._getAppliedPromotions();
    }

    _toggleShow() {
        const {isShow} = this.state;
        this.setState({isShow: !isShow});
    }

    async _getAppliedPromotions() {
        const {sales_order} = this.props;
        const res = await getPromotionProgramAppliedsBySalesOrder({sales_order_id: sales_order.id});
        let checked = [];
        res.forEach((item) => {
            /*
                add new id to state item of programs if checked
                remove id from state item of programs if unchecked
             */
            if (checked.some(i => i.id === item?.promotion_programs_id)) {
                const obj = checked.find(i => i.id === item?.promotion_programs_id);
                const newObj = {...obj, items: [...obj?.items, item?.sales_order_items_id]};
                checked = [...checked.filter(c => c.id !== item?.promotion_programs_id), newObj];
            } else {
                const newObj = {id: item?.promotion_programs_id, items: [item?.sales_order_items_id]};
                checked = [...checked, newObj];
            }
        });
        this.setState({checked: checked, applied: res})
    }

    componentDidMount() {
        this.getCheckedPromotions();
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
                                <div className="left">
                                    <CanRender actionCode={ROLES.customer_care_sales_order_promotions}>
                                        <button type="button"
                                                className="el-button el-button-primary el-button-small mb20"
                                                onClick={() => {
                                                    this.asyncData()
                                                }}
                                        >
                                            <span>Cập nhật <i className="fa fa-refresh ml5"/></span>
                                        </button>
                                    </CanRender>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-xs-12">
                                        <Gird idKey={idKey}
                                              fetchApi={getPromotionProgramsBySalesOrder}
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
