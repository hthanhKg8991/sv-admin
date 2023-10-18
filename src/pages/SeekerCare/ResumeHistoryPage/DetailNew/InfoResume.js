import React from 'react';
import {getResume} from "api/seeker";
import {asyncApi} from "api";
import _ from "lodash";
import * as Constant from "utils/Constant";

class InfoResume extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            resume: [],
        };
    }

    async asyncData() {
        const seeker = this.props;

        let fetch = {};

        fetch['resume'] = getResume({seeker_id: seeker.id});

        const res = await asyncApi(fetch);
        this.setState({
            loading: false,
            ...res
        })
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {loading} = this.state;
        const seeker = this.props;
        const resume_group_type = _.keyBy(_.get(this.resume, 'items', []), 'resume_type');

        if (loading) {
            return (
                <span>Loading...</span>
            )
        }

        return (
            <>
                {resume_group_type[Constant.RESUME_NORMAL] ? (
                    <a className="el-button el-button-primary el-button-small"
                       target="_blank"
                       rel="noopener noreferrer"
                       href={`${Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP}?seeker_id=${seeker.id}&id=${resume_group_type[Constant.RESUME_NORMAL].id}`}>
                        <span>Chỉnh sửa hồ sơ từng bước</span>
                    </a>
                ) : (
                    <a className="el-button el-button-primary el-button-small"
                       target="_blank"
                       rel="noopener noreferrer"
                       href={`${Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP}?seeker_id=${seeker.id}`}>
                        <span>Tạo hồ sơ từng bước</span>
                    </a>
                )}
                {resume_group_type[Constant.RESUME_NORMAL_FILE] ? (
                    <a className="el-button el-button-primary el-button-small"
                       target="_blank"
                       rel="noopener noreferrer"
                       href={`${Constant.BASE_URL_SEEKER_RESUME_ATTACH}?seeker_id=${seeker.id}&id=${resume_group_type[Constant.RESUME_NORMAL_FILE].id}`}>
                        <span>Chỉnh sửa hồ sơ đính kèm</span>
                    </a>
                ) : (
                    <a className="el-button el-button-primary el-button-small"
                       target="_blank"
                       rel="noopener noreferrer"
                       href={`${Constant.BASE_URL_SEEKER_RESUME_ATTACH}?seeker_id=${seeker.id}`}>
                        <span>Tạo hồ sơ đính kèm</span>
                    </a>
                )}
            </>
        );
    }
}

export default InfoResume;
