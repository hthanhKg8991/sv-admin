import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {createShareRoomDetail} from "api/employer";
import Dropbox from "components/Common/InputValue/Dropbox";
import {getListRoom} from "api/auth";
import * as Constant from "utils/Constant";

class FormDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_error: {},
            object_required: ['room_id'],
            room_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    async _onSave(object) {
        const {idKey, config_id} = this.props;
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
        if (!object.id) {
            res = await createShareRoomDetail({...object, config_id});
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

    async _getRoom() {
        const res = await getListRoom({status: Constant.STATUS_ACTIVED});
        if(res) {
            this.setState({
                room_list: res?.items || []
            })
        }
    }

    componentDidMount() {
        this._getRoom();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {object, object_error, object_required, name_focus, room_list} = this.state;

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
                                    <Dropbox name="room_id" label="Chọn phòng" data={room_list}
                                             required={object_required.includes('room_id')}
                                             key_value="id" key_title="name"
                                             error={object_error.room_id} value={object.room_id}
                                             nameFocus={name_focus}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormDetail);
