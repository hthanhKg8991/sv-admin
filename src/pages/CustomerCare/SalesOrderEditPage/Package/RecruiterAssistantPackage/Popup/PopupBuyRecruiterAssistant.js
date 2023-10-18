import React, { Component } from "react";
import * as Yup from "yup";
import FormBase from "components/Common/Ui/Form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import { getListPriceRunning } from "api/saleOrder";
import * as Constant from "utils/Constant";
import FormComponent from 'pages/CustomerCare/SalesOrderEditPage/Package/RecruiterAssistantPackage/Popup/FormComponentBuyRecruiterAssistant';
import { getDetailSKU } from "api/system";
import { buyRecruiterAssistant } from "api/saleOrder";

class PopupBuyRecruiterAssistant extends Component {
    constructor(props) {
        super(props);
        const defaultItem = {
            service_code: Constant.Service_Code_Account_Service,
            quantity: this.props.item?.quantity,
            start_date: this.props.item?.start_date,
            week_quantity: 4,
            sku_code_service: this.props.item?.sku_code_service,
            sales_order_id: this.props.item?.id,
            type_campaign: this.props.item?.type_campaign,
        };
        this.state = {
            item: defaultItem,
            initialForm: {
                service_code: "service_code",
                quantity: "quantity",
                start_date: "start_date",
                week_quantity: "week_quantity",
                sku_code_service: "sku_code_service",
                sales_order_id: "sales_order_id",
                type_campaign: "type_campaign"
            },
            items_groups: [],
            package_running: [],
        };

        this.onSubmit = this._onSubmit.bind(this);
    }

    async _getPackageRunning() {
        const res = await getListPriceRunning();
        if (res && Array.isArray(res)) {
            const packages = res.map(p => p?.service_code);
            this.setState({ package_running: packages });
        }
    }
    async _getSKUCode() {
        const { item } = this.state;
        const { branch } = this.props;
        const { channel_code } = branch.currentBranch;
        const resSKU = await getDetailSKU({ service_code: channel_code === Constant.CHANNEL_CODE_TVN ? Constant.Service_Code_Account_Service_TVN : Constant.Service_Code_Account_Service });
        this.setState({ item: { ...item, sku_code_service: resSKU?.sku_code } });
    }

    componentDidMount() {
        this._getPackageRunning();
        this._getSKUCode();
        const { branch } = this.props;
        const { channel_code } = branch.currentBranch;
        const { item } = this.state;

        this.setState({
            ...item,
            service_code: channel_code === Constant.CHANNEL_CODE_TVN ? Constant.Service_Code_Account_Service_TVN : Constant.Service_Code_Account_Service
        })
 
    }

    async submitData(dataForm, setErrors) {
        const { uiAction } = this.props;
        const { branch } = this.props;
        const { channel_code } = branch.currentBranch;
        const res = await buyRecruiterAssistant({ ...dataForm, service_code: channel_code === Constant.CHANNEL_CODE_TVN ? Constant.Service_Code_Account_Service_TVN : Constant.Service_Code_Account_Service });
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            this.props.fallback()
            uiAction.deletePopup();
        }

        this.setState({ loading: false });
    };

    _onSubmit(data, action) {
        const { setErrors } = action;
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({ loading: true }, () => {
            this.submitData(dataSumbit, setErrors);
        });
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
        const { initialForm, item } = this.state;
        const { branch } = this.props;
        const { channel_code } = branch.currentBranch;
        const fieldWarnings = []
        const validationSchema = Yup.object().shape({
            service_code: Yup.string().required(Constant.MSG_REQUIRED),
            quantity: Yup.number().typeError(Constant.MSG_NUMBER_ONLY).positive(Constant.MSG_POSITIVE_ONLY).required(Constant.MSG_REQUIRED),
            start_date: Yup.string().required(Constant.MSG_REQUIRED),
            week_quantity: Yup.number().typeError(Constant.MSG_NUMBER_ONLY).positive(Constant.MSG_POSITIVE_ONLY).required(Constant.MSG_REQUIRED),
            sku_code_service: Yup.string().required(Constant.MSG_REQUIRED),
            sales_order_id: Yup.number().required(Constant.MSG_REQUIRED),
        });
        return (
            <div className="form-container">
                <FormBase onSubmit={this.onSubmit}
                    initialValues={item ? utils.initFormValue(initialForm, { ...item, service_code: channel_code === Constant.CHANNEL_CODE_TVN ? Constant.Service_Code_Account_Service_TVN : Constant.Service_Code_Account_Service}) : utils.initFormKey(initialForm)}
                    validationSchema={validationSchema}
                    fieldWarnings={fieldWarnings}
                    FormComponent={FormComponent}>
                    <div className={"row mt15"}>
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
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupBuyRecruiterAssistant);
