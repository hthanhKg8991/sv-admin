import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {getListRoomItems, getMembers} from "api/auth";
import {uploadFile} from "api/cdn";
import {bindActionCreators} from 'redux';
import {putToastError, putToastSuccess} from "actions/uiAction";
import {getListCustomer} from "api/employer";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {Prompt} from "react-router-dom";
import MySelect from "components/Common/Ui/Form/MySelect";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isImport: true,
            fileInfo: null,
            staffIds: [],
        };
        this.textInput = React.createRef();
        this.onImportFile = this._onImportFile.bind(this);
        this.onUploadFle = this._onUploadFle.bind(this);
        this.onRemove = this._onRemove.bind(this);
    }

    _onRemove() {
        const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa?");
        if (!isConfirm) {
            return false;
        }
        const {fnCallBack, setFieldValue} = this.props;
        this.setState({fileInfo: null});
        setFieldValue("url_file", null);
        fnCallBack(null);
    }

    async _getAssignmentStaff(roomId) {
        let staffIds = [];
        if (roomId) {
            const res = await getMembers({room_id: roomId, status: Constant.STATUS_ACTIVED});
            if (res && Array.isArray(res)) {
                staffIds = res.map(item => {
                    return {label: item?.login_name, value: item?.id}
                });
            }
        }
        this.setState({staffIds: staffIds});
    }

    _onImportFile() {
        this.textInput.current.click();
    }

    async _onUploadFle(event) {
        const {fnCallBack} = this.props;
        const {actions} = this.props;
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.setState({isImport: false});
        const {name} = file;
        const ext = name?.split(".").pop();
        if (Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
            const args = {
                folder: "request-employer",
                image: file,
                name: name
            };
            const res = await uploadFile(args);
            if (res) {
                const {path_file} = res;
                fnCallBack(path_file);
                actions.putToastSuccess("Upload file thành công");
                this.setState({fileInfo: res});
            }
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
        }
        this.setState({isImport: true});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps?.values !== this.props?.values) {
            const {values} = this.props;
            this._getAssignmentStaff(values?.room_id);
        }
    }


    render() {
        const {isImport, fileInfo, staffIds} = this.state;
        const {values, isEdit} = this.props;
        const isBlock = (values?.room_id.length > 0 || values?.note.length > 0 || values?.customer_ids.length > 0) && !isEdit;
        return (
            <React.Fragment>
                <Prompt when={isBlock} message="Thông tin đã được nhập, bạn có chắc chắn hủy yêu cầu?"/>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"room_id"} label={"Phòng"}
                                       fetchApi={getListRoomItems}
                                       fetchField={{value: "id", label: "name"}}
                                       fetchFilter={{per_page: 1000, is_role: true}}
                                       showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"note"} label={"Ghi chú"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelect name={"assigned_staff_ids"} label={"CSKH"}
                                  options={staffIds || []}
                                  isMulti
                                  />
                    </div>
                </div>
                <div className="row mt10 mb10">
                    <div className="col-sm-12 sub-title-form">
                        <span>Thông tin Company</span>
                    </div>
                </div>
                <div className="row mt10 mb10">
                    <div className="col-md-12">
                        <p className="mb5">
                            <b>Danh sách Company:</b>
                            {isImport && <input type="file" ref={this.textInput} className="form-control mb10 hidden"
                                                onChange={this.onUploadFle}/>}
                            <span className="ml10 text-link"
                                  onClick={this.onImportFile}>
                                Chọn file <i className="glyphicon glyphicon-upload"/>
                            </span>
                            <span className="ml10 cursor-pointer text-danger"
                                  onClick={this.onRemove}>
                                Xóa file <i className="glyphicon glyphicon-remove"/>
                            </span>
                        </p>
                        <p className="ml10 mb5">Đường dẫn file:
                            {fileInfo && (
                                <a className="ml10 text-warning" href={fileInfo.url} download>{fileInfo.url}</a>
                            )}
                            {!fileInfo && values.url_file && (
                                <a className="ml10 text-warning" href={values.url_file} download>{values.url_file}</a>
                            )}
                        </p>
                        <p className="ml10 mb5">
                            <i className="mt10">(File Excel cột đầu tiên (Cột A) phải là mã code (Mã số thuế hoặc
                                CMND)</i>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <MySelectSearch
                            name={"customer_ids"}
                            label={"Tên company"}
                            searchApi={getListCustomer}
                            defaultQuery={{room_id: values?.room_id, assigned_staff_id: values?.assigned_staff_id || null}}
                            valueField={"code"}
                            labelField={"name"}
                            isMulti
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);
