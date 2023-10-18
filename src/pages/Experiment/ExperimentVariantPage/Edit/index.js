import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {publish, subscribe} from "utils/event";
import {deletePopup, putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {getListExperimentVariant, saveMultiExperimentVariant} from "api/experiment";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "experiment_id": "experiment_id",
                "data": "data",
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    _onClose() {
        const {actions} = this.props;
        actions.deletePopup();
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions} = this.props;
        data.experiment_id = this.props.experiment_id;
        const res = await saveMultiExperimentVariant(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                publish(".refresh", {}, "ExperimentVariantList");
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {experiment_id} = this.props;
        const res = await getListExperimentVariant({experiment_id: experiment_id});
        if (res && Array.isArray(res.items)) {
            this.setState({item: {data: res.items}, loading: false});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {id, initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            data: Yup.array().of(
                Yup.object().shape({
                    code: Yup.string().required(Constant.MSG_REQUIRED),
                    name: Yup.string().required(Constant.MSG_REQUIRED),
                    percent: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
                })
            )
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.data = dataForm?.data?.length > 0 ? dataForm.data : [Constant.EXPERIMENT_VARIANT_DEFAULT];

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.onClose()}>
                                <span>Đóng</span>
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

export default connect(null, mapDispatchToProps)(Edit);
