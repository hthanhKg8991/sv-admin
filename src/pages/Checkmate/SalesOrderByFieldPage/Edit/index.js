import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {publish, subscribe} from "utils/event";
import {
    putToastError,
    putToastSuccess,
    SmartMessageBox,
    hideSmartMessageBox,
    showLoading,
    hideLoading,
    createPopup,
    deletePopup
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    approveSalesOrderByField,
    cancelSalesOrderByField,
    copySalesOrderByField,
    createSalesOrderByField,
    getDetailSalesOrderByField,
    getListAccountantCustomer,
    printFieldPrintTemplate,
    submitSalesOrderByField,
    updateSalesOrderByField
} from "api/saleOrder";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupCreatedSalesOrderForm from "pages/Checkmate/SalesOrderByFieldPage/Package/Popup/PopupCreateSalesOrder";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            customer: {},
            initialForm: {
                "employer_id": "employer_id",
                "name_representative": "name_representative",
                "position_representative": "position_representative",
                "is_signature": "is_signature",
                "payment_term_method": "payment_term_method",
                "accountant_customer_id": "accountant_customer_id",
                "opportunity_id": "opportunity_id",
                "revenue_by_staff_code": "revenue_by_staff_code",
                "status": "status",
                "type_campaign": "type_campaign",
                "promotion_programs_id": "promotion_programs_id",
                "original_sales_order_id": "original_sales_order_id",
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.onComplete = this._onComplete.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onPrint = this._onPrint.bind(this);
        this.onCancel = this._onCancel.bind(this);
        this.onCreateSaleOrder = this._onCreateSaleOrder.bind(this);
        this.btnCopy = this._btnCopy.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SALES_ORDER_BY_FIELD
        });
        return true;
    }

    async _onPrint(code) {
        const {actions} = this.props;
        const {id} = this.state;
        actions.showLoading();
        const res = await printFieldPrintTemplate({sales_order_id: id, code});
        if (res) {
            window.open(res?.url, "_blank");
        }
        actions.hideLoading();
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {actions, history} = this.props;
        if (parseInt(data.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT && !data?.promotion_programs_id) {
            this.setState({loading: false});
            actions.putToastError("Vui lòng chọn chương trình tặng!");
            return false;
        }
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateSalesOrderByField(data);
        } else {
            res = await createSalesOrderByField(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                if (data.id) {
                    actions.putToastSuccess("Thao tác thành công!");
                    history.push({
                        pathname: Constant.BASE_URL_SALES_ORDER_BY_FIELD,
                        search: '?action=edit&id=' + data.id
                    });
                    this.setState({id: data.id}, () => {
                        this.asyncData();
                        publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_BY_FIELD_EDIT);
                    });
                }
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetailSalesOrderByField({id});
            if (res) {
                this.setState({item: res, loading: false});
                if (res?.accountant_customer_id) {
                    const customerItems = await getListAccountantCustomer({id: res?.accountant_customer_id});
                    if (customerItems && Array.isArray(customerItems?.items)) {
                        const [customer] = customerItems.items;
                        this.setState({customer: customer});
                    }
                }
            }
        } else {
            this.setState({loading: false});
        }
    }

    async _onComplete() {
        const {actions} = this.props;
        this.setState({loading: true});
        const {id} = this.state;
        const res = await submitSalesOrderByField({id: id});
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_BY_FIELD_EDIT);
            this.asyncData();
        }
        this.setState({loading: false});
    }

    _onApprove() {
        const {id} = this.state;
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn duyệt PĐK',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                this.setState({loading: true});
                const res = await approveSalesOrderByField({id: id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    this.asyncData();
                    publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_BY_FIELD_EDIT);
                }
                this.setState({loading: false});
            }
        });
    }

    _onCancel() {
        const {actions, id} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn hủy PĐK',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                this.setState({loading: true});
                const res = await cancelSalesOrderByField({id: id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    this.asyncData();
                    publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_BY_FIELD_EDIT);
                }
                this.setState({loading: false});
            }
        });
    }

    _onCreateSaleOrder() {
        const {actions} = this.props;
        const {item} = this.state;
        actions.createPopup(PopupCreatedSalesOrderForm, "Chương trình tặng", {
                sales_order: item,
            },
        );
    }

    async _btnCopy() {
        const { actions, id } = this.props;
        const res = await copySalesOrderByField({id: id});
        if(res) {
            actions.putToastSuccess('Thao tác thành công');
            const url = `${Constant.BASE_URL_SALES_ORDER_BY_FIELD}?action=edit&id=${res.id}`;
            window.open(url);
        }
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const {user} = this.props;
        const {initialForm, item, loading, customer, id} = this.state;
        const validationSchema = Yup.object().shape({
            employer_id: Yup.number().required(Constant.MSG_REQUIRED),
            type_campaign: Yup.number().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.customer_name = customer?.name;
        dataForm.customer_address = customer?.address;

        // Nếu là CSKH tự đông fill revenue by staff
        const isCustomer = [Constant.DIVISION_TYPE_customer_care_member, Constant.DIVISION_TYPE_customer_care_leader].includes(user?.division_code);
        if (isCustomer && parseInt(id) === 0) {
            dataForm.revenue_by_staff_code = user?.code;
        }

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-primary el-button-small">
                                <span>Lưu</span>
                            </button>
                            {[Constant.SALE_ORDER_INACTIVE].includes(parseInt(item?.status)) && (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_approve}>
                                    <button type="button" className="el-button el-button-bricky el-button-small"
                                            onClick={this.onApprove}
                                    >
                                        <span>Duyệt</span>
                                    </button>
                                </CanRender>
                            )}
                            {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(item?.status)) && (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_submit}>
                                    <button type="button" className="el-button el-button-success el-button-small"
                                            onClick={this.onComplete}
                                    >
                                        <span>Hoàn thành</span>
                                    </button>
                                </CanRender>
                            )}
                            {[
                                Constant.SALE_ORDER_INACTIVE,
                                Constant.SALE_ORDER_ACTIVED,
                                Constant.SALE_ORDER_EXPIRED,
                                Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                Constant.SALE_ORDER_CANCEL,
                            ].includes(parseInt(item?.status)) && (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_print}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={() => this.onPrint('hop_dong_check_mate')}>
                                        <span>In hợp đồng (Không bảo hành)</span>
                                    </button>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={() => this.onPrint('hop_dong_check_mate_bao_hanh')}>
                                        <span>In hợp đồng (Có bảo hành)</span>
                                    </button>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={() => this.onPrint('phu_luc_hop_dong_checkmate')}>
                                        <span>Phụ lục hợp đồng</span>
                                    </button>
                                </CanRender>
                            )}
                            {[
                                Constant.SALE_ORDER_ACTIVED,
                                Constant.SALE_ORDER_DISABLED,
                                Constant.SALE_ORDER_INACTIVE,
                                Constant.SALE_ORDER_NOT_COMPLETE,
                            ].includes(parseInt(item?.status)) && (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_cancel}>
                                    <button type="button" className="el-button el-button-bricky el-button-small"
                                            onClick={this.onCancel}
                                    >
                                        <span>Hủy phiếu</span>
                                    </button>
                                </CanRender>
                            )}
                            {parseInt(item?.status) === Constant.SALE_ORDER_ACTIVED && parseInt(item?.type_campaign) === Constant.CAMPAIGN_TYPE_DEFAULT && (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_create}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.onCreateSaleOrder}
                                    >
                                        <span>Tạo phiếu tặng</span>
                                    </button>
                                </CanRender>
                            )}
                            {parseInt(item?.status) !== Constant.SALE_ORDER_DELETED && (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_copy}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.btnCopy}>
                                        <span>Sao chép</span>
                                    </button>
                                </CanRender>
                            )}
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Quay lại</span>
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
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            showLoading,
            hideLoading,
            createPopup,
            deletePopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
