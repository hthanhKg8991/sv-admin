import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import {subscribe} from "utils/event";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    createMultiRequestAssignmentEmployer,
    getMultiRequestAssignmentDetail,
    updateMultiRequestAssignmentEmployer,
} from "api/employer";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            pathFile: null,
            isDraft: null,
            initialForm: {
                "room_id": "room_id",
                "team_id": "team_id",
                "assigned_staff_id": "assigned_staff_id",
            },
        };

        this.btnSubmit = React.createRef();

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.onUploadSuccess = this._onUploadSuccess.bind(this);
        this.onSaveDraft = this._onSaveDraft.bind(this);
        this.onSaveExport = this._onSaveExport.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_TOOL_TRANSFER_PROCESS,
                    search: '?action=list'
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "list"
                };

                history.push({
                    pathname: Constant.BASE_URL_TOOL_TRANSFER_PROCESS,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_TOOL_TRANSFER_PROCESS
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    _onUploadSuccess(path) {
        this.setState({
            pathFile: path
        })
    }

    async submitData(data, setErrors) {
        const {actions} = this.props;
        const {id, isDraft, pathFile, item} = this.state;
        let res;
        data.is_draft = isDraft;
        data.path = !pathFile ? (!data?.url_file ? null : item?.path) : pathFile;
        if(!data.path) {
            actions.putToastError("Vui lòng chọn file import!");
            this.setState({loading: false});
            return false;
        }
        if (id > 0) {
            data.id = id;
            res = await updateMultiRequestAssignmentEmployer(data);
        } else {
            res = await createMultiRequestAssignmentEmployer(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                this.setState({id: data?.id});
                this.asyncData();
                this.goBack();
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getMultiRequestAssignmentDetail({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        } else {
            this.setState({loading: false});
        }
    }

    _onSaveDraft() {
        this.setState({isDraft: true}, () => {
            this.btnSubmit.current.click();
        });
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
        const {id, initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            room_id: Yup.number().required(Constant.MSG_REQUIRED),
            team_id: Yup.number().required(Constant.MSG_REQUIRED),
            assigned_staff_id: Yup.number().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.url_file = item?.url_file || null;

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>
                }

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}
                          fnCallBack={this.onUploadSuccess}
                >
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="button" className="el-button el-button-success el-button-small"
                                    onClick={this.onSaveDraft}>
                                <span>Lưu nháp</span>
                            </button>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onSaveExport}>
                                <span>Xác nhận chuyển</span>
                            </button>
                            <button type="submit" className="d-none" ref={this.btnSubmit}>Lưu</button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack(id)}>
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
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);