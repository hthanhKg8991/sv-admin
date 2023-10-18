import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {getListCandidateHeadhunt, staffSeenCandidateHeadhunt, syncResumeCandidateHeadhunt} from "api/headhunt";
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
import SendMail from "./Popup/SendMail";
import GirdCustomHeader from "./GirdCustomHeader";
import ResumeDetailPopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/Resume";
import * as utils from "utils/utils";
import AddCampaignPopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddCampaign";
import AddCandidatePopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddCandidate";
import AddCandidateBankPopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddCandidateBank";
import moment from "moment";
import PopupImportFile from "../CustomerPage/Popup/PopupImportFile";

const idKey = "AdvancedResumeList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            check_send_mail: [],
            temp_seen: [],
            btn_all_checked: false,
            columns: [
                {
                    title: "",
                    width: 30,
                    onClick: () => {
                    },
                    cell: row => <div className="text-center">
                        <Checkbox
                            color="primary"
                            classes={{root: 'custom-checkbox-root'}}
                            checked={!!this.state.check_send_mail.find(v => v.id === row.id)}
                            inputProps={{'aria-label': 'secondary checkbox'}}
                            onChange={() => this.onCheckSendMail(row)}
                            value={row?.id}
                        />
                    </div>
                },
                {
                    title: "Channel",
                    width: 60,
                    cell: row => <span>{{
                        ...Constant.CHANNEL_LIST,
                        "sourced": "Sourced"
                    }[String(row?.channel_code)]}</span>
                },

                {
                    title: "Tiêu đề hồ sơ",
                    width: 170,
                    cell: row => {
                        return (
                            <>
                                <div>
                                    <span>{`${row.resume_id} - ${row.title}`}</span>
                                    {(row.staff_seen === Constant.HEADHUNT_STAFF_SEEN_YES || this.state.temp_seen.includes(row.id)) && (
                                        <span className="text-red">&nbsp;(Đã xem)</span>
                                    )}
                                </div>
                                <div>
                                    {`${row.name} ${row.birthday ? `(${moment().year() - moment.unix(row.birthday).year()} tuổi)` : ""}`}
                                </div>
                                <div>
                                    {Array.isArray(row.tag_info) && row.tag_info.map((v, i) => (
                                        <span key={i} className="text-green mr10 text-italic">
                                            {`#${v.title}`}
                                        </span>
                                    ))}
                                </div>
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
                    title: "Mức lương",
                    width: 80,
                    cell: row => <span>
                         {utils.formatNumber(row.salary, 0, ".", "đ")}
                    </span>
                },
                {
                    title: "Kinh nghiệm",
                    width: 50,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_experience_range}
                                           value={row.experience} notStyle/>;
                    }
                },
                {
                    title: "Địa chỉ",
                    width: 50,
                    cell: row =>
                        <span>{props.province.items?.find(value => value.id === row.seeker_province_id)?.name || ''}</span>

                },
                {
                    title: "Ngày cập nhật",
                    width: 50,
                    cell: row => <span>{moment.unix(row.updated_at).format("DD-MM-YYYY")}</span>
                },
                {
                    title: "Trạng thái hồ sơ",
                    width: 50,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_status}
                                           value={row.status}/>;
                    }
                },
                {
                    title: "Trạng thái add campaign",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_exist_applicant_status}
                                           value={row.exist_applicant}/>;
                    }
                },

            ],
            loading: null,
        };
        this.onCheckSendMail = this._onCheckSendMail.bind(this);
        this.onCheckAllSendMail = this._onCheckAllSendMail.bind(this);
        this.onSendMail = this._onSendMail.bind(this);
        this.onAddCampaign = this._onAddCampaign.bind(this);
        this.clearCheckSendMail = this._clearCheckSendMail.bind(this);
        this.onClickShowDetail = this._onClickShowDetail.bind(this);
        this.setDataFetch = this._setDataFetch.bind(this);
        this.trackStaffSeen = this._trackStaffSeen.bind(this);
        this.onAddCandidate = this._onAddCandidate.bind(this);
        this.onClickImport = this._onClickImport.bind(this);
        this.onAddCandidateBank = this._onAddCandidateBank.bind(this);
    }

    _onClickShowDetail(object) {
        const {actions} = this.props;
        actions.createPopup(ResumeDetailPopup, 'Thông tin Resume', {id: object.id, idKey});
        this.trackStaffSeen(object);
    }

    _clearCheckSendMail() {
        this.setState({check_send_mail: []})
    }

    _onCheckSendMail(item) {
        const {check_send_mail} = this.state;
        if (check_send_mail.find(v => v.id === item.id)) {
            this.setState({check_send_mail: check_send_mail.filter(v => v.id !== item.id)});
        } else {
            this.setState({check_send_mail: [...check_send_mail, item]});
        }
    }

    _onCheckAllSendMail(check_send_mail) {
        const {btn_all_checked} = this.state;
        if (btn_all_checked) {
            this.clearCheckSendMail();
        } else {
            this.setState({check_send_mail})
        }
        this.setState({btn_all_checked: !btn_all_checked})
    }

    _onSendMail() {
        const {actions} = this.props;
        const {check_send_mail} = this.state;
        if (check_send_mail.length > 0) {
            actions.createPopup(SendMail, 'Add contact vào list', {
                check_send_mail,
                clearCheckSendMail: this.clearCheckSendMail
            });
        } else {
            actions.putToastError("Chọn ứng viên cần gửi email")
        }
    }

    _onAddCampaign() {
        const {actions} = this.props;
        const {check_send_mail} = this.state;
        if (check_send_mail.length > 0) {
            actions.createPopup(AddCampaignPopup, 'Thêm mới', {
                list_candidate_id: check_send_mail.map(v => v.id)
            });
        } else {
            actions.putToastError("Chọn ứng viên cần thêm vào campaign")
        }
    }

    _setDataFetch(data) {
        this.setState({data})
    }

    async _trackStaffSeen(object) {
        if (object?.staff_seen === Constant.HEADHUNT_STAFF_SEEN_NO) {
            const res = await staffSeenCandidateHeadhunt({id: object.id})
            if (res && res.code === 200) {
                const {temp_seen} = this.state;
                this.setState({temp_seen: [...temp_seen, object.id]});
            }
        }
    }

    _onAddCandidate() {
        const {actions} = this.props;
        actions.createPopup(AddCandidatePopup, 'Thêm mới Candidate', {idKey});
    }

    _onClickImport() {
        const {actions} = this.props;
        actions.createPopup(PopupImportFile, "Import Candidate", {
            type: Constant.IMPORT_HISTORY_TYPE_CANDIDATE, 
            link_sample: Constant.HEADHUNT_FILE_IMPORT_CANDIDATE_SAMPLE
        });
    }

    _onAddCandidateBank() {
        const {actions} = this.props;
        const {check_send_mail} = this.state;
        if (check_send_mail.length > 0) {
            actions.createPopup(AddCandidateBankPopup, 'Thêm ứng viên vào Candidate Bank', {
                list_candidate_id: check_send_mail.map(v => v.id)
            });
        } else {
            actions.putToastError("Chọn ứng viên cần thêm vào Candidate Bank")
        }
    }
    render() {
        const {columns, data, btn_all_checked} = this.state;
        const {query, defaultQuery, history, is_archived} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter is_archived={is_archived} idKey={idKey} history={history} query={query}
                                ComponentFilter={ComponentFilter}/>
                )}
                title={`Danh Sách Hồ Sơ ${is_archived ? "Đã Xóa" : ""}`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            ><>
                {data && (
                    <div className="mb10">
                        <span>Tìm thấy</span>
                        <span className="font-bold"> {data.total_items} </span>
                        <span>hồ sơ phù hợp với tiêu chí tìm kiếm</span>
                    </div>

                )}


                <div className="left btnCreateNTD mb10">
                    {data && (
                        <>
                            {btn_all_checked ? (
                                <button type="button"
                                        className="el-button el-button-bricky el-button-small"
                                        onClick={() => this.onCheckAllSendMail(data.items)}>
                                    <span>Bỏ chọn tất cả</span>
                                </button>
                            ) : (
                                <button type="button"
                                        className="el-button el-button-success el-button-small"
                                        onClick={() => this.onCheckAllSendMail(data.items)}>
                                    <span>Chọn tất cả</span>
                                </button>
                            )}
                        </>
                    )}
                    <CanRender actionCode={ROLES.email_marketing_list_contact_add_mail_from_list_resume}>
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={this.onSendMail}>
                            <span>Add vào list gửi mail cho ứng viên</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.headhunt_search_candidate_add_campaign}>
                        <button type="button"
                                className="el-button el-button-success el-button-small"
                                onClick={this.onAddCampaign}>
                            <span>Add vào campaign</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.headhunt_search_candidate_add_candidate}>
                        <button type="button"
                                className="el-button el-button-warning el-button-small"
                                onClick={this.onAddCandidate}>
                            <span>Thêm Candidate</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.headhunt_search_candidate_import}>
                        <button type="button"
                                className="el-button el-button-warning el-button-small"
                                onClick={this.onClickImport}>
                            <span>Import Candidate</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.headhunt_search_candidate_create_multiple}>
                        <button type="button"
                                className="el-button el-button-bricky el-button-small"
                                onClick={this.onAddCandidateBank}>
                            <span>Add vào Candidate Bank</span>
                        </button>
                    </CanRender>
                </div>

                <GirdCustomHeader idKey={idKey} fetchApi={getListCandidateHeadhunt}
                                  query={{...query}}
                                  columns={columns}
                                  perPage={30}
                                  isRedirectDetail={false}
                                  defaultQuery={defaultQuery}
                                  setDataFetch={this.setDataFetch}
                                  history={history}/>
            </>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        province: state.sys.province,
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(List);
