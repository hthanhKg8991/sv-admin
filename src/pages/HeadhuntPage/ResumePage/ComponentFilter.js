import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as uiAction from "actions/uiAction";
import FilterLeft from 'components/Common/Ui/Table/FilterLeft';
import * as apiAction from 'actions/apiAction';


class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey, sys} = this.props;
        let channels = [];
        for (const channel in Constant.CHANNEL_LIST) {
            channels.push({
                title: Constant.CHANNEL_LIST[channel],
                value: channel
            });
        }
        let resume_status = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_resume_status);
        resume_status = resume_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const seeker_status = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_seeker_status);
        const resume_type = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_resume_type);
        const resume_is_search_allowed = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_is_search_allowed);
        const salary_range = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_resume_salary_range);
        const experience_range = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_resume_experience_range);
        const position = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_resume_level_requirement);
        const seeker_level = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_seeker_level);
        const seeker_gender = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_gender);
        const work_time = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_resume_working_method);

        const province = sys.province.items;
        const fieldAll = sys.jobField.list.map(i=> ({
            ...i,
            name: `${i.channel_code.toUpperCase()} - ${i.name}`
        }));
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={50}>
                <SearchField type="input" label="Tiêu đề, Mã hồ sơ" name="q" timeOut={1000}/>
                <SearchField type="input" label="ID NTV, tên NTV, email" name="seeker_q" timeOut={1000}/>
                <SearchField type="dropbox" label="Web" name="channel_code" data={channels}/>
                <SearchField type="dropboxmulti" label="Tỉnh thành" name="province_ids" key_value="id" key_title="name"
                             data={province}/>
                <SearchField type="dropbox" label="Ngành nghề" name="field_ids[]" key_value="id" key_title="name"
                             data={fieldAll}/>
                <SearchField type="dropbox" label="Mức lương" name="salary_range" data={salary_range}/>
                <SearchField type="dropbox" label="Số năm kinh nghiệm" name="experience" data={experience_range}/>
                <SearchField type="dropbox" label="Cấp bậc" name="position" data={position}/>
                <SearchField type="dropbox" label="Bằng cấp" name="level" data={seeker_level}/>
                <SearchField type="dropbox" label="Hình thức làm việc" name="work_time" data={work_time}/>
                <SearchField type="dropbox" label="Giới tính" name="seeker_gender" data={seeker_gender}/>
                <SearchField type="dropbox" label="Trạng thái hồ sơ" name="status"
                             data={resume_status}/>
                <SearchField type="dropbox" label="Trạng thái hiển thị" name="is_search_allowed"
                             data={resume_is_search_allowed}/>
                <SearchField type="dropbox" label="Trạng thái tài khoản" name="seeker_status"
                             data={seeker_status}/>
                <SearchField type="dropbox" label="Loại hồ sơ" name="resume_type"
                             data={resume_type}/>
                <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
                <SearchField type="datetimerangepicker" label="Ngày làm mới" name="refreshed_at"/>
                <SearchField type="dropbox" label="Sắp xếp thời gian tạo" name="order_by[created_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
                <SearchField type="dropbox" label="Sắp xếp thời gian cập nhật" name="order_by[updated_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        branch: state.branch,
        province: state.province
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
