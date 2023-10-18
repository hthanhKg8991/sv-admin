import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import moment from "moment";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: []
        };
    }

    _getCustomerCare(){
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {};
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if(division_code !== Constant.DIVISION_TYPE_customer_care_member) {
            args['division_code_list[1]'] = Constant.DIVISION_TYPE_customer_care_leader;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_TEAM_MEMBER_LIST, args);
    }

    componentDidMount(){
        this._getCustomerCare();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }

    render () {
        let {staff_list,account_service_staff_list} = this.state;
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        //*bỏ trạng thái đã xoá*
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);

        let admin_job_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_admin_job_status);
        let job_post_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_job_post_status);
		  const view_per_post_score = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_view_per_post_score);
        //*bỏ trạng thái đã xoá*
        admin_job_status = admin_job_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);

        const employer_email_verified_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_email_verified_status);
        const is_search_allowed = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_is_search_allowed);
		  const commited_cv_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_commited_cv_status);

        const {idKey, query, menuCode, is_archived} = this.props;

        const now = moment();
        const ranges = {
            'Hết hạn trong 3 ngày': [now, moment().add(3-1, 'days')],
            'Hết hạn trong 7 ngày': [now, moment().add(7-1, 'days')],
            'Hết hạn trong 15 ngày': [now, moment().add(15-1, 'days')],
        };
        const old_channel_code = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_old_channel_code_employer);

        if(is_archived){
            return (
              <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                  {/*job_q*/}
                  <SearchField type="input" label="ID tin, tiêu đề tin" name="job_q" timeOut={1000}/>
                  {/*employer_q*/}
                  <SearchField type="input" label="ID NTD, tên NTD, email, sđt" name="employer_q" timeOut={1000}/>
                  <SearchField type="currency" label="Số lượng CV ứng tuyển từ" name="total_resume_applied[from]" timeOut={1000} />
                  <SearchField type="currency" label="Số lượng CV ứng tuyển đến" name="total_resume_applied[to]" timeOut={1000} />
						{/*Commited_cv_status */}
						<SearchField type="dropbox" label="Số CV cam kết" name="commited_cv" data={commited_cv_status}/>
                  {/*Old_channel_code */}
                  <SearchField type="dropbox" label="Nguồn sáp nhập" name="old_channel_code" data={old_channel_code}/>
                  {/*employer_status*/}
                  <SearchField type="dropbox" label="Trạng thái NTD" name="employer_status" data={employer_status}/>
                  {/*email_verified_status*/}
                  <SearchField type="dropbox" label="Xác thực email" name="email_verified_status" data={employer_email_verified_status}/>
                  {/*created_at*/}
                  <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
                  {/*updated_at*/}
                  <SearchField type="datetimerangepicker" label="Ngày cập nhật" name="updated_at"/>
                  {/*resume_apply_expired*/}
                  <SearchField type="datetimerangepicker" label="Hạn nộp hồ sơ" name="resume_apply_expired"
                               ranges={ranges}/>
                  {/*assigned_staff_id*/}
                  <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
              </FilterLeft>
            )
        }


        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                {/*job_q*/}
                <SearchField type="input" label="ID tin, tiêu đề tin" name="job_q" timeOut={1000}/>
                {/*employer_q*/}
                <SearchField type="input" label="ID NTD, tên NTD, email, sđt" name="employer_q" timeOut={1000}/>
                <SearchField type="currency" label="Số lượng CV ứng tuyển từ" name="total_resume_applied[from]" timeOut={1000} />
                <SearchField type="currency" label="Số lượng CV ứng tuyển đến" name="total_resume_applied[to]" timeOut={1000} />
					 {/*Commited_cv_status */}
					 <SearchField type="dropbox" label="Số CV cam kết" name="commited_cv" data={commited_cv_status}/>
                {/*Old_channel_code */}
                <SearchField type="dropbox" label="Nguồn sáp nhập" name="old_channel_code" data={old_channel_code}/>
                {/*employer_status*/}
                <SearchField type="dropbox" label="Trạng thái NTD" name="employer_status" data={employer_status}/>
                {/*job_status*/}
                <SearchField type="dropbox" label="Trạng thái tin" name="job_status" data={admin_job_status}/>
                {/*is_search_allowed*/}
                <SearchField type="dropbox" label="Trạng thái hiển thị" name="is_search_allowed" data={is_search_allowed}/>
                {/*email_verified_status*/}
                <SearchField type="dropbox" label="Xác thực email" name="email_verified_status" data={employer_email_verified_status}/>
                {/*created_at*/}
                <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
                {/*updated_at*/}
                <SearchField type="datetimerangepicker" label="Ngày cập nhật" name="updated_at"/>
                {/*resume_apply_expired*/}
                <SearchField type="datetimerangepicker" label="Hạn nộp hồ sơ" name="resume_apply_expired"
                             ranges={ranges}/>
                {/*assigned_staff_id*/}
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
                <SearchField type="dropboxmulti" label="Loại cảnh báo" name="job_post_status"  data={job_post_status}/>
					 <SearchField type="dropbox" label="Job post performance" name="view_per_post_score_check"  data={view_per_post_score}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
