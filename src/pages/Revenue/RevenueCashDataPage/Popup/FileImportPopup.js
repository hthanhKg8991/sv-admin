import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FileImportPopupFormComponent from "./FileImportPopupFormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {importDataCashV2} from "api/commission";
import {deletePopup} from "actions/uiAction";

class FileImportPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: {
                file: null,
            },
            loading: true,
            pathFile: null,
            fileInfo: null,
            initialForm: {
                "config_id": "config_id",
                "file": "file"
            },
        };

        this.btnSubmit = React.createRef();

        this.onSubmit = this._onSubmit.bind(this);
        this.onSaveExport = this._onSaveExport.bind(this);
    }

    _onSubmit(data) {
        const {actions} = this.props
        const {setErrors} = actions;
        
        if(!data?.file){
            actions.putToastError("Vui lòng chọn file để import!")
            return;
        }

        const {name, size} = data.file;
        const ext = name?.split(".").pop();
        if(size > Constant.EXTENSION_FILE_SIZE_LIMIT){
            actions.putToastError("File import quá lớn! \n Dung lượng tối đa là 10MB!");
            event.target.value = ""
        }
        else if(Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
            const dataSumbit = _.pickBy(data, (item) => {
                return !_.isUndefined(item);
            });
            this.setState({loading: true}, () => {
                this.submitData(dataSumbit, setErrors);
            });
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
        }
    }

    async submitData(data) {
        const {actions, idKey} = this.props;
        let fileData = new FormData();
        fileData.append("file", data?.file);
        fileData.append("config_id", data?.config_id);
        const body = {file: fileData,up_file: true};
        const resImport = await importDataCashV2(body);
        this.setState({loading: false});
        if(resImport) {
            actions.putToastSuccess(`Import thành công!`);
            if(resImport?.url){
                window.open(resImport?.url, '_blank')
            }
            publish(".refresh", {}, idKey);
            actions.deletePopup()
        }
    }

    _onSaveExport() {
        this.setState({isDraft: false}, () => {
            this.btnSubmit.current.click();
        });
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const {initialForm, item, loading} = this.state;
        const {actions} = this.props

        const validationSchema = Yup.object().shape({
            config_id: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FileImportPopupFormComponent}
                >
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="button" className="el-button el-button-success el-button-small"
                                    onClick={this.onSaveExport}>
                                <span>Xác nhận</span>
                            </button>
                            <button type="submit" className="d-none" ref={this.btnSubmit}>Lưu</button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => actions.deletePopup()}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>

                </FormBase>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(FileImportPopup);
