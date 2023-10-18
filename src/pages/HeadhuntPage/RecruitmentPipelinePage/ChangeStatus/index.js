import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {updateStatusHeadhuntApplicant} from "api/headhunt";

class Edit extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: false,
            initialForm: {
                "id": "id",
                "status": "status",
                "status_reason": "status_reason",
                "status_other_reason": "status_other_reason",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {actions, idKey} = this.props;
        publish(".refreshComponent", {}, idKey + "reload");
        actions.deletePopup();
        return true;
    }

    _onSubmit(data, action) {
        if (this._isMounted) {
            const {actions} = this.props;
            const {setErrors} = action;
            const dataSubmit = _.pickBy(data, (item) => {
                return !_.isUndefined(item);
            });
            if (dataSubmit?.status_reason?.includes(Constant.HEADHUNT_APPLICATE_REASON_STATUS_OTHER) && !dataSubmit?.status_other_reason) {
                actions.putToastError("Lý do khác không được rỗng!");
                return false;
            }

            this.setState({loading: true}, () => {
                this.submitData(dataSubmit, setErrors);
            });
        }
    }

    async submitData(data, setErrors) {
        const {actions, object, idKey, checked, clearChecked} = this.props;
        if (Array.isArray(checked)) {
            data.list_id = checked;
        } else {
            data.list_id = [object?.id];
        }
        const res = await updateStatusHeadhuntApplicant(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                publish(".refresh", {}, idKey);
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
                if (clearChecked){
                    clearChecked()
                }
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const {initialForm, loading} = this.state;
        const validationSchema = Yup.object().shape({
            status: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = utils.initFormKey(initialForm);

        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={{...dataForm, status: this.props.status, lanes: this.props.lanes}}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Đóng</span>
                            </button>
                        </div>
                    </div>

                </FormBase>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
