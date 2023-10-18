import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import {
    getDetailSalesOrderItemV2,
    getListFullSku,
    postCreateSalesOrderItemV2,
    postUpdateSalesOrderItemV2,
} from "api/saleOrderV2";
import Input2 from "components/Common/InputValue/Input2";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";

class PopupItemPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: [ 'sku_code', 'quantity' ],
            object_error: {},
            name_focus: "",
            list_sku: [],
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getListSku = this._getListSku.bind(this);

    }

    async _onSave(data, object_required) {
        const {uiAction, idKey, id, sales_order, idKeySalesOrder} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        const params = {...object,sales_order_id: sales_order.id};
        let res;
        if (id > 0 ){
            res = await postUpdateSalesOrderItemV2({...params, id});
        }else {
            res = await postCreateSalesOrderItemV2(params);
        }
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            uiAction.deletePopup();
            publish(".refresh", {}, idKey);
            publish(".refresh", {}, idKeySalesOrder);
            publish(".refresh", {}, Constant.IDKEY_PROMOTION);
        }
        this.setState({loading: false});
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
        if (name === "service_category_code"){
            this.getListSku({service_category_code: value})
        }
    }

    async _getListSku(params = {}) {
        const res = await getListFullSku({...params,status: Constant.SKU_STATUS_ACTIVE});
        if (res) {
            this.setState({list_sku: res});
        }
    }

    async _getDetail() {
        await this.getListSku();
        const res = await getDetailSalesOrderItemV2({
            id: this.props.id
        });
        if (res) {
            this.setState({object: res});
        }
    }

    componentDidMount() {
        if (this.props.id) {
            this.getDetail();
        }else {
            this.getListSku();
        }
    }

    render() {
        let {object, object_error, object_required, name_focus,list_sku} = this.state;
        let {category} = this.props;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className=" row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="service_category_code" label="Loại sản phẩm" data={category} key_title={"name"} key_value={"code"}
                                             value={object.service_category_code} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className=" row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="sku_code" label="Gói dịch vụ" data={list_sku} key_title={"name"} key_value={"code"} required={object_required.includes('sku_code')}
                                             error={object_error.sku_code} value={object.sku_code} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <Input2 type="text" name="quantity" label="Số lượng" isNumber required={object_required.includes('quantity')}
                                            error={object_error.quantity} value={object.quantity} nameFocus={name_focus}
                                            onChange={this.onChange}
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupItemPackage);
