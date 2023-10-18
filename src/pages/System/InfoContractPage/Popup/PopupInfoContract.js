import React, { Component } from "react";
import Ckeditor from 'components/Common/InputValue/Ckeditor';
import Input2 from 'components/Common/InputValue/Input2';
import Dropbox from 'components/Common/InputValue/Dropbox';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";

class PopupInfoContract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            object: {},
            //object: Object.assign({}, props.object),
            object_required: ['representative', 'room_id', 'position', 'phone', 'tax_code', 'address'],
            object_error: {},
            name_focus: "",
            room_list: [],
            isAdd: props.isAdd,

        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getRoom = this._getRoom.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }

    _onSave(data, object_required) {
        this.setState({ object_error: {} });
        this.setState({ name_focus: "" });

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({ name_focus: check.field });
            this.setState({ object_error: check.fields });
            return;
        }
        this.props.uiAction.showLoading();
        if (!_.has(object, "id")) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_INFO_CONTRACT_CREATE, object);
        } else {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_INFO_CONTRACT_UPDATE, object);
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({ object: object });
    }

    _getRoom() {
        let args = {
            'status': Constant.STATUS_ACTIVED,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_LIST, args);
    }

    _getDetail() {
        let args = {
            'id': this.state.id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_INFO_CONTRACT_DETAIL, args);
    }

    componentDidMount() {
        this.getRoom();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_INFO_CONTRACT_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_INFO_CONTRACT_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('RoomPage');
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_INFO_CONTRACT_CREATE);
        }

        if (newProps.api[ConstantURL.API_URL_POST_INFO_CONTRACT_UPDATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_INFO_CONTRACT_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('RoomPage');
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_INFO_CONTRACT_UPDATE);
        }

        if (newProps.api[ConstantURL.API_URL_GET_INFO_CONTRACT_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_INFO_CONTRACT_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ object: response.data || [] });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_INFO_CONTRACT_DETAIL);
        }

        if (newProps.api[ConstantURL.API_URL_GET_ROOM_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ room_list: response.data.items || [] });
                //tạm gọi theo tuần tự, fix lại cơ chế gọi promise all
                if (this.state.id) {
                    this.getDetail();
                }
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }

    render() {
        let { object, object_error, object_required, name_focus, room_list , isAdd} = this.state;
        return (
            <form onSubmit={(event) => {event.preventDefault();this.onSave(object, object_required);}}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">

                            <div className="row-content">
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Input2 type="text"
                                            name="representative"
                                            label="Đại diện"
                                            required={_.includes(object_required, "representative")}
                                            value={_.get(object, "representative", null)}
                                            error={object_error.representative}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Input2 type="text"
                                            name="position"
                                            label="Vị trí"
                                            required={_.includes(object_required, "position")}
                                            value={_.get(object, "position", null)}
                                            error={object_error.position}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="row-content">
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Input2 type="text"
                                            name="phone"
                                            label="Số điện thoại"
                                            required={_.includes(object_required, "phone")}
                                            value={_.get(object, "phone", null)}
                                            error={object_error.phone}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Input2 type="text"
                                            name="tax_code"
                                            label="Mã số thuế"
                                            required={_.includes(object_required, "tax_code")}
                                            value={_.get(object, "tax_code", null)}
                                            error={object_error.tax_code}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 mb15">
                                <Dropbox name="room_id"
                                              label="Chọn phòng"
                                              key_value="id"
                                              key_title="name"
                                              data={room_list}
                                              required={_.includes(object_required, "room_id")}
                                              error={object_error.room_id}
                                              value={object.room_id}
                                              onChange={this.onChange}
                                              readOnly={!!this.state.id}
                                />
                            </div>

                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="address"
                                        label="Địa chỉ"
                                        required={_.includes(object_required, "address")}
                                        value={_.get(object, "address", null)}
                                        error={object_error.address}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>

                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="title_article_1"
                                        label="Điều 1"
                                        required={_.includes(object_required, "title_article_1")}
                                        value={_.get(object, "title_article_1", null)}
                                        error={object_error.title_article_1}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                {(isAdd || object?.content_1) && (
                                    <Ckeditor name="content_1"
                                       label="Nội dung"
                                       height={100}
                                       required={object_required.includes('content_1')}
                                       toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                       value={object.content_1}
                                       error={object_error.content_1}
                                       onChange={this.onChange}
                                    />
                                )}

                            </div>

                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="title_article_2"
                                        label="Điều 2"
                                        required={_.includes(object_required, "title_article_2")}
                                        value={_.get(object, "title_article_2", null)}
                                        error={object_error.title_article_2}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                {(isAdd || object?.content_2) && (
                                    <Ckeditor name="content_2"
                                              label="Nội dung"
                                              height={100}
                                              required={object_required.includes('content_2')}
                                              toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                              value={object.content_2}
                                              error={object_error.content_2}
                                              onChange={this.onChange}
                                    />
                                )}
                            </div>

                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="title_article_3"
                                        label="Điều 3"
                                        required={_.includes(object_required, "title_article_3")}
                                        value={_.get(object, "title_article_3", null)}
                                        error={object_error.title_article_3}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                {(isAdd || object?.content_3) && (
                                    <Ckeditor name="content_3"
                                              label="Nội dung"
                                              height={100}
                                              required={object_required.includes('content_3')}
                                              toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                              value={object.content_3}
                                              error={object_error.content_3}
                                              onChange={this.onChange}
                                    />
                                )}
                            </div>

                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="title_article_4"
                                        label="Điều 4"
                                        required={_.includes(object_required, "title_article_4")}
                                        value={_.get(object, "title_article_4", null)}
                                        error={object_error.title_article_4}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                {(isAdd || object?.content_4) && (
                                    <Ckeditor name="content_4"
                                              label="Nội dung"
                                              height={100}
                                              required={object_required.includes('content_4')}
                                              toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                              value={object.content_4}
                                              error={object_error.content_4}
                                              onChange={this.onChange}
                                    />
                                )}

                            </div>

                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="title_article_5"
                                        label="Điều 5"
                                        required={_.includes(object_required, "title_article_5")}
                                        value={_.get(object, "title_article_5", null)}
                                        error={object_error.title_article_5}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                {(isAdd || object?.content_5) && (
                                    <Ckeditor name="content_5"
                                              label="Nội dung"
                                              height={100}
                                              required={object_required.includes('content_5')}
                                              toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                              value={object.content_5}
                                              error={object_error.content_5}
                                              onChange={this.onChange}
                                    />
                                )}
                            </div>

                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="title_article_6"
                                        label="Điều 6"
                                        required={_.includes(object_required, "title_article_6")}
                                        value={_.get(object, "title_article_6", null)}
                                        error={object_error.title_article_6}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                {(isAdd || object?.content_6) && (
                                    <Ckeditor name="content_6"
                                              label="Nội dung"
                                              height={100}
                                              required={object_required.includes('content_6')}
                                              toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                              value={object.content_6}
                                              error={object_error.content_6}
                                              onChange={this.onChange}
                                    />
                                )}
                            </div>

                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit"
                                className="el-button el-button-success el-button-small">
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupInfoContract);
