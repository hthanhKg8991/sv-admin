import React from "react";
import {connect} from "react-redux";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MySelect from "components/Common/Ui/Form/MySelect";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import {getListFullCategory, getListFullSku} from "api/saleOrderV2";
import MySkuBundleField from "components/Common/Ui/Form/MySkuBundleField";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: [],
            sku: [],
        };

    }


    async _asyncData() {
        const [resCategory, resSkuFull] = await Promise.all([
            getListFullCategory({status: Constant.CATEGORY_STATUS_ACTIVE}),
            getListFullSku({status: Constant.SKU_STATUS_ACTIVE, except_unit: Constant.TYPE_BUNDLE_UNIT})
        ]);
        if (resCategory) {
            this.setState({category: resCategory.map(_=>({label:_.name,value: _.code})) || []});
        }
        if (resSkuFull) {
            this.setState({sku: resSkuFull.map(_=>({label:_.name,value: _.code})) || []});
        }
    }

    componentDidMount() {
        this._asyncData();
    }
    render() {
        const {category, sku} = this.state;
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6 font-bold text-blue mb-10">
                        Thông tin chung
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"SKU Code"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"unit"} label={"Đơn vị"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_bundle_quantity}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"SKU Name"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelect name={"service_category_code"} label={"Loại sản phẩm"}
                                  options={category}
                                  showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 font-bold text-blue">
                        Thêm SKU
                    </div>
                </div>
                <MySkuBundleField  name={'sku_sub_list'} values={values} sku={sku}  />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);
