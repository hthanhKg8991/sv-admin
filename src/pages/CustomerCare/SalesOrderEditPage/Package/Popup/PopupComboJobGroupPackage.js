import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {
    getDetailProductGroupList,
    getComboPost,
    comboPostItemGroupCreate,
    comboPostItemGroupUpdate, getDetailComboPost
} from "api/saleOrder";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import Dropbox from "components/Common/InputValue/Dropbox";
import Input2 from "components/Common/InputValue/Input2";

class PopupComboJobGroupPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {
                combo_id: props.item?.combo_id || props.defaultValue,
                displayed_area: props.item ? props.item.displayed_area : null,
                discount_rate: props.item ? props.item.discount_rate : null,
                promotion_rate: props.item ? props.item.promotion_rate : null,
            },
            object_required: props.item ? ['combo_id'] : ['combo_id', 'quantity'],
            object_error: {},
            name_focus: "",
            items_groups: [],
            loading: true,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getListItemsGroup = this._getListItemsGroup.bind(this);
    }

    async _onSave(data) {
        const {item} = this.props;
        this.setState({object_error: {}, loading: true, name_focus: ""});
        let object = Object.assign({}, data);
        let object_required = this.state.object_required;

        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field, loading: false, object_error: check.fields});
            return;
        }
        object.sales_order_id = this.props.sales_order.id;
        let res;
        if (item) {
            res = await comboPostItemGroupUpdate({...object, id: item.id});
        } else {
            res = await comboPostItemGroupCreate(object);
        }

        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_COMBO_POST);
            publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
            publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
            publish(".refresh", {}, Constant.IDKEY_JOB_PACKAGE);
        } else {
            this.setState({object_error: Object.assign({}, res), loading: false});
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        if (name === "combo_id") {
            const item_selected = this.state.items_groups.find(i => i.value === value);
            if (item_selected?.require_display_area) {
                object.displayed_area = null;
            }
        }
        this.setState({object: object});
    }

    async _getDetail(id) {
        const res = await getDetailProductGroupList({id});
        if (res) {
            this.setState({object: res});
        }

    }

    async _getListItemsGroup() {
        const {item} = this.props;
        let res;
        if (item) {
            res = await getDetailComboPost({id: item.id});
        } else {
            res = await getComboPost({filter_expired: true, status: Constant.STATUS_ACTIVED, per_page: 100});
        }

        if (res) {
            const data = item ? [res] : res.items;
            const items = data.map(v => {
                const dataCombo = item ? v.combo : v;
                return {
                    title: `${dataCombo.id} - ${dataCombo.name}`,
                    value: dataCombo.id,
                    require_display_area: dataCombo.require_display_area,
                }
            });
            this.setState({items_groups: items, loading: false});
        }

    }

    componentDidMount() {
        let {object} = this.props;
        if (object) {
            this.getDetail(object.id);
        }
        this.getListItemsGroup();
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
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        const {object, object_required, object_error, items_groups, name_focus} = this.state;
        const {sys, item} = this.props;
        const is_edit = !!item
        const displayed_area = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_area)?.filter(item => item?.value !== 3);
        const item_selected = items_groups.find(i => i.value === object.combo_id);
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
                                         label="Chọn Combo"
                                         data={items_groups}
                                         required={object_required.includes('combo_id')}
                                         error={object_error.combo_id}
                                         value={object.combo_id}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                         readOnly={is_edit}
                                />
                            </div>
                            {is_edit ? <div/> : (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="quantity" label="Số lượng" isNumber
                                            required={object_required.includes('quantity')}
                                            error={object_error.quantity} value={object.quantity}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            )}
                            {item_selected?.require_display_area && object?.displayed_area !== 3 &&(
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="displayed_area"
                                             label="Miền"
                                             data={displayed_area}
                                             required={object_required.includes('displayed_area')}
                                             error={object_error.displayed_area}
                                             value={object?.displayed_area}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}

                                    />
                                </div>
                            )}
                            {/* <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="discount_rate" label="Chiết Khấu (%)" isNumber
                                            suffix=" %"
                                            error={object_error.discount_rate} value={object.discount_rate}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="promotion_rate" label="Khuyến mãi (%)" isNumber
                                            suffix=" %"
                                            error={object_error.promotion_rate} value={object.promotion_rate}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupComboJobGroupPackage);
