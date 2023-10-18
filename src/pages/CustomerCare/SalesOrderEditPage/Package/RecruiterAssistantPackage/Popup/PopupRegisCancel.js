import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as apiFn from 'api';
import config from 'config';

class PopupRegisCancel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object),
            object_required: ['rejected_note'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, this.state.object);
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, this.props.url_reject, object);
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

    componentWillReceiveProps(newProps) {
        let url_reject = this.props.url_reject;
        const {idKey} = this.props;
        if (newProps.api[url_reject]){
            let response = newProps.api[url_reject];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(this.props.refresh_page,{...this.state.object});
                this.props.fallback()
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(url_reject);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {object, object_error, object_required, name_focus} = this.state;

        return (
            <form onSubmit={(event)=>{event.preventDefault();}}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="rejected_note" label="Lý do hạ" required={object_required.includes('rejected_note')}
                                        error={object_error.rejected_note} value={object.rejected_note} nameFocus={name_focus}
                                        onChange={this.onChange} />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onSave}>
                            <span>Xác nhận</span>
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
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupRegisCancel);
