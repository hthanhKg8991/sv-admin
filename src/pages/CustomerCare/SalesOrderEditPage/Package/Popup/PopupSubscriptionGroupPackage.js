import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {createGroupSubscriptionItem, getDetailProductGroupList, getListSubscription, getListOrderIncreasingConfigPriceByComboId} from "api/saleOrder";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import Dropbox from "components/Common/InputValue/Dropbox";
import Input2 from "components/Common/InputValue/Input2";

class PopupSubscriptionGroupPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {
                combo_id:this.props.defaultValue
            },
            items_groups: [],
            items_configs_groups: [],
            items_enable_config: [],
            object_required: ['combo_id', 'quantity'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getListItemsGroup = this._getListItemsGroup.bind(this);
        this.getListOrderIncreasingConfig = this._getListOrderIncreasingConfig.bind(this)
    }

    async _onSave(data) {
        this.setState({ object_error: {}, loading: true, name_focus: ""});
        let object = Object.assign({}, data);
        let object_required = this.state.object_required;
        const {items_enable_config} = this.state;

        if (items_enable_config.includes(object?.combo_id)) {
            object_required = object_required.concat(['advance_offer_info_id']);
        }

        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field,loading: false,object_error: check.fields});
            return;
        }
        object.sales_order_id = this.props.sales_order.id;
        
        const res = await createGroupSubscriptionItem(object);
        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_SUBSCRIPTION_PACKAGE);
            publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
        } else {
            this.setState({ object_error: Object.assign({}, res), loading: false});
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({ object: object }, () => {

            const {items_enable_config,object} = this.state

            if(name == 'combo_id' && items_enable_config.includes(object?.combo_id)){
                this.getListOrderIncreasingConfig()
            }
        });
    }

    async _getDetail(id) {
        const res = await getDetailProductGroupList({ id });
        if (res) {
            this.setState({ object: res });
        }
    }

    async _getListOrderIncreasingConfig() {
        const {object} = this.state
        const res = await getListOrderIncreasingConfigPriceByComboId({
            combo_id: object?.combo_id
        });
        
        if (res && Array.isArray(res)) {
            const items = res.map(item => {
                return {
                    title: `${item.advance_netsales}%`,
                    value: item.id,
                }
            });
            this.setState({ items_configs_groups: items });
        }
    }

    async _getListItemsGroup() {
        const res = await getListSubscription({ filter_expired: true,status: Constant.STATUS_ACTIVED, per_page: 100});
        if (res && Array.isArray(res?.items)) {
            const items = res.items.map(item => {
                return {
                    title: `${item.code} - ${item.name}`,
                    value: item.id,
                }
            });
            const itemsFiltered = res.items.filter(item => {
                return [Constant.SUBSCRIPTION_TYPE_PRO_VALUE,Constant.SUBSCRIPTION_TYPE_PLUS_VALUE].includes(item?.type_campaign)
            }).map((item) => item?.id);
            
            this.setState({ items_groups: items, items_enable_config: itemsFiltered });
        }
    }

    componentDidMount() {
        let { object,defaultValue } = this.props;
        if (object) {
            this.getDetail(object.id);
        }
        this.getListItemsGroup();
        if(defaultValue){
            this.getListOrderIncreasingConfig()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        const { object, object_required, object_error, items_groups, name_focus, items_configs_groups, items_enable_config } = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="combo_id"
                                    label="Chọn Subscription"
                                    data={items_groups}
                                    required={object_required.includes('combo_id')}
                                    error={object_error.combo_id}
                                    value={object.combo_id}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}

                                />
                            </div>
                            {items_enable_config.includes(object?.combo_id) && <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="advance_offer_info_id"
                                    label="% Tăng trưởng net sales"
                                    data={items_configs_groups}
                                    required={object_required.includes('advance_offer_info_id')}
                                    error={object_error.advance_offer_info_id}
                                    value={object.advance_offer_info_id}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}

                                />
                            </div>}
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="quantity" label="Số lượng" isNumber
                                        required={object_required.includes('quantity')}
                                        error={object_error.quantity} value={object.quantity}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupSubscriptionGroupPackage);
