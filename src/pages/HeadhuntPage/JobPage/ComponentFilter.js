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
        let channels = [];
        for (const channel in Constant.CHANNEL_LIST) {
            channels.push({
                title: Constant.CHANNEL_LIST[channel],
                value: channel
            });
        }
        let province = this.props.sys.province.items;
        const salary_range_min = Array.from({length: 10}, (_, i) => ({
                value:(i + 1) * 500000,
                title:`${(i + 1) * 5} Triệu`,
            }
        ));
        const experience_range = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_resume_experience_range);
        const position = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_resume_level_requirement);
        const seeker_level = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_seeker_level);
        const seeker_gender = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_gender);
        const work_time = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_resume_working_method);
        const {idKey, query, menuCode, sys} = this.props;

        const fieldAll = sys.jobField.list.map(i=> ({
            ...i,
            name: `${i.channel_code.toUpperCase()} - ${i.name}`
        }));


        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                {/*job_q*/}
                <SearchField type="input" label="ID tin, tiêu đề tin" name="keyword" timeOut={1000}/>
                {/*employer_q*/}
                <SearchField type="input" label="ID NTD, tên NTD, email, sđt" name="employer_q" timeOut={1000}/>
                {/*employer_status*/}
                <SearchField type="dropbox" label="Tỉnh thành" name="province_id" key_value="id" key_title="name" data={province}/>
                {/*job_status*/}
                <SearchField type="dropbox" label="Ngành nghề" name="field_ids[]" key_value="id" key_title="name"
                             data={fieldAll}/>
                <SearchField type="dropbox" label="Web" name="channel_code" data={channels}/>
                <SearchField type="dropbox" label="Mức lương tối thiểu " name="salary_min" data={salary_range_min}/>
                <SearchField type="dropbox" label="Mức lương tối đa" name="salary_max" data={salary_range_min}/>
                <SearchField type="dropbox" label="Số năm kinh nghiệm" name="experience_range" data={experience_range}/>
                <SearchField type="dropbox" label="Cấp bậc" name="level_requirement" data={position}/>
                <SearchField type="dropbox" label="Bằng cấp" name="level" data={seeker_level}/>
                <SearchField type="dropbox" label="Hình thức làm việc" name="working_method" data={work_time}/>
                <SearchField type="dropbox" label="Giới tính" name="gender" data={seeker_gender}/>
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
