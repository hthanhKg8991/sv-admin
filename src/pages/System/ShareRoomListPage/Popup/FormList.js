import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {createShareRoom, updateShareRoom} from "api/employer";

class FormList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_error: {},
            object_required: ['name']
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    async _onSave(object) {
        const {idKey} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();

        let res;
        if (object.id) {
            res = await updateShareRoom(object);
        } else {
            res = await createShareRoom(object);
        }

        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.uiAction.deletePopup();
            publish(".refresh", {}, idKey);
        }
        this.props.uiAction.hideLoading();
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

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {object, object_error, object_required, name_focus} = this.state;

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12 mb30">
                                    <Input2 type="text" name="name" label="Tên"
                                            required={object_required.includes('name')}
                                            error={object_error.name} value={object.name} nameFocus={name_focus}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormList);
