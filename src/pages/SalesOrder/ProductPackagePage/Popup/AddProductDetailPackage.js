import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import {
    getDetailProductDetailPackage,
    postCreateProductDetailPackage,
    postUpdateProductDetailPackage,
} from "api/saleOrderV2";
import Input2 from "components/Common/InputValue/Input2";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";

class PopupAddProductDetailPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['product_code', 'unit', 'quantity','expired','proportion','region', 'duration'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }

    async _onSave(data, object_required) {
        const {uiAction, idKey, id, product_package_code} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        const params = {...object,product_package_code};
        this.setState({loading: true});
        let res;
        if (id > 0 ){
            res = await postUpdateProductDetailPackage(params);
        }else {
            res = await postCreateProductDetailPackage(params);
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
        const res = await getDetailProductDetailPackage({
            id: this.props.id
        });
        if (res) {
            this.setState({object: res});
        }
    }

    componentDidMount() {
        if (this.props.id){
            this.getDetail();
        }
    }

    render() {
        let {object, object_error, object_required, name_focus} = this.state;
        let {productAll} = this.props;
        const region = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_region);
        const product_unit = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_product_unit);
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="product_code" label="Product" data={productAll || []}
                                             required={object_required.includes('product_code')}
                                             error={object_error.product_code}
                                             value={object.product_code} nameFocus={name_focus}
                                             key_title="name"
                                             key_value="code"
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
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="region" label="Miền" data={region} required={object_required.includes('region')}
                                             error={object_error.region} value={object.region} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <Dropbox name="unit" label="Đơn vị" data={product_unit} required={object_required.includes('unit')}
                                             error={object_error.unit} value={object.unit} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <Input2 type="text" name="proportion" label="Trọng số" isNumber required={object_required.includes('proportion')}
                                            error={object_error.proportion} value={object.proportion} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-xs-6 mb10">
                                    <Input2 type="text" name="expired" label="Ngày hết hạng" isNumber  required={object_required.includes('expired')}
                                            error={object_error.expired} value={object.expired} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <Input2 type="text" name="duration" label="Thời gian sử dụng" isNumber required={object_required.includes('duration')}
                                            error={object_error.duration} value={object.duration} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-xs-6 mb10" />
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddProductDetailPackage);
