import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input2 from 'components/Common/InputValue/Input2';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import queryString from 'query-string';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";
import moment from 'moment-timezone';
import Input2Fetch from "components/Common/InputValue/Input2Fetch";
import {getListUniversity, getListUniversityCareer} from "api/seeker";
import InputImg from "components/Common/InputValue/InputImg";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupCertificate extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.DiplomaInfo");
        let object_required = ['school_name', 'start_date', 'end_date', 'specialized'];
        if (configForm.includes("title")) {
            object_required = [...object_required, "title"];
        }
        if (configForm.includes("career_name")) {
            object_required = [...object_required, "career_name"];
        }
        if (configForm.includes("gra_diploma")) {
            object_required = [...object_required, "gra_diploma"];
        }
        const arrayTitle = {
            [Constant.CHANNEL_CODE_VL24H]: "Tên bằng cấp, chứng chỉ",
            [Constant.CHANNEL_CODE_TVN]: "Trình độ",
            [Constant.CHANNEL_CODE_MW]: "Trình độ",
        }
        const lableTitle = arrayTitle[channelCodeCurrent];

        this.state = {
            object: Object.assign({}, props.object),
            object_revision: Object.assign({}, props.object_revision),
            object_required: object_required,
            object_error: {},
            name_focus: "",
            configForm: configForm,
            lableTitle: lableTitle
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object_revision = Object.assign({}, this.state.object_revision);
        // Bỏ đi cơ chế merge data luôn lấy dữ liệu chính api trả về
        let object = object_revision;
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }

        let start_date = moment(moment.unix(object.start_date).format("YYYY-MM-DD")).unix();
        let end_date = moment(moment.unix(object.end_date).format("YYYY-MM-DD")).unix();
        let curr = moment(moment().format("YYYY-MM-DD")).unix();
        if(start_date > curr || start_date > end_date){
            this.setState({object_error: {start_date: ':attr_name không hợp lệ'}});
            this.setState({name_focus: 'start_date'});
            return
        }

        let data_arr = [];
        this.props.data_list.forEach((item) => {
            data_arr.push(item.object_revision);
        });
        let params = queryString.parse(window.location.search);
        let args = {
            resume_id: params.id,
            seeker_id: params.seeker_id
        };
        if(this.props.object && this.props.object_revision){
            data_arr[this.props.key_edit] = object;
        }else{
            data_arr.push(object);
        }
        args.data = data_arr;
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_CERTIFICATE_SAVE, args);
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object_revision = Object.assign({},this.state.object_revision);
        object_revision[name] = value;
        this.setState({object_revision: object_revision});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_CERTIFICATE_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_CERTIFICATE_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('CertificateInfo');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_CERTIFICATE_SAVE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        if (this.state.loading){
            return(
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        const {object, object_revision, object_error, object_required, name_focus, configForm, lableTitle} = this.state;
        const certificate_rate = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_certificate_rate);

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave();
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "title") && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Input2 type="text" name="title" label={lableTitle} required={object_required.includes('title')}
                                                nameFocus={name_focus} error={object_error.title}
                                                value={(object_revision.title !== undefined) ? object_revision.title : object.title}
                                                old_value={object.title}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "school_name_text") && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Input2 type="text" name="school_name" label="Trường/Đơn vị đào tạo" required={object_required.includes('school_name')}
                                                nameFocus={name_focus} error={object_error.school_name}
                                                value={(object_revision.school_name !== undefined) ? object_revision.school_name : object.school_name}
                                                old_value={object.school_name}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "school_name_fetch") && (
                                    <>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Input2Fetch type="text" name="school_name" label="Trường/Đơn vị đào tạo"
                                                         required={object_required.includes('school_name')}
                                                         nameFocus={name_focus} error={object_error.school_name}
                                                         value={(object_revision.school_name !== undefined) ? object_revision.school_name : object.school_name}
                                                         old_value={object.school_name}
                                                         onChange={this.onChange}
                                                         fetchApi={getListUniversity}
                                                         timeOut={300}
                                            />
                                        </div>
                                        {_.includes(configForm, "career_name") && (
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Input2Fetch type="text" name="career_name" label="Khoa"
                                                             required={object_required.includes('career_name')}
                                                             nameFocus={name_focus} error={object_error.career_name}
                                                             value={(object_revision.career_name !== undefined) ? object_revision.career_name : object.career_name}
                                                             old_value={object.career_name}
                                                             onChange={this.onChange}
                                                             fetchApi={getListUniversityCareer}
                                                             timeOut={300}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày học" required={object_required.includes('start_date')}
                                                    nameFocus={name_focus} error={object_error.start_date}
                                                    value={(object_revision.start_date !== undefined) ? object_revision.start_date : object.start_date}
                                                    old_value={object.start_date}
                                                    onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="end_date" label="Ngày tốt nghiệp" required={object_required.includes('end_date')}
                                                    nameFocus={name_focus} error={object_error.end_date}
                                                    value={(object_revision.end_date !== undefined) ? object_revision.end_date : object.end_date}
                                                    old_value={object.end_date}
                                                    onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="specialized" label="Chuyên ngành" required={object_required.includes('specialized')}
                                            nameFocus={name_focus} error={object_error.specialized}
                                            value={(object_revision.specialized !== undefined) ? object_revision.specialized : object.specialized}
                                            old_value={object.specialized}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="gra_diploma" label="Loại tốt nghiệp" data={certificate_rate} required={object_required.includes('gra_diploma')}
                                             nameFocus={name_focus} error={object_error.gra_diploma}
                                             value={(object_revision.gra_diploma !== undefined) ? object_revision.gra_diploma : object.gra_diploma}
                                             old_value={object.gra_diploma}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "info") && (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="info" label="Thông tin bổ sung" required={object_required.includes('info')}
                                                nameFocus={name_focus} error={object_error.info}
                                                value={(object_revision.info !== undefined) ? object_revision.info : object.info}
                                                old_value={object.info}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "img_diploma") && (
                                    <div className="col-sm-6 col-lg-3 col-xs-12 mt10">
                                        <InputImg
                                            name="img_diploma"
                                            label="Ảnh bằng cấp"
                                            style={{width: "170px", height: "170px"}}
                                            width={300} height={300}
                                            folder="diploma_image"
                                            maxSize={2} //2M
                                            error={object_error.img_diploma}
                                            old_value={object.img_diploma_url}
                                            value={(object_revision.img_diploma_url !== undefined) ? object_revision.img_diploma_url : object.img_diploma_url}
                                            onChange={this.onChange}
                                            showDeleteImg={this.props.showDeleteImg}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupCertificate);
