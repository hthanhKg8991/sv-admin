import React, {Component} from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {getListStaff} from "api/auth";
import {createBankStaff} from "api/statement";
import {publish} from "utils/event";

class PopupAddStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['staff_id'],
            object_error: {},
            name_focus: "",
            staffList: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getStaffList = this._getStaffList.bind(this);
    }

    async _onSave(data, object_required) {
        const {uiAction, idKey} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        const params = {...object, bank_id: this.props.bank_id};
        this.setState({loading: true});
        const res = await createBankStaff(params);
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

    async _getStaffList() {
        const res = await getListStaff({
            status: Constant.STATUS_ACTIVED,
            division_code: Constant.DIVISION_TYPE_accountant_liabilities,
            per_page: 100
        });
        if (res && Array.isArray(res?.items)) {
            const staffList = res?.items.map(item => {
                return {
                    title: `${item.display_name} - ${item.login_name}`,
                    value: `${item.id}`
                };
            });
            this.setState({staffList: staffList});
        }
    }

    componentDidMount() {
        this.getStaffList();
    }

    render() {
        let {object, object_error, object_required, name_focus, staffList} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="staff_id"
                                         label="Chọn nhân viên"
                                         data={staffList}
                                         required={object_required.includes('staff_id')}
                                         error={object_error.staff_id}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                         value={null}
                                />
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddStaff);
