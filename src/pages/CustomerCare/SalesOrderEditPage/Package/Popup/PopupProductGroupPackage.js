import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {addProductGroup, getDetailProductGroupList, getListItemsGroup, updateProductGroup} from "api/saleOrder";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import Dropbox from "components/Common/InputValue/Dropbox";

class PopupProductGroupPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['items_group_id'],
            object_error: {},
            name_focus: "",
            items_groups: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getListItemsGroup = this._getListItemsGroup.bind(this);
    }

    async _onSave(data) {
        this.setState({object_error: {},loading: true, name_focus: ""});

        let object = Object.assign({}, data);
        let object_required = this.state.object_required;

        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field,loading: false,object_error: check.fields});
            return;
        }
        object.sales_order_id = this.props.sales_order.id;
        const fnApi = !object.id ? addProductGroup : updateProductGroup;
        const res = await fnApi(object);
        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_PRODUCT_GROUP_PACKAGE);
            publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
        } else {
            this.setState({object_error: Object.assign({}, res), loading: false});
        }
    }

    _onChange(value, name) {
        const {items_groups} = this.state;
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        const select_item = items_groups.find(item => item.value === value);
        object.discount_rate = select_item?.info?.discount_rate;
        object.promotion_rate = select_item?.info?.promotion_rate;
        this.setState({object: object});
    }

    async _getDetail(id) {
        const res = await getDetailProductGroupList({id});
        if (res) {
            this.setState({object: res});
        }
    }

    async _getListItemsGroup() {
        const {sales_order} = this.props;
        const res = await getListItemsGroup({status: Constant.STATUS_ACTIVED, package: sales_order?.package, per_page: 100});
        if (res && Array.isArray(res?.items)) {
            const items = res.items.map(item => {
                return {
                    title: item.name,
                    value: item.id,
                    info: item
                }
            });
            this.setState({items_groups: items});
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
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="items_group_id"
                                         label="Chọn Group Item"
                                         data={items_groups}
                                         required={object_required.includes('items_group_id')}
                                         error={object_error.items_group_id}
                                         value={object.items_group_id}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}

                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="discount_rate" label="Chiết Khấu (%)" isNumber suffix=" %"
                                            error={object_error.discount_rate} value={object.discount_rate}
                                            readOnly
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="promotion_rate" label="Khuyến mãi (%)" isNumber
                                            suffix=" %"
                                            error={object_error.promotion_rate} value={object.promotion_rate}
                                            readOnly
                                    />
                                </div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupProductGroupPackage);
