import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, hideSmartMessageBox, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish, subscribe} from "utils/event";
import {
    createHeadhuntCustomer,
    getDetailHeadhuntCustomer,
    updateHeadhuntCustomer
} from "api/headhunt";
import {checkSalesOrderApproveByTax} from "api/employer";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: false,
            initialForm: {
                "tax_code": "tax_code",
                "company_name": "company_name",
                "address": "address",
                "company_size": "company_size",
                "branch_name": "branch_name",
                "type_of_business": "type_of_business",
                "fields_activity": "fields_activity",
                "founding_at": "founding_at",
                "product_service": "product_service",
                "website": "website",
                "about_us": "about_us",
                "revenue": "revenue",
                "profit": "profit",
                "industry_id": "industry_id",
                "created_source": "created_source",
            },
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_CUSTOMER
        });
        return true;
    }

    async _onSubmit(data, action) {
        const {setErrors} = action;
        const {actions} = this.props;
        const {item} = this.state;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        let resCheckSO = null;
        if (!item || item.tax_code !== data.tax_code ){
            resCheckSO = await checkSalesOrderApproveByTax({tax_code: data.tax_code});
        }
        if (resCheckSO) {
            actions.SmartMessageBox({
                title: "Khách hàng này có đơn hàng trong 12 tháng bên Transaction, bạn có chắc chắn tiếp tục tạo tài khoản không?",
                content: "",
                buttons: ['No', 'Yes']
            }, (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    this.submitData(dataSubmit, setErrors);
                }
            });
        }else {
            this.submitData(dataSubmit, setErrors);
        }
    }

    async submitData(data, setErrors) {
        this.setState({loading: true});
        const {id} = this.state;
        const {actions, idKey, history} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateHeadhuntCustomer(data);
        } else {
            res = await createHeadhuntCustomer(data);
        }

        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CUSTOMER,
                });
                actions.putToastSuccess("Thao tác thành công!");
                publish(".refresh", {}, idKey)
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        actions.hideSmartMessageBox();
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetailHeadhuntCustomer({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        } else {
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this.asyncData();
        }
    }

    render() {
        const {id, initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            tax_code: Yup.string().required(Constant.MSG_REQUIRED).matches(/^(\w|\d)((\w|\d|_){8}|(\w|\d|_){12})(\w|\d)$/, Constant.MSG_TAX_CODE_INVALID),
            company_name: Yup.string().required(Constant.MSG_REQUIRED),
            address: Yup.string().required(Constant.MSG_REQUIRED),
            company_size: Yup.string().required(Constant.MSG_REQUIRED),
            industry_id: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
        });
        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            {id <= 0 && (
                                <button type="button" className="el-button el-button-default el-button-small"
                                        onClick={() => this.goBack(id)}>
                                    <span>Quay lại</span>
                                </button>
                            )}
                        </div>
                    </div>
                </FormBase>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, SmartMessageBox, hideSmartMessageBox }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
