import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import Dropbox from 'components/Common/InputValue/Dropbox';
import Ckeditor from 'components/Common/InputValue/Ckeditor';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PopupDocumentGuide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_error: {},
            object_required: ['document_source', 'document_kind','document_name', 'title', 'description', 'status'],
            parent_list: [],
            document_kind_change: props.object ? props.object.document_kind : null,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onUpFile = this._onUpFile.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getParentList = this._getParentList.bind(this);
    }

    _onSave(object) {
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();

        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_DOCUMENT_GUIDE_CREATE, object);
        } else {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_DOCUMENT_GUIDE_UPDATE, object);
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        if (name === "document_kind") {
            this.setState({document_kind_change: value}, () => {
                this.setState({object: object});
            });
        } else {
            this.setState({object: object});
        }
    }

    _onUpFile(event) {
        let files = event.target.files[0];
        let data = new FormData();
        data.append('data', files);
        data.append('folder', 'document_guide');
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiCdnDomain, ConstantURL.API_URL_UPLOAD_IMAGE, {
            up_file: true,
            file: data
        });
        this.inputFile.value = null;
    }

    _getDetail(id) {
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_DOCUMENT_GUIDE_DETAIL, {id: id});
    }

    _getParentList() {
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_DOCUMENT_GUIDE_PARENT_LIST, {});
    }

    componentWillMount() {
        let {object} = this.props;
        if (object) {
            this.getDetail(object.id);
        }
        this.getParentList();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DOCUMENT_GUIDE_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DOCUMENT_GUIDE_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({object: response.data});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DOCUMENT_GUIDE_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_DOCUMENT_GUIDE_PARENT_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DOCUMENT_GUIDE_PARENT_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({parent_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DOCUMENT_GUIDE_PARENT_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('DocumentGuidePage');
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DOCUMENT_GUIDE_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_UPDATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('DocumentGuidePage');
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DOCUMENT_GUIDE_UPDATE);
        }
        if (newProps.api[ConstantURL.API_URL_UPLOAD_IMAGE]) {
            let response = newProps.api[ConstantURL.API_URL_UPLOAD_IMAGE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({imageUrl: utils.urlFile(response.data.url, config.urlCdnFile)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_UPLOAD_IMAGE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        let {object, object_error, object_required, name_focus, imageUrl, parent_list, document_kind_change} = this.state;
        let device_type = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_device_type);
        let document_kind = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_document_kind);
        let visible_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_visible_status);
        let document_guide_page = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_document_guide_page);
        // 1.filter exclude seft id and document type
        // 2.if parrent_id set null array
        const parent_list_include = object.id && !object.parent_id ? [] : parent_list.filter(item => {
            return String(item.id) !== String(object.id) && (item.document_kind).toLowerCase() === document_kind_change
        });
        //Tạm off Mobile chỉ lấy PC
        const firstDataSource = device_type ? [device_type?.shift()] : [];
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="document_source" label="Phiên bản" data={firstDataSource} // Off mục trên Mobile vì Mobile k cần
                                             required={object_required.includes('document_source')}
                                             value={object.document_source} error={object_error.document_source}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="document_kind" label="Đối tượng" data={document_kind}
                                             required={object_required.includes('document_kind')}
                                             value={object.document_kind} error={object_error.document_kind}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="title" label="Tiêu đề"
                                        required={object_required.includes('title')}
                                        error={object_error.title} value={object.title} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="document_name" label="Tên tính năng"
                                        required={object_required.includes('document_name')}
                                        error={object_error.document_name} value={object.document_name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="parent_id" label="Danh mục cha" data={parent_list_include}
                                         required={object_required.includes('parent_id')}
                                         key_value="id" key_title="title"
                                         value={object.parent_id} error={object_error.parent_id} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Ckeditor name="description" label="nội dung" height={300}
                                          required={object_required.includes('description')}
                                          toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                          value={object.description} error={object_error.description}
                                          onChange={this.onChange}
                                />
                            </div>
                            {imageUrl && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="imageUrl" label="" readOnly value={imageUrl}/>
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 mb10">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={() => {
                                            this.inputFile.click()
                                        }}>
                                    <span>Lấy link ảnh cho nội dung (nếu có)</span>
                                </button>
                                <input type="file" name="file" className="hidden" ref={input => this.inputFile = input}
                                       onChange={this.onUpFile}/>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="status" label="Trạng thái" data={visible_status}
                                         required={object_required.includes('status')}
                                         value={object.status} error={object_error.status} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="page_display" label="Trang gắn link" data={document_guide_page}
                                         required={object_required.includes('page_display')}
                                         value={object.page_display} error={object_error.page_display}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupDocumentGuide);
