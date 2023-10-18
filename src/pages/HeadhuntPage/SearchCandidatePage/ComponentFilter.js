import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import FilterLeft from 'components/Common/Ui/Table/FilterLeft';
import {createPopup} from "actions/uiAction";
import DocumentPopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/Document";
import {getListTagHeadhunt} from "api/headhunt";


class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
        };
        this.showDocument = this._showDocument.bind(this);
        this.getTag = this._getTag.bind(this);
    }

    _showDocument() {
        const {actions} = this.props;
        actions.createPopup(DocumentPopup, 'Hướng dẫn cách dùng boolean search');
    }

    componentDidMount() {
        const {query} = this.props;
        if (query.tag) {
            this.getTag(query.tag);
        }

    }

    async _getTag(params) {
        if (params) {
            const res = await getListTagHeadhunt({q: params});
            if (res?.items && Array.isArray(res.items)) {
                const tags = res.items.map(item => {
                    return {title: item?.title, value: item?.id}
                });
                this.setState({tags});
            }
        } else {
            this.setState({tags: []});
        }
    }


    render() {
        const {query, menuCode, idKey, sys} = this.props;
        const {tags} = this.state;
        let channels = [];
        const channelConst = {...Constant.CHANNEL_LIST, "sourced": "Sourced"}
        for (const channel in channelConst) {
            channels.push({
                title: channelConst[channel],
                value: channel
            });
        }
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
        const exist_applicant = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_headhunt_exist_applicant_status);
        const status = utils.convertArrayValueCommonData(sys.common.items,
            Constant.COMMON_DATA_KEY_resume_status);

        const province = sys.province.items;
        const fieldAll = sys.jobField.list.map(i => ({
            ...i,
            name: `${i.channel_code.toUpperCase()} - ${i.name}`
        }));
        return (
            <>
                <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={50}>
                    <SearchField type="input" label="Keyword" name="cv_txt" timeOut={1000}/>
                    <SearchField type="dropboxfetch" label="Tag" name="tag_ids[]" fnFetch={this.getTag} data={tags}
                                 timeOut={1000}/>
                    <SearchField type="dropbox" label="Web" name="filter_channel_code" data={channels}/>
                    <SearchField type="dropboxmulti" label="Tỉnh thành" name="province_ids" key_value="id"
                                 key_title="name"
                                 data={province}/>
                    <SearchField type="dropboxmulti" label="Ngành nghề" name="field_ids" key_value="id" key_title="name"
                                 data={fieldAll}/>
                    <SearchField type="dropboxmulti" label="Mức lương" name="salary_range" data={salary_range}/>
                    <SearchField type="dropboxmulti" label="Số năm kinh nghiệm" name="experience"
                                 data={experience_range}/>
                    <SearchField type="dropboxmulti" label="Cấp bậc" name="position" data={position}/>
                    <SearchField type="dropboxmulti" label="Bằng cấp" name="level" data={seeker_level}/>
                    <SearchField type="dropbox" label="Giới tính" name="gender" data={seeker_gender}/>
                    <SearchField type="datetimerangepicker" label="Ngày cập nhật" name="update_ts"/>
                    <SearchField type="dropboxmulti" label="Trạng thái" name="status" data={status}/>
                    <SearchField type="dropbox" label="Trạng thái add campaign" name="exist_applicant"
                                 data={exist_applicant}/>
                </FilterLeft>
                <div onClick={this.showDocument} className="text-link">Hướng dẫn cách dùng boolean search</div>
                <a href={`${Constant.BASE_URL_HEADHUNT_SEARCH_CANDIDATE}?action=tags`} className="text-link" target={"_blank"}>Xem danh sách tag</a>
            </>

        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
