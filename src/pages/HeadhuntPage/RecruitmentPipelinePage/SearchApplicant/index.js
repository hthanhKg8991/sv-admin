import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import {searchApplicantHeadhunt} from "api/headhunt";
import Input2 from "components/Common/InputValue/Input2";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import PopupDetail from "pages/HeadhuntPage/RecruitmentPipelinePage/Kanban/PopupDetail";

const idKey = "SearchApplicantList";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: "",
            submitQuery: {},
            columns: [
                {
                    title: "Applicant",
                    width: 150,
                    cell: row => <div>
                        <div>{`- Tên ${row.seeker_name}`}</div>
                        <div>{`- Tiêu đề ${row.resume_title}`}</div>
                    </div>
                },
                {
                    title: "Campaign",
                    width: 100,
                    cell: row => <div>{`${row.campaign_info?.id} - ${row.campaign_info?.name}`}</div>
                },
                {
                    title: "Applicant",
                    width: 60,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => <span>{props.lanes.find(v => v.id === row.status)?.title}</span>
                },
                {
                    title: "Nguồn",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_source}
                                             value={row?.data_source}/>
                },
                {
                    title: "Staff recruiter",
                    width: 120,
                    accessor: "recruiter_staff_login_name"
                },

            ],
            loading: true
        };
        this.onChangeQ = this._onChangeQ.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onChangeQ(q) {
        this.setState({q});
    }

    async _onSubmit() {
        const {q} = this.state;
        if (q.length > 0) {
            this.setState({loading: true}, () => {
                this.setState({submitQuery: {q: q}, loading: false})
            });
        }
    }

    render() {
        const {columns, submitQuery, loading} = this.state;
        const {history} = this.props;
        return (
            <div className="padding-10">
                <div className="row mb20">
                    <div className="col-sm-5">
                        <Input2 label="Nhập email, số điện thoại" onChange={this.onChangeQ}/>
                    </div>
                    <div className="col-sm-1">
                        <button type="submit" onClick={this.onSubmit}
                                className="el-button el-button-small el-button-success">Tìm
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        {!loading && (
                            <Gird idKey={idKey}
                                  fetchApi={searchApplicantHeadhunt}
                                  query={submitQuery}
                                  columns={columns}
                                  history={history}
                                  isRedirectDetail={false}
                                  isPushRoute={false}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(index);
