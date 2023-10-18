import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import moment from "moment";
import {bindActionCreators} from "redux";
import _ from "lodash";
import * as Constant from "utils/Constant";
import Default from "components/Layout/Page/Default";
import queryString from "query-string";
import * as utils from "utils/utils";
import * as Yup from "yup";
import FormComponent from "pages/CustomerCare/EmployerPage/Customer/FormComponent";
import FormBase from "components/Common/Ui/Form";
import {changeCustomer, getDetail, getDetailCustomer} from "api/employer";
import * as uiAction from "actions/uiAction";
import {listEpmployerCustomerAssignmentHistory} from 'api/employer'
import Gird from "components/Common/Ui/Table/Gird";
import {getListCustomer} from "api/employer";

const idKey = "EmployerCustomerChange";
const idKeyHistoryList = "EmployerCustomerChange";

class ChangeCustomerContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            employer: null,
            initialForm: {
                customer_id: "customer_id",
                account_type: "account_type"
            },
            columns: [
                {
                    title: "Company bị chuyển",
                    width: 120,
                    cell: row => `-> ${row?.from_customer_id} - ${row?.from_customer_name}`
                },
                {
                    title: "Company chuyển đến",
                    width: 160,
                    cell: row => `-> ${row?.to_customer_id} - ${row?.to_customer_name}`
                },
                {
                    title: "Ngày chuyển",
                    width: 120,
                    cell: row => moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")
                },
                {
                    title: "Người duyệt",
                    width: 120,
                    accessor: "created_by"
                },
                {
                    title: "Ghi chú",
                    width: 120,
                    accessor: "note"
                },
            ]
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _onSubmit(data) {
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSumbit);
        });
    }

    async submitData(data) {
        const {uiAction} = this.props;
        const {employer, id} = this.state;
        const res = await changeCustomer({...data, id: employer?.id || id});
        if (res) {
            uiAction.putToastSuccess("Cập nhật thành công!");
            publish(".refresh", {}, "EmployerDetail");
            this._goBack(employer?.id || id);
        }
        this.setState({loading: false});
    };

    async _getEmployer() {
        const {id} = this.state;
        if(id){
            const res = await getDetail(id);
            if(res && res?.customer_id) {
                const resDetailCompany = await getDetailCustomer({id:res?.customer_id})
                this.setState({employer: {
                    ...res,
                    account_type: resDetailCompany 
                        ? resDetailCompany?.type_code === Constant.CUSTOMER_TYPE_CODE_MST
                            ? Constant.EMPLOYER_ACCOUNT_TYPE_COMPANY
                            : Constant.EMPLOYER_ACCOUNT_TYPE_PERSONAL
                        : null
                }})
            }
        }
    }

    _goBack(id) {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?action=detail&id=' + id
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?' + queryString.stringify({
                    ...search,
                    action: 'detail',
                    id: id
                })
            });

            return true;
        }
    }

    componentDidMount() {
        this._getEmployer();
    }

    render() {
        const {id, initialForm, employer, columns} = this.state;
        const validationSchema = Yup.object().shape({
            customer_id: Yup.number().required(Constant.MSG_REQUIRED),
            //  PT-744
            account_type: Yup.number().nullable(),
        });
        const account_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_account_type);
        console.log("account_type",account_type)

        const initialValues = employer ? utils.initFormValue(initialForm, employer) : utils.initFormKey(initialForm);

        return (
            <Default
                title={"Thay đổi company"}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <FormBase onSubmit={this.onSubmit}
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            fieldWarnings={[]}
                            FormComponent={FormComponent}>
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
                    <div className="mt-15">
                        <Gird idKey={idKeyHistoryList}
                            fetchApi={listEpmployerCustomerAssignmentHistory}
                            query={{id}}
                            columns={columns}
                            defaultQuery={{id}}
                            history={history}
                            isReplaceRoute={false}
                            isRedirectDetail={false}
                            isPushRoute={false}
                            isMustHaveID={true}
                        />
                    </div>
            </Default>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ChangeCustomerContainer);
