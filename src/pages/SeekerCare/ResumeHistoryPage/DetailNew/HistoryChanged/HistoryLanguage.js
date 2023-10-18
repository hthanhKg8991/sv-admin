import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class HistoryLanguage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            loading: false,
        };
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _refreshList(){
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'language';
        this.setState({itemActive: -1});
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, url, {resume_revision_id: this.props.resume_revision_id});
        });
    }
    _activeItem(key){
        let itemActive = this.state.itemActive;
        itemActive = String(itemActive) !== String(key) ? key : -1;
        this.setState({itemActive: itemActive});
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'language';
        if (newProps.api[url]){
            let response = newProps.api[url];
            if (response.code === Constant.CODE_SUCCESS) {
                if(response.data.json_content_change){
                    this.setState({data_list: response.data.json_content_change});
                }
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(url);
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
        let {data_list, itemActive} = this.state;

        let language_resume = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_language_resume);
        let language_resume_rate = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_language_resume_rate);
        const languageLevel = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_level);
        return (
            <TableComponent allowDragScroll={false} className="mt15">
                <TableHeader tableType="TableHeader" width={150}>
                    Ngoại ngữ
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Nghe
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Nói
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Đọc
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Viết
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Trình độ
                </TableHeader>
                <TableBody tableType="TableBody">
                    {data_list.map((item, key)=> {
                        const languageMain = language_resume[item?.language] || item?.language;
                        const languageOther = Number(item?.language) === Constant.OTHER_LANGUAGE_VALUE && item?.other_language ? `(${item?.other_language})` : "";
                        const languageMainOld = language_resume[item?.old_data?.language] || item?.old_data.language || "";
                        const languageOtherOld = Number(item?.old_data?.language) === Constant.OTHER_LANGUAGE_VALUE && item?.old_data?.other_language ? `(${item?.old_data?.other_language})` : "";
                        let data_change = {
                            language: `${languageMain} ${languageOther}`,
                            listen_level: language_resume_rate[item?.listen_level] ? language_resume_rate[item?.listen_level] : item?.listen_level,
                            speak_level: language_resume_rate[item?.speak_level] ? language_resume_rate[item?.speak_level] : item?.speak_level,
                            reading_level: language_resume_rate[item?.reading_level] ? language_resume_rate[item?.reading_level] : item?.reading_level,
                            writing_level: language_resume_rate[item?.writing_level] ? language_resume_rate[item?.writing_level] : item?.writing_level,
                            level: languageLevel[item?.level] ? languageLevel[item?.level] : item?.level,
                        };
                        let old_data = {
                            language: `${languageMainOld} ${languageOtherOld}`,
                            listen_level: language_resume_rate[item?.old_data?.listen_level] ? language_resume_rate[item?.old_data?.listen_level] : item?.old_data?.listen_level,
                            speak_level: language_resume_rate[item?.old_data?.speak_level] ? language_resume_rate[item?.old_data?.speak_level] : item?.old_data?.speak_level,
                            reading_level: language_resume_rate[item?.old_data?.reading_level] ? language_resume_rate[item?.old_data?.reading_level] : item?.old_data?.reading_level,
                            writing_level: language_resume_rate[item?.old_data?.writing_level] ? language_resume_rate[item?.old_data?.writing_level] : item?.old_data?.writing_level,
                            level: languageLevel[item?.old_data?.level] ? languageLevel[item?.old_data?.level] : item?.old_data?.level,
                        };
                        return(
                            <React.Fragment key={key}>
                                <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(key) ? 'active' : '')} onClick={()=>{this.activeItem(key)}}>
                                    {Object.keys(old_data).map((name, key) => {
                                        let cl = '';
                                        let value = data_change[name];

                                        if(old_data[name] === undefined) cl = 'textBlue';
                                        else if(String(old_data[name]) !== String(data_change[name])) cl = 'textWarning';

                                        if(item?.old_data && parseInt(item?.old_data?.status) === Constant.STATUS_DELETED){
                                            cl = 'textRed lineThrough';
                                            value = old_data[name];
                                        }
                                        if(item?.status && parseInt(item?.status) === Constant.STATUS_DELETED){
                                            cl += ' lineThrough';
                                        }
                                        return(
                                            <td key={key}>
                                                <div className={classnames("cell", cl)} title={value}>{value}</div>
                                            </td>
                                        )
                                    })}
                                </tr>
                                {String(itemActive) === String(key) && (
                                    <tr className={classnames("el-table-item")} onClick={()=>{this.activeItem(key)}}>
                                        {Object.keys(old_data).map((name, key) => {
                                            return(
                                                <td key={key}>
                                                    <div className="cell" title={old_data[name]}>{old_data[name]}</div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                </TableBody>
            </TableComponent>
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
export default connect(mapStateToProps,mapDispatchToProps)(HistoryLanguage);
