import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import Input2 from 'components/Common/InputValue/Input2';
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import T from "components/Common/Ui/Translate";

class PopupCustomFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callingApi: false,
            object:{},
            object_error:{},
            object_required:['name'],
            is_required: false,
            lang: props.lang
        };
        this.btnAddCustomFilter = this._btnAddCustomFilter.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _btnAddCustomFilter(event){
        event.preventDefault();
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = this.state.object;
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object,object_required);
        if (check.error){
            this.setState({name_focus: check.field});
            return;
        }
        let param_search = this.props.param_search;
        param_search = utils.deleteQueryNotUsed(param_search);
        object['criteria'] = param_search;

        let menu_code = '';
        let pathname = window.location.pathname;
        let menu = this.props.sys.menu ? this.props.sys.menu : {};
        Object.keys(this.props.sys.menu).forEach((name) => {
            if(menu[name].url === pathname){
                menu_code = menu[name].code;
            }else if(menu[name].child){
                menu[name].child.forEach((item) => {
                    if(item.url === pathname){
                        menu_code = item.code;
                    }
                })
            }
        });
        object['menu_code'] = menu_code;

        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_CUSTOM_FILTER_ADD, object);
        this.props.uiAction.showLoading();
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
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
        if (newProps.api[ConstantURL.API_URL_POST_CUSTOM_FILTER_ADD]){
            let response = newProps.api[ConstantURL.API_URL_POST_CUSTOM_FILTER_ADD];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('CustomFilter');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CUSTOM_FILTER_ADD);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        return (
            <form onSubmit={this.btnAddCustomFilter}>
                <div className="dialog-popup-body">
                    <div id="formCreatContainer" style={{minHeight:"250px", height:"40vh"}}>

                            <div className="form-container row">
                                <div className="col-sm-12 col-xs-12 mb15">
                                    <Input2 type="text" name="name" label="Tên bộ lọc" required={true}
                                           error={this.state.object_error.name} value={this.state.object.name} nameFocus={this.state.name_focus}
                                           onChange={this.onChange}
                                    />
                                </div>
                            </div>
                    </div>
                    <div>
                        <hr className="v-divider margin0" />
                        <div className="v-card-action">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span><T>Lưu</T></span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}
function mapStateToProps(state) {
    return {
        lang: state.language,
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

export default connect(mapStateToProps,mapDispatchToProps)(PopupCustomFilter);
