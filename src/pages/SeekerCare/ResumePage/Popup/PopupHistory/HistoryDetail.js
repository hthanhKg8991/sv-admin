import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import Input2 from 'components/Common/InputValue/Input2';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import moment from "moment";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class HistoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            loading: false,
            reject:{
                rejected_reason: [],
                rejected_reason_note: null
            },
            reject_error:{},
        };
        this.btnReject = this._btnReject.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onChange(value, name){
        let reject_error = this.state.reject_error;
        delete reject_error[name];
        this.setState({reject_error: reject_error});
        let reject = Object.assign({}, this.state.reject);
        reject[name] = value;
        this.setState({reject: reject});
    }
    _btnReject(){
        this.setState({reject_error: {}});
        let reject = this.state.reject;
        if (!reject.rejected_reason.length && !reject.rejected_reason_note) {
            this.props.uiAction.putToastError("Lý do không duyệt là bắt buộc");
        }else {
            let args = {
                seeker_id: this.props.object.id,
                rejected_reason: reject.rejected_reason,
                rejected_reason_note: reject.rejected_reason_note
            };
            this.setState({loading: true},()=>{
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_REJECT, args);
            });
        }
    }
    _btnApprove(){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_APPROVE, {seeker_id: this.props.object.id});
        });
    }
    _refreshList(){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_REVISION_DETAIL, {id: this.props.id});
        });
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_SEEKER_REVISION_DETAIL]){
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_GET_SEEKER_REVISION_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.json_content_change});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SEEKER_REVISION_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_APPROVE]){
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_APPROVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('SeekerPage', {delay: Constant.DELAY_LOAD_LIST_2S});
                this.props.uiAction.refreshList('SeekerGeneralInf');
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_APPROVE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_REJECT]){
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_REJECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('SeekerPage', {delay: Constant.DELAY_LOAD_LIST_2S});
                this.props.uiAction.refreshList('SeekerGeneralInf');
            }else{
                this.setState({reject_error: response.data})
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_REJECT);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        if (this.state.loading){
            return(
                <div className="text-center">
                    <LoadingSmall />
                </div>
            )
        }
        let mapping = {
            province_id:{
                Content: (key)=>{
                    let data = this.props.sys.province.items.filter(c => c.id === key);
                    return data.length ? data[0].name : '';
                }
            },
            gender:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_gender);
                    return data[key] ? data[key] : key;
                }
            },
            marital_status:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_marital_status);
                    return data[key] ? data[key] : key;
                }
            },
            revision_status:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
                    return data[key] ? data[key] : key;
                }
            },
            birthday:{
                Content: (key)=>{
                    return key ? moment.unix(key).format("DD/MM/YYYY") : '';
                }
            }
        };
        let seeker_rejected_reason = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_rejected_reason);
        let reject_other = (this.state.reject.rejected_reason_note || this.state.reject.rejected_reason_note === '');
        return (
            <React.Fragment>
                <div className="relative form-container">
                    <div className="crm-section" style={{padding:"5px 20px"}}>
                        <TableComponent>
                            <TableHeader tableType="TableHeader" width={150}>
                                Trường thay đổi
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={150}>
                                Thông tin cũ
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={150}>
                                Thông tin mới
                            </TableHeader>
                            <TableBody tableType="TableBody">
                                {this.state.data_list.map((item,key)=> {
                                    if(['channel_code'].includes(item.key)) return null;
                                    let old_data = mapping[item.key] ? mapping[item.key].Content(item.value.old) : item.value.old;
                                    let old_new = mapping[item.key] ? mapping[item.key].Content(item.value.new) : item.value.new;
                                    return(
                                        <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                            <td>
                                                <div className="cell" title={item.name}>{item.name}</div>
                                            </td>
                                            <td>
                                                <div className="cell" title={old_data}>{old_data}</div>
                                            </td>
                                            <td>
                                                <div className="cell" title={old_new}>{old_new}</div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </TableBody>
                        </TableComponent>
                    </div>
                    <div className="crm-section" style={{padding:"5px 20px"}}>
                        {this.props.page === 1 && this.props.approve && this.props.id === this.props.itemApprove &&
                        (
                            <div>
                                <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnApprove}>
                                    <span>Duyệt</span>
                                </button>
                            </div>
                        )}
                        {this.props.page === 1 && this.props.reject && this.props.id === this.props.itemApprove &&
                        (
                            <React.Fragment>
                                <div className="left">
                                    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnReject}>
                                        <span>Không duyệt</span>
                                    </button>
                                </div>
                                <div className="relative left width250 crm-section paddingLeft5 top-10">
                                    <DropboxMulti name="rejected_reason" label="Lý do không duyệt" data={seeker_rejected_reason} required={this.state.reject.rejected_reason_note ? -1 : 1}
                                                  error={this.state.reject_error.rejected_reason} value={this.state.reject.rejected_reason}
                                                  onChange={this.onChange}
                                    />
                                </div>
                                <div className="left">
                                    <FormControlLabel className="margin0"
                                                      label={<label className="v-label margin0">Khác</label>}
                                                      control={
                                                          <Checkbox checked={!!reject_other} color="primary" icon={<CheckBoxOutlineBlankIcon fontSize="large"/>} checkedIcon={<CheckBoxIcon fontSize="large"/>}
                                                                    onChange={()=>{this.onChange(reject_other ? null : "",'rejected_reason_note');}}/>
                                                      }
                                    />
                                </div>
                                {reject_other && (
                                    <div className="relative left width250 crm-section paddingLeft10 top-10">
                                        <Input2 type="text" name="rejected_reason_note" label="Lý do khác" required={this.state.reject.rejected_reason.length ? -1 : 1}
                                               error={this.state.reject_error.rejected_reason_note} value={this.state.reject.rejected_reason_note}
                                               onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(HistoryDetail);
