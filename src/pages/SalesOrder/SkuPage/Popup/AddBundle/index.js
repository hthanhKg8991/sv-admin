import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import {
    getDetailSkuBundle,
    postCreateSkuBundle,
    postUpdateSkuBundle
} from "api/saleOrderV2";
import * as Constant from "utils/Constant";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "pages/SalesOrder/SkuPage/Popup/AddBundle/FormComponent";
import * as Yup from "yup";
import _ from "lodash";

class PopupAddBundle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: false,
            initialForm: {
                "code": "code",
                "unit": "unit",
                "name": "name",
                "service_category_code": "service_category_code",
                "start_date": "start_date",
                "sku_sub_list": "sku_sub_list",
            },
        };
        this.getDetail = this._getDetail.bind(this);
        this.onSubmit = this._onSubmit.bind(this);

    }


    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {uiAction, idKey} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await postUpdateSkuBundle(data);
        } else {
            res = await postCreateSkuBundle(data);
        }
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            uiAction.deletePopup();
            publish(".refresh", {}, idKey);
        }
        this.setState({loading: false});
    };


    async _getDetail() {
        const res = await getDetailSkuBundle({
            id: this.state.id
        });
        if (res) {
            this.setState({item: res});
        }
    }

    componentDidMount() {
        if (this.props.id) {
            this.getDetail();
        }
    }

    render() {
        const {id, initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            code: Yup.string().required(Constant.MSG_REQUIRED),
            unit: Yup.string().required(Constant.MSG_REQUIRED),
            name: Yup.string().required(Constant.MSG_REQUIRED),
            service_category_code: Yup.string().required(Constant.MSG_REQUIRED),
            sku_sub_list: Yup.array().of(
                Yup.object().shape({
                    // id: Yup.string().required(Constant.MSG_REQUIRED),
                    sku_code: Yup.string().required(Constant.MSG_REQUIRED),
                    proportion: Yup.number().required(Constant.MSG_REQUIRED),
                })
            )
        });
        const dataForm = item ? utils.initFormValue(initialForm, item) : {
            ...utils.initFormKey(initialForm),
            sku_sub_list: [{id: 0, sku_code: '', proportion: ''}]
        };
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt30"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                        </div>
                    </div>
                </FormBase>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddBundle);
