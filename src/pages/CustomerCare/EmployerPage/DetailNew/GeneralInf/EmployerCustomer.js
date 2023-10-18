import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getDetailCustomer, assignCustomer} from "api/employer";
import * as uiAction from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";
import EmployerTeam from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerTeam"

class EmployerCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer_object: null
        };
        this.onChangeCustomer = this._onChangeCustomer.bind(this);
        this.onAssignCustomer = this._onAssignCustomer.bind(this);
    }

    async _getCustomer() {
        const {employerMerge} = this.props;
        const res = await getDetailCustomer({id: employerMerge?.customer_id});
        if (res) {
            this.setState({
                customer_object: res
            })
        }
    }

    _onChangeCustomer() {
        const {history, employerMerge} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER,
            search: '?action=change_customer&id=' + employerMerge?.id
        });

        return true;
    }

    async _onAssignCustomer() {
        const {employerMerge, uiAction, idKey} = this.props;
        uiAction.showLoading();

        const res = await assignCustomer({id: employerMerge?.id});

        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKey)
        }

        uiAction.hideLoading();
    }

    componentDidMount() {
        const {employerMerge} = this.props;
        if(employerMerge?.customer_id) {
            this._getCustomer();
        }
    }

    render() {
        const {employerMerge} = this.props;
        const {customer_object} = this.state;
        
        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Tên company</div>
                    <div className="col-sm-7 col-xs-7">
                        <a href={`${Constant.BASE_URL_CUSTOMER}?action=detail&id=${customer_object?.id}`} target="_blank" rel="noopener noreferrer"><b>{customer_object ? `${customer_object?.name} - ${customer_object?.code}` : ''}</b></a>
                    </div>
                </div>
                {/* {customer_object && <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Team</div>
                    <div className="col-sm-7 col-xs-7">
                       <b>
                            <EmployerTeam id={customer_object?.team_id} />
                       </b>
                    </div>
                </div>} */}
                
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Loại company</div>
                    <div className="col-sm-7 col-xs-7">
                       <b>
                           <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_account_type}
                                       value={employerMerge?.account_type} notStyle />
                       </b>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Trạng thái company</div>
                    <div className="col-sm-7 col-xs-7">
                        {
                            employerMerge?.customer_id && (
                                <b>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_status}
                                                value={customer_object?.status} notStyle />
                                </b>
                            )
                        }

                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Trạng thái gán company</div>
                    <div className="col-sm-7 col-xs-7">
                        {
                            employerMerge?.customer_id && (
                                <b>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_status}
                                                value={employerMerge?.customer_status} notStyle />
                                </b>
                            )
                        }

                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0" />
                    <div className="col-sm-7 col-xs-7 text-bold white-space-nowrap d-flex">
                        <CanRender actionCode={ROLES.customer_care_employer_edit_customer}>
                            <span className="text-underline mr15">
                                <span onClick={this.onChangeCustomer} className={"cursor-pointed text-link"}>
                                    Thay đổi company
                                </span>
                            </span>
                        </CanRender>
                        {employerMerge?.customer_status && employerMerge?.customer_status !== Constant.CUSTOMER_STATUS_ACTIVE &&
                         employerMerge?.customer_id &&
                            <CanRender actionCode={ROLES.customer_care_employer_assign_customer}>
                                <span className="text-underline">
                                    <span onClick={this.onAssignCustomer} className={"cursor-pointed text-link"}>
                                        Duyệt gán company
                                    </span>
                                </span>
                            </CanRender>
                        }
                    </div>
                </div>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    }
}

export default connect(null, mapDispatchToProps)(EmployerCustomer);
