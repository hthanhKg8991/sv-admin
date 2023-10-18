import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import {
    getDetailSku,
    postCreateSku,
    postUpdateSku
} from "api/saleOrderV2";
import Input2 from "components/Common/InputValue/Input2";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import Ckeditor from "components/Common/InputValue/Ckeditor";

class PopupAddSku extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['code', 'name', 'product_package_code', 'service_category_code', 'unit', 'benifit'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);

    }

    async _onSave(data, object_required) {
        const {uiAction, idKey, id} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        const params = {...object};
        let res;
        if (id > 0) {
            res = await postUpdateSku(params);
        } else {
            res = await postCreateSku(params);
        }
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            uiAction.deletePopup();
            publish(".refresh", {}, idKey);
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
    }

    async _getDetail() {
        const res = await getDetailSku({
            id: this.props.id
        });
        if (res) {
            this.setState({object: res});
        }
    }

    componentDidMount() {
        if (this.props.id) {
            this.getDetail();
        }
    }

    render() {
        let {object, object_error, object_required, name_focus} = this.state;
        let {category, products, id} = this.props;
        const sku_quantity = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sku_quantity);
        const branch_type = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sku_branch);
        const page_type = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_service_page_type);
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
                                    <Input2 type="text" name="code" label="SKU Code"
                                            required={object_required.includes('code')}
                                            error={object_error.code} value={object.code} nameFocus={name_focus}
                                            onChange={this.onChange}
                                            readOnly={id > 0}
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="unit" label="Đơn vị" data={sku_quantity}
                                             required={object_required.includes('unit')}
                                             error={object_error.unit} value={object.unit} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className=" row">
                                <div className="col-xs-6 mb10">
                                    <Input2 type="text" name="name" label="SKU Name"
                                            required={object_required.includes('name')}
                                            error={object_error.name} value={object.name} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="product_package_code" label="Package Code" data={products}
                                             key_title={"name"} key_value={"code"}
                                             required={object_required.includes('product_package_code')}
                                             error={object_error.product_package_code}
                                             value={object.product_package_code} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className=" row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="service_category_code" label="Loại sản phẩm" data={category}
                                             key_title={"name"} key_value={"code"}
                                             required={object_required.includes('service_category_code')}
                                             error={object_error.service_category_code}
                                             value={object.service_category_code} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-xs-6 mb10"/>
                            </div>
                            <div className=" row">
                                <div className="col-xs-12 mb10">
                                    {!(id && !object.benifit) && (
                                        <Ckeditor name="benifit"
                                                  label="Quyền lợi"
                                                  required={object_required.includes('benifit')}
                                                  error={object_error.benifit}
                                                  nameFocus={name_focus}
                                                  toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                                  value={object.benifit}
                                                  onChange={this.onChange}
                                                  height={100}
                                        />
                                    )}
                                </div>
                                <div className="col-xs-6 mb10"/>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 font-bold">
                                    Thông tin phân loại
                                </div>
                            </div>
                            <div className=" row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="branch_type" label="Miền" data={branch_type}
                                             required={object_required.includes('branch_type')}
                                             error={object_error.branch_type}
                                             value={object.branch_type} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="page_type" label="Trang hiển thị" data={page_type}
                                             required={object_required.includes('page_type')}
                                             error={object_error.page_type}
                                             value={object.page_type} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className=" row">
                                <div className="col-xs-6 mb10">
                                    <Input2 type="text" name="expired_week" label="Thời lượng hoạt động(Tuần)"
                                            isNumber
                                            required={object_required.includes('expired_week')}
                                            error={object_error.expired_week} value={object.expired_week} nameFocus={name_focus}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddSku);
