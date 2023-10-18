import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as utils from "utils/utils";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import {createPriceList, updatePriceList,} from "api/saleOrderV2";
import Input2 from "components/Common/InputValue/Input2";
import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import moment from "moment";

class PopupAddPriceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: props.object,
            object_required: ['title', 'start_date', 'end_date'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    async _onSave(data, object_required) {
        this.setState({object_error: {}, name_focus: ""});
        const {uiAction, idKey} = this.props;
        const object = Object.assign({}, data);
        const check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }

        this.setState({loading: true});

        const params = {...object};
        let res;
        if (Number(object?.id) > 0) {
            res = await updatePriceList(params);
        } else {
            res = await createPriceList(params);
        }

        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKey);
            uiAction.deletePopup();
        }
        this.setState({loading: false});
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object_error: object_error, name_focus: ""});
        this.setState({object: object});
    }

    render() {
        const {object, object_error, object_required, name_focus} = this.state;

        const minDate = object.start_date ? moment.unix(object.start_date) : moment();

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className="row">
                                <div className="col-xs-12 mb10">
                                    <Input2 type="text" name="title"
                                            label="Tên bảng giá"
                                            required={object_required.includes('title')}
                                            error={object_error.title}
                                            value={object.title}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6 mb10">
                                    <DateTimePicker name="start_date"
                                                    label="Ngày bắt đầu"
                                                    minDate={moment()}
                                                    required={object_required.includes('start_date')}
                                                    error={object_error.start_date}
                                                    value={object.start_date} nameFocus={name_focus}
                                                    onChange={this.onChange}/>
                                </div>
                                <div className="col-xs-6 mb10">
                                    <DateTimePicker name="end_date"
                                                    label="Ngày kết thúc"
                                                    minDate={minDate}
                                                    required={object_required.includes('end_date')}
                                                    error={object_error.end_date}
                                                    value={object.end_date} nameFocus={name_focus}
                                                    onChange={this.onChange}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddPriceList);
