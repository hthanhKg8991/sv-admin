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
import FormComponent from 'pages/CustomerCare/SalesOrderEditPage/Package/FilterResumePackage/Popup/FormComponentBuyFilterResume';
import { getDetailSKU } from "api/system";
import { buyFilterResume } from "api/saleOrder";

class PopupBuyFilterResume extends Component {
    constructor(props) {
        super(props);
        const defaultItem = {
            service_code: Constant.Service_Code_Account_Service_Filter_Resume,
            total_buy_point: this.props.item?.total_buy_point || "",
            start_date: this.props.item?.start_date,
            week_quantity: this.props.item?.week_quantity || "",
            sku_code_service: this.props.item?.sku_code_service,
            sales_order_id: this.props.item?.id,
            type_campaign: this.props.item?.type_campaign,
        };
        this.state = {
            item: defaultItem,
            initialForm: {
                service_code: "service_code",
                total_buy_point: "total_buy_point",
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
        const resSKU = await getDetailSKU({ service_code: Constant.Service_Code_Account_Service_Filter_Resume });
        this.setState({ item: { ...item, sku_code_service: resSKU?.sku_code } });
    }

    componentDidMount() {
        this._getPackageRunning();
        this._getSKUCode();
        const { item } = this.state;
        this.setState({
            ...item,
            service_code: Constant.Service_Code_Account_Service_Filter_Resume
        })
    }

    async submitData(dataForm) {
        const { uiAction } = this.props;

        const res = await buyFilterResume({ ...dataForm, service_code: Constant.Service_Code_Account_Service_Filter_Resume });
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            this.props.fallback()
            uiAction.deletePopup();
        }

        this.setState({ loading: false });
    };

    _onSubmit(data) {
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        })
        this.setState({ loading: true }, () => {
            let obj = { ...dataSumbit }

            if (this.props.item?.type_campaign !== Constant.RECRUITER_ASSISTANT_GIFT_TYPE) {
                //Gói thường
                //Đổi từ số cv mua sang số tuần
                const pointConfig = this.props.sys.common.items[Constant.COMMON_DATA_KEY_list_price_promotion_cv] || [];
                const configSort = pointConfig.sort((a, b) => (Number(b.from) - Number(a.from)));
                const point = configSort.find(item => Number(dataSumbit.total_buy_point) >= item.from);

                obj = { ...obj, week_quantity: point ? Number(point?.to) : 4 }
            }
            //Gói tặng thì không đổi từ số cv sang tuần
            this.submitData(obj);
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

        const fieldWarnings = []
        const validationSchema = Yup.object().shape({
            service_code: Yup.string().required(Constant.MSG_REQUIRED),
            total_buy_point: Yup.number().typeError(Constant.MSG_NUMBER_ONLY).positive(Constant.MSG_POSITIVE_ONLY).required(Constant.MSG_REQUIRED).test("checkQuantity", Constant.MSG_MOD_30, (value) => this.props.item?.type_campaign !== Constant.RECRUITER_ASSISTANT_GIFT_TYPE ? (Number(value) % 30 === 0) : true),//Nêu là gói tặng thì không check số cv là bội số của 30
            start_date: Yup.string().required(Constant.MSG_REQUIRED),
            week_quantity: Yup.number().typeError(Constant.MSG_NUMBER_ONLY).positive(Constant.MSG_POSITIVE_ONLY).test("required", Constant.MSG_REQUIRED, (value) => this.props.item?.type_campaign === Constant.RECRUITER_ASSISTANT_GIFT_TYPE ? value : true),
            sku_code_service: Yup.string().required(Constant.MSG_REQUIRED),
            sales_order_id: Yup.number().required(Constant.MSG_REQUIRED),
        });

        return (
            <div className="form-container">
                <FormBase onSubmit={this.onSubmit}
                    initialValues={item ? utils.initFormValue(initialForm, { ...item, service_code: Constant.Service_Code_Account_Service_Filter_Resume }) : utils.initFormKey(initialForm)}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupBuyFilterResume);
