import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import Dropbox from "components/Common/InputValue/Dropbox";
import {getInfoContractList} from "api/saleOrder";
import * as utils from "utils/utils";
import {printSalesOrderOriginalV2} from "api/saleOrderV2";
import PopupPrintContract from "pages/SalesOrder/SalesOrderEditPage/Popup/PopupContract";

class PopupSelectContract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['room_id'],
            object_error: {},
            name_focus: "",
            list_contract: [],
        };
        this.getListInfoContract = this._getListInfoContract.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onSave = this._onSave.bind(this);
    }

    async _onSave(data, object_required) {
        const {uiAction, sales_order} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        uiAction.showLoading();
        const res = await printSalesOrderOriginalV2({id: sales_order.id, is_preview: 1, room_id: data.room_id});
        if (res) {
            uiAction.createPopup(PopupPrintContract, "Xem trước hợp đồng", {
                object: sales_order,
                html: res.html,
                room_id: data.room_id
            }, 'popup-preview-a4');
        }
        uiAction.hideLoading();
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

    async _getListInfoContract() {
        const res = await getInfoContractList({per_page: 100});
        if (res?.items) {
            this.setState({list_contract: res.items});
        }
    }

    componentDidMount() {
        this.getListInfoContract();
    }

    render() {
        let {object, object_error, object_required, name_focus, list_contract} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object,object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className="row">
                                <div className="col-xs-12 mb10">
                                    <Dropbox name="room_id" label="Chọn thôn tin" data={list_contract}
                                             key_title={"room_name"} key_value={"room_id"}
                                             required={object_required.includes('room_id')}
                                             error={object_error.room_id}
                                             value={object.room_id} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupSelectContract);
