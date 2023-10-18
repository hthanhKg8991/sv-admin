import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import {
    createHeadhuntSkuApplicantStatus
} from "api/headhunt";
import Dropbox from "components/Common/InputValue/Dropbox";

class PopupAddSkuApplicantStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['applicant_status_code'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);

    }

    async _onSave(data, object_required) {
        const {uiAction, idKey, sku_code} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        const params = {...object,sku_code};
        const res = await createHeadhuntSkuApplicantStatus(params);
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            uiAction.deletePopup();
            publish(".refresh", {}, idKey);
        }
        this.setState({loading: false});
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    render() {
        let {object, object_error, object_required, name_focus} = this.state;
        const {applicant_status} = this.props;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className=" row">
                                <div className="col-xs-6 mb10">
                                    <Dropbox type="text" name="applicant_status_code" label="Applicant Status"
                                             key_value={"code"}
                                             key_title={"name"}
                                             data={applicant_status}
                                            required={object_required.includes('applicant_status_code')}
                                            error={object_error.applicant_status_code} value={object.applicant_status_code} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <hr className="v-divider margin0"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddSkuApplicantStatus);
