import React, { Component } from "react";
import * as Yup from "yup";
import FormBase from "components/Common/Ui/Form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import FormComponent from 'pages/CustomerCare/SalesOrderEditPage/Package/FilterResumePackage/Popup/FormComponentRegisFilterResume';
import { regisFilterResumer, getSalesOrderItem } from "api/saleOrder";
import moment from 'moment';

class PopupRegisRecruiterAssistant extends Component {
    constructor(props) {
        super(props);
        const start_date_cal = moment(moment().format("YYYY-MM-DD")).unix();

        const defaultItem = {
            sales_order_id: this.props.item?.sales_order_id,
            sales_order_items_id: this.props.item?.sales_order_items_id,
            start_date: start_date_cal,
            end_date: moment.unix(start_date_cal).add(parseInt(this.props.data?.total_day_quantity) - 1, 'days').unix(),
            sales_order_items_sub_id: this.props.item?.sales_order_items_sub_id,
            total_buy_point: this.props.data?.quantity_buy,
            service_code: Constant.Service_Code_Account_Service_Filter_Resume,
            sku_code_service: this.props.data?.sku_code_service,
        };
        this.state = {
            item: defaultItem,
            initialForm: {
                sales_order_id: "sales_order_id",
                sales_order_items_id: "sales_order_items_id",
                start_date: "start_date",
                end_date: "end_date",
                sales_order_items_sub_id: "sales_order_items_sub_id",
                total_buy_point: "total_buy_point",
                service_code: "service_code",
                sku_code_service: "sku_code_service",
            },
            items_groups: [],
            package_running: [],
            listSalesOrderItem: [],
            dataSalesOrder: ""
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.getListSalesOrderItem = this._getListSalesOrderItem.bind(this);
    }

    async submitData(dataForm) {
        const { uiAction, idKey } = this.props;
        const { dataSalesOrder } = this.state;
        // xác nhận ràng buộc TG đăng ký
        let confirm = true;
        if (Number(dataSalesOrder?.sales_order_expired_at) > 0 &&
            Number(dataSalesOrder?.sales_order_expired_at) <= Number(dataForm?.end_date)) {
            confirm = window.confirm(Constant.MSG_NOTIFY_SALE_ORDER);
        }
        if (!confirm) {
            uiAction.deletePopup();
            uiAction.hideLoading();
            return;
        }

        let res = await regisFilterResumer({ ...dataForm });

        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            uiAction.deletePopup();
            uiAction.refreshList(idKey);
            this.props.fallback()
        }

        this.setState({ loading: false });
    };

    _onSubmit(data) {
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({ loading: true }, () => {
            this.submitData(dataSumbit);
        });
    }

    async _getListSalesOrderItem() {
        const { data } = this.props;

        const params = {
            id: data.id,
            sales_order_id: data.sales_order_id
        }
        const res = await getSalesOrderItem(params);
        if (res) {
            this.setState({
                listSalesOrderItem: res?.sales_order_items_subs || [],
                dataSalesOrder: res
            })
        }
    }
    componentDidMount() {
        this.getListSalesOrderItem();
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
        const { initialForm, item, listSalesOrderItem } = this.state;
        const fieldWarnings = []
        const validationSchema = Yup.object().shape({
            sales_order_items_id: Yup.string().required(Constant.MSG_REQUIRED),
            start_date: Yup.string().required(Constant.MSG_REQUIRED),
            end_date: Yup.string().required(Constant.MSG_REQUIRED),
            sales_order_items_sub_id: Yup.string().required(Constant.MSG_REQUIRED),
            sales_order_id: Yup.number().required(Constant.MSG_REQUIRED),
            total_buy_point: Yup.number().required(Constant.MSG_REQUIRED),
            service_code: Yup.string().required(Constant.MSG_REQUIRED),
        });
        return (
            <div className="form-container">
                <FormBase onSubmit={this.onSubmit}
                    initialValues={item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm)}
                    validationSchema={validationSchema}
                    fieldWarnings={fieldWarnings}
                    FormComponent={(arg) => <FormComponent {...arg} data={this.props.data} sales_order={this.props.sales_order} listSalesOrderItem={listSalesOrderItem} />}>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupRegisRecruiterAssistant);
