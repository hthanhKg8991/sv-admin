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
    createExperiment,
    getDetailExperiment,
    updateExperiment
} from "api/experiment";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "id": "id",
                "code": "code",
                "name": "name",
                "description": "description",
                "audience_segment_id": "audience_segment_id",
                "audience_conditions": "audience_conditions",
                "project_id": "project_id",
                "type": "type",
                "experiment_exclude": "experiment_exclude",
                "traffic": "traffic",
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_EXPERIMENT_EXPERIMENT,
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
                    pathname: Constant.BASE_URL_EXPERIMENT_EXPERIMENT,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_EXPERIMENT_EXPERIMENT
            });
        }

        return true;
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
        const {id} = this.state;
        const {actions, history} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateExperiment(data);
        } else {
            res = await createExperiment(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                if (data.id) {
                    this.setState({id: data.id});
                    await this.asyncData();
                    history.push({
                        pathname: Constant.BASE_URL_EXPERIMENT_EXPERIMENT,
                        search: '?action=edit&id=' + data.id
                    });
                } else {
                    history.push({
                        pathname: Constant.BASE_URL_EXPERIMENT_EXPERIMENT,
                    });
                }
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
            const res = await getDetailExperiment({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        } else {
            this.setState({loading: false});
        }
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
            project_id: Yup.string().required(Constant.MSG_REQUIRED),
            code: Yup.string().required(Constant.MSG_REQUIRED),
            name: Yup.string().required(Constant.MSG_REQUIRED),
            type: Yup.string().required(Constant.MSG_REQUIRED),
            description: Yup.string().required(Constant.MSG_REQUIRED),
            traffic: Yup.number().typeError(Constant.MSG_TYPE_VALID),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.audience_conditions = dataForm?.audience_conditions?.length > 0 ? dataForm.audience_conditions : [Constant.CONDITION_DEFAULT];
        dataForm.experiment_exclude = dataForm?.experiment_exclude?.length > 0 ? dataForm.experiment_exclude : [Constant.EXPERIMENT_EXCLUDE_DEFAULT];
        dataForm.traffic = id > 0 ? dataForm.traffic : 100;
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
