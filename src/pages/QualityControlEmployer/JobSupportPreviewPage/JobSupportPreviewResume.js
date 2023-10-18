import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import Gird from "components/Common/Ui/Table/Gird";
import SpanText from "components/Common/Ui/SpanText";
import * as Constant from "utils/Constant";
import SpanSystem from "components/Common/Ui/SpanSystem";
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "JobSupportPreviewResumeList";

class JobSupportPreviewResume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: props.data_list,
            show_detail: true,
            columns: [
                {
                    title: "ID HS - Tiêu đề HS",
                    width: 160,
                    cell: row => (
                        <Link to={`${Constant.BASE_URL_RESUME}/list?${queryString.stringify({action: "detail", id: Number(row?.id)})}`}
                              target="_new"
                        >
                            <span>{row?.id} - {row?.title}</span>
                        </Link>
                    )
                },
                {
                    title: "Bằng cấp",
                    width: 160,
                    cell: row => (
                        <SpanText idKey={Constant.COMMON_DATA_KEY_seeker_level} value={Number(row?.level)}/>
                    )
                },
                {
                    title: "Mức lương",
                    width: 160,
                    cell: row => (
                        <SpanCommon value={row?.salary_range} idKey={Constant.COMMON_DATA_KEY_job_salary_range} notStyle/>
                    )
                },
                {
                    title: "Tỉnh thành",
                    width: 160,
                    cell: row => (
                        row?.province_ids.map((_, idx) =>
                            <React.Fragment key={idx.toString()}>
                                <SpanSystem value={_} type={"province"} notStyle/><br/>
                            </React.Fragment>
                        )
                    )
                },
                {
                    title: "Ngành nghề",
                    width: 160,
                    cell: row => (
                        row?.field_ids.map((_, idx) =>
                            <React.Fragment key={idx.toString()}>
                                <SpanSystem value={_} type={"jobField"} notStyle/><br/>
                            </React.Fragment>
                        )
                    )
                },
            ]
        };
        this.showDetail = this._showDetail.bind(this);
    }
    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }
    componentWillReceiveProps(newProps) {
        this.setState({data_list: newProps.data_list});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {show_detail, data_list, columns} = this.state;
        const {history} = this.props;
        return(
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Hồ sơ phù hợp <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                {data_list.length > 0 && (
                    <Collapse in={show_detail}>
                        <Gird idKey={idKey}
                              data={data_list}
                              columns={columns}
                              history={history}
                        />
                    </Collapse>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}


export default connect(mapStateToProps,mapDispatchToProps)(JobSupportPreviewResume);
