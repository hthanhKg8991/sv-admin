import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {deleteCandidateBankHeadhunt, getListCandidateBankHeadhunt} from "api/headhunt";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Checkbox from "@material-ui/core/Checkbox";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import GirdCustomHeader from "./GirdCustomHeader";
import AddCampaignPopup from "./Popup/AddCampaign";
import AssignRecruiterPopup from "./Popup/AssignRecruiter";
import moment from "moment";
import ResumeDetailPopup from "./Popup/Resume/Resume";


const idKey = "HeadhuntCandidateBankList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            checked: [],
            btn_all_checked: false,
            columns: [
            {
                title: "",
                width: 50,
                cell: row => <div className="text-center">
                    <Checkbox
                        color="primary"
                        classes={{root: 'custom-checkbox-root'}}
                        checked={!!this.state.checked.find(v => v.id === row.id)}
                        inputProps={{'aria-label': 'secondary checkbox'}}
                        onChange={() => this.onCheck(row)}
                    />
                </div>
            },
            {
                title: "Channel", width: 60, cell: row => <span>{{
                    ...Constant.CHANNEL_LIST, "sourced": "Sourced"
                }[String(row?.candidate_info.channel_code)]}</span>
            },
            {
                title: "Tiêu đề hồ sơ", width: 170, cell: row => {
                    return (<>
                            <div>
                                <span>{`${row.candidate_info.resume_id} - ${row.candidate_info.title}`}</span>
                            </div>
                            <div>
                                {`${row.candidate_info.name} ${row.candidate_info.birthday ? `(${moment().year() - moment.unix(row.candidate_info.birthday).year()} tuổi)` : ""}`}
                            </div>
                            {/*<div>*/}
                            {/*    {Array.isArray(row.tag_info) && row.tag_info.map((v, i) => (*/}
                            {/*        <span key={i} className="text-green mr10 text-italic">*/}
                            {/*            {`#${v.title}`}*/}
                            {/*        </span>))}*/}
                            {/*</div>*/}
                            <div>
                                <div>
                                      <span className="text-underline text-primary pointer mr15"
                                            onClick={() => this.onClickShowDetail(row)}>
                                        Detail Candidate Info
                                    </span>
                                </div>
                            </div>
                        </>

                    )
                }
            },
            {
                title: "Vị trí tuyển dụng",
                width: 150,
                cell: row => <span>{`${row.job_request_id} - ${row.job_request_title}`}</span>
            },
            {
                title: "Recruiter",
                width: 150,
                accessor: "recruiter_staff_login_name"
            },
            {
                title: "Sourcer",
                width: 150,
                accessor: "sourcer_staff_login_name"
            },
            {
                title: "Ngày add",
                width: 50,
                cell: row => <span>{moment.unix(row.created_at).format("DD-MM-YYYY")}</span>
            },
            {
                title: "Trạng thái", width: 50, cell: row => {
                    return <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_candidate_bank_status}
                                       value={row.status}/>;
                }
            },
            {
                title: "Thao tác",
                width: 50,
                cell: row => <div className="text-center">
                    <CanRender actionCode={ROLES.headhunt_candidate_bank_delete} >
                        <span className="text-link text-red cursor-pointer font-bold" onClick={()=> this.onDelete(row.id)}>Xoá</span>
                    </CanRender>
                </div>
            },
            ],
            loading: null,
        };
        this.onCheck = this._onCheck.bind(this);
        this.onCheckAll = this._onCheckAll.bind(this);
        this.onAddCampaign = this._onAddCampaign.bind(this);
        this.onAssignRecruiter = this._onAssignRecruiter.bind(this);
        this.setDataFetch = this._setDataFetch.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onClickShowDetail = this._onClickShowDetail.bind(this);
    }

    _onClickShowDetail(object) {
        const {actions} = this.props;
        actions.createPopup(ResumeDetailPopup, 'Thông tin Resume', {id: object.id, idKey});
    }

    _onAssignRecruiter() {
        const {actions} = this.props;
        const {checked} = this.state;
        if (checked.length > 0) {
            actions.createPopup(AssignRecruiterPopup, 'Chuyển Recruiter', {
                list_id: checked.map(v => v.id),
                idKey
            });
        } else {
            actions.putToastError("Cần chọn ứng viên để chuyển")
        }
    }

    _onCheck(item) {
        const {checked} = this.state;

        if (checked.find(v => v.id === item.id)) {
            this.setState({checked: checked.filter(v => v.id !== item.id)});
        } else {
            this.setState({checked: [...checked, item]});
        }
    }

    _onCheckAll(checked) {
        const {btn_all_checked} = this.state;
        this.setState({btn_all_checked: !btn_all_checked, checked:btn_all_checked ? [] : checked})
    }

    _onAddCampaign() {
        const {actions} = this.props;
        const {checked} = this.state;
        if (checked.length > 0) {
            actions.createPopup(AddCampaignPopup, 'Thêm mới', {
                list_id: checked.map(v => v.id),
                idKey
            });
        } else {
            actions.putToastError("Chọn ứng viên cần thêm vào campaign")
        }
    }

    _setDataFetch(data) {
        this.setState({data})
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteCandidateBankHeadhunt({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    render() {
        const {columns, data, btn_all_checked} = this.state;
        const {query, defaultQuery, history, is_archived} = this.props;
        return (<Default
            left={(<WrapFilter is_archived={is_archived} idKey={idKey} history={history} query={query}
                               ComponentFilter={ComponentFilter}/>)}
            title="Candidate Bank"
            titleActions={(<button type="button" className="bt-refresh el-button" onClick={() => {
                publish(".refresh", {}, idKey)
            }}>
                <i className="fa fa-refresh"/>
            </button>)}
        >
            <>
                <div className="left btnCreateNTD mb10">
                    {data && (<>
                        {btn_all_checked ? (<button type="button"
                                                    className="el-button el-button-bricky el-button-small"
                                                    onClick={() => this.onCheckAll(data.items)}>
                            <span>Bỏ chọn tất cả</span>
                        </button>) : (<button type="button"
                                              className="el-button el-button-success el-button-small"
                                              onClick={() => this.onCheckAll(data.items)}>
                            <span>Chọn tất cả</span>
                        </button>)}
                    </>)}
                    <CanRender actionCode={ROLES.headhunt_candidate_bank_add_campaign}>
                        <button type="button"
                                className="el-button el-button-success el-button-small"
                                onClick={this.onAddCampaign}>
                            <span>Add vào campaign</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.headhunt_candidate_bank_assign_recruiter}>
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={this.onAssignRecruiter}>
                            <span>Chuyển Recruiter</span>
                        </button>
                    </CanRender>
                </div>

                <GirdCustomHeader idKey={idKey} fetchApi={getListCandidateBankHeadhunt}
                                  query={{...query}}
                                  columns={columns}
                                  perPage={30}
                                  isRedirectDetail={false}
                                  defaultQuery={defaultQuery}
                                  setDataFetch={this.setDataFetch}
                                  history={history}/>
            </>
        </Default>)
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox, createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
