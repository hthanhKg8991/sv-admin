import React,{Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import InputArea from 'components/Common/InputValue/InputArea';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PopupArticlePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object),
            object_error: {},
            object_required:['type','question','answer']
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }
    _onSave(object){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();

        if (!object.id){
            object.status = Constant.STATUS_ACTIVED;
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiArticleDomain, ConstantURL.API_URL_POST_QUESTION_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiArticleDomain, ConstantURL.API_URL_POST_QUESTION_UPDATE, object);
        }
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});
    }
    _getDetail(id){
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiArticleDomain, ConstantURL.API_URL_GET_QUESTION_DETAIL, {id: id});
    }
    componentWillMount(){
        let {object} = this.props;
        if (object){
            this.getDetail(object.id);
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_QUESTION_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_QUESTION_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({object: response.data});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_QUESTION_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_QUESTION_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_QUESTION_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('ArticleQuestionPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_QUESTION_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_QUESTION_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_QUESTION_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('ArticleQuestionPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_QUESTION_UPDATE);
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
        let {object, object_error, object_required, name_focus} = this.state;
        let question_answer_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_question_answer_type);
        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="type" label="Loại" data={question_answer_type} required={object_required.includes('type')}
                                         value={object.type} error={object_error.type} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="question" label="Câu hỏi" required={object_required.includes('question')}
                                        error={object_error.question} value={object.question} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <InputArea name="answer" label="Câu trả lời" required={object_required.includes('answer')}
                                           style={{height:"100px", minHeight:"100px"}} nameFocus={name_focus}
                                           value={object.answer} error={object_error.answer}
                                           onChange={this.onChange}
                                />
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
        api: state.api,
        sys: state.sys
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupArticlePost);
