import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish, subscribe} from "utils/event";
import {
    assignHeadhuntCustomerStaff,
    listFullHeadhuntCustomerStaff,
} from "api/headhunt";
import FormComponentStaff from "pages/HeadhuntPage/CustomerPage/Edit/FormComponentStaff";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: false,
            initialForm: {
                [Constant.DIVISION_TYPE_customer_headhunt_lead]: Constant.DIVISION_TYPE_customer_headhunt_lead,
                [Constant.DIVISION_TYPE_customer_headhunt_sale]: Constant.DIVISION_TYPE_customer_headhunt_sale,
                [Constant.DIVISION_TYPE_customer_headhunt_recruiter]: Constant.DIVISION_TYPE_customer_headhunt_recruiter,
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

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data) {
        const {id} = this.state;
        const {actions, idKey} = this.props;
        let res;
        if (id > 0) {
            data.customer_id = id;
            res = await assignHeadhuntCustomerStaff(data);
        }
        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.state;
        if (id > 0) {
            const res = await listFullHeadhuntCustomerStaff({customer_id:id});
            if (res) {
                let data = {};
                res.forEach(v => {
                    if (data[v.division_code]){
                        data[v.division_code].push(v.staff_login_name);
                    }else {
                        data[v.division_code] = [v.staff_login_name];
                    }
                })
                this.setState({item: data, loading: false});
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
            [Constant.DIVISION_TYPE_customer_headhunt_lead]: Yup.array(),
            [Constant.DIVISION_TYPE_customer_headhunt_sale]: Yup.array(),
            [Constant.DIVISION_TYPE_customer_headhunt_recruiter]: Yup.array(),
        });
        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponentStaff}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack(id)}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>
                </FormBase>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
