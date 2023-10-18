import React, { Component } from "react";
import Gird from "components/Common/Ui/Table/Gird";
import { getResumeDaily, updateResumeViewedDaily } from "api/seeker";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {
    putToastSuccess,
    SmartMessageBox,
    hideSmartMessageBox,
    createPopup
} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import SpanCommon from 'components/Common/Ui/SpanCommon';
import {Link} from "react-router-dom";
import queryString from "query-string";

const idKey = "JobDailyPage";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tiêu đề hồ sơ",
                    width: 200,
                    cell: (row) => (
                        <span className="cursor-pointer textBlue"
                              onClick={() => this.onViewed(row)}>
                            {parseInt(row?.resume_info?.resume_type) === Constant.RESUME_NORMAL_FILE && (
                                <i className="fa mr-1 fa-paperclip text-info text-bold"/>)}
                           {`${row?.resume_id} - ${row?.resume_info?.title}`}
                       </span>
                    )
                },
                {
                    title: "Ngày đăng",
                    width: 160,
                    time: true,
                    accessor: "resume_info.created_at",
                },
                {
                    title: "Ngày sửa",
                    width: 160,
                    time: true,
                    accessor: "resume_info.updated_at",
                },
                {
                    title: "Tên người tìm việc",
                    width: 200,
                    cell: row => (
                       <Link to={`${Constant.BASE_URL_SEEKER}?${queryString.stringify({action: "detail", id: row?.seeker_info?.id})}`} target="_blank">
                           <span className="cursor-pointer textBlue">{row?.seeker_info?.name}</span>
                       </Link>
                    ),
                },
                {
                    title: "Người view",
                    width: 200,
                    accessor: "staff_username",
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_viewed_status}
                                    value={row?.status}/>
                    )
                },
            ],
            loading: false,
        };
        this.onViewed = this._onViewed.bind(this);
        // this.onUpdateViewed = this._onUpdateViewed.bind(this);
    }


    async _onViewed(row) {
        const { id, resume_id } = row;
        const { channel_code } = this.props.currentBranch;
        const res = await updateResumeViewedDaily({ id });
        if(res) {
            publish(".refresh", {}, idKey);
        }
        let linkFe = Constant.URL_FE[channel_code];
        if(channel_code === Constant.CHANNEL_CODE_VL24H) {
            linkFe = Constant.URL_FE[Constant.DOMAIN_RECRUITER_VL24H];
        }   
        window.open(`${linkFe}/short/resume/${resume_id}`);
    }

    // async _onUpdateViewed(row) {
    //     const { id, resume_id } = row;
    //     const { channel_code } = this.props.currentBranch;
    //     const {actions} = this.props;
    //     actions.SmartMessageBox({
    //         title: 'Bạn có chắc chắn đánh dấu đã xem!' ,
    //         content: "",
    //         buttons: ['No', 'Yes']
    //     }, async (ButtonPressed) => {
    //         if (ButtonPressed === "Yes") {
    //             const res = await updateResumeViewedDaily({ id });
    //             actions.hideSmartMessageBox();
    //             publish(".refresh", {}, idKey);
    //             const linkFe = Constant.URL_FE[channel_code];
    //             window.open(`${linkFe}/short/resume/${resume_id}`);
    //         }
    //     });
    // }

    render() {
        const { columns } = this.state;
        const { query, defaultQuery, history } = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="DS hồ sơ trong ngày"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getResumeDaily}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox }, dispatch),
        uiAction: bindActionCreators({ createPopup }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        currentBranch: state.branch.currentBranch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
