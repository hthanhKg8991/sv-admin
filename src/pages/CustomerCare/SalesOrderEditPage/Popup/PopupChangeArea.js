import React,{Component} from "react";
import Dropbox from "components/Common/InputValue/Dropbox";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {changeJobRegisUpdateArea, changeEffectRegisUpdateArea} from "api/saleOrder";

class PopupChangeArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object),
            object_required: ['displayed_area'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction, idKey, isEffect = false} = this.props;
        this.setState({object_error: {}, name_focus: "", loading: true});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field, loading: false, object_error: check.fields});
            return;
        }
        uiAction.showLoading();
        const res = isEffect ? await changeEffectRegisUpdateArea({...object}) : await changeJobRegisUpdateArea({...object});
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish('.refresh', {}, idKey);
            uiAction.deletePopup();
        }
        uiAction.hideLoading();
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
    
    render () {
        const {object, object_error, object_required} = this.state;
        const {uiAction} = this.props
        const areas = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_area);

        return (
            <form onSubmit={(event)=>{event.preventDefault();this.onSave(object, object_required)}}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                            <Dropbox name="displayed_area" label="Chọn thông tin"
                                         data={areas || []}
                                         value={object.displayed_area}
                                         required={object_required.includes("displayed_area")}
                                         error={object_error.displayed_area}
                                         onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Xác nhận</span>
                        </button>
                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={() => uiAction.deletePopup()}>
                            <span>Đóng</span>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupChangeArea);
