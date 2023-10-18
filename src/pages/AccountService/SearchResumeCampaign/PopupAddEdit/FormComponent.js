import React from "react";
import { connect } from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MySelect from "components/Common/Ui/Form/MySelect";
import { getList, getListJobItems } from "api/employer";
import { uploadFileV3 } from "api/cdn";
import * as Constant from "utils/Constant";
import { bindActionCreators } from "redux";
import { putToastSuccess, putToastError } from "actions/uiAction";
class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listJobPost: [],
            nameFile: props?.values?.file
        };

        this.loadListJobPost = this._loadListJobPost.bind(this);
        this.textInput = React.createRef();
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onImportFile = this._onImportFile.bind(this);
        this.removeChooseFile = this._removeChooseFile.bind(this);
    }

    async _loadListJobPost(employer_id) {
        if (employer_id) {
            const { channel_code } = this.props;
            const param = { employer_id, job_status: Constant.STATUS_ACTIVED, per_page: 1000 };
            if (channel_code) {
                param.channel_code = channel_code;
            }
            const res = await getListJobItems({
                ...param
            });
            if (res) {
                this.setState({
                    listJobPost: res?.map(item => ({ value: item.id, label: item.title })) || []
                })
            }
        } else {
            this.props.setFieldValue("job_id", "")
            this.setState({
                listJobPost: []
            })
        }
    }

    async _onChangeFileImport(event) {
        const { actions, setFieldValue } = this.props;
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        if (file?.size > Constant.EXTENSION_FILE_SIZE_LIMIT) {
            actions.putToastError(
                "File import quá lớn! \n Dung lượng tối đa là 10MB!"
            );
            event.target.value = "";
        }
        this.setState({ isImport: false });
        const { name } = file;
        const ext = name?.split(".").pop();

        if (Constant.ASSIGNMENT_UPLOAD_TYPE.includes(ext)) {
            this.setState({
                nameFile: name
            })
            let data = new FormData();
            data.append("file", file);
            const body = { file: data };
            const resImport = await uploadFileV3(body);
            setFieldValue("file", resImport?.path_file);
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file hình ảnh,.doc,.docx,.pdf");
        }
        this.setState({ isImport: true });
    }

    _removeChooseFile() {
        const { setFieldValue } = this.props;
        this.textInput.current.value = "";
        setFieldValue("file", "")
        this.setState({
            nameFile: ""
        })
    }

    async _onImportFile() {
        this.textInput.current.click();
    }

    componentDidMount() {
        const { values } = this.props;
        if (values.employer_id) {
            this.loadListJobPost(values.employer_id)
        }
    }

    render() {
        const { values, fieldWarnings, channel_code } = this.props;
        const { listJobPost, nameFile } = this.state;

        const defaultQuery = {
            status_not: [Constant.STATUS_DISABLED, Constant.STATUS_LOCKED, Constant.STATUS_DELETED],
            per_page: 10,
            page: 1,
        }
        if (channel_code) {
            defaultQuery.channel_code = channel_code;
        }

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField name={"name"} label={"Tên Campaign"} isWarning={_.includes(fieldWarnings, 'name')} showLabelRequired />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 mb10 custom-my-select-search">
                        <MySelectSearch
                            name={"employer_id"}
                            label={"Nhà tuyển dụng"}
                            searchApi={getList}
                            valueField={"id"}
                            labelField={"email"}
                            defaultQuery={{ ...defaultQuery }}
                            initKeyword={values?.employer_id}
                            isWarning={_.includes(fieldWarnings, 'employer_id')}
                            onChange={(value) => this.loadListJobPost(value)}
                            showLabelRequired />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 mb10">
                        <MyFieldNumber
                            name={"quantity_cv"}
                            label={"Số CVs yêu cầu"}
                            isWarning={_.includes(fieldWarnings, 'quantity_cv')}
                            showLabelRequired />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 mb10 custom-my-select-search">
                        <MySelect
                            name={"job_id"}
                            label={"Chọn tin đăng"}
                            options={listJobPost || []}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 mb10">
                        <MyField name={"content"} label={"Nội dung yêu cầu"} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 mb10 mt10">
                        <span>File đính kèm</span>
                        <input type="file" ref={this.textInput} className="form-control mb10 hidden"
                            onChange={this.onChangeFileImport} />
                        <button type="button" className="el-button el-button-small ml10"
                            onClick={this.onImportFile}>
                            <span>Import file <i className="glyphicon glyphicon-upload" /></span>
                        </button>
                        <span className="ml10">{nameFile}</span>
                        {
                            nameFile &&
                            <button className="close" style={{ opacity: 1 }} type="button" onClick={this.removeChooseFile}>
                                <span style={{ color: "red", marginLeft: "10px", fontSize: "27px" }}>×</span>
                            </button>
                        }
                    </div>
                </div>

            </React.Fragment>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess, putToastError }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);
