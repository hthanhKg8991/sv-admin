import React from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {subscribe} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import queryString from "query-string";
import {createExtendPrograms, getDetailExtendPrograms, updateExtendPrograms} from "api/saleOrder";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "title": "title",
                "service_type": "service_type",
                "fee_type": "fee_type",
                "start_date": "start_date",
                "end_date": "end_date",
                "description": "description",
                "conditions": "conditions",
                "include_guarantee": "include_guarantee"
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
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
                    pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
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
                    pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {id} = this.state;
        const {actions, history} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateExtendPrograms(data);
        } else {
            res = await createExtendPrograms(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                if (data.id) {
                    history.push({
                        pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
                        search: '?action=detail&id=' + data.id
                    });
                } else {
                    history.push({
                        pathname: Constant.BASE_URL_CONFIG_SERVICE_GIFT,
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
            const res = await getDetailExtendPrograms({id});
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
        const fieldWarnings = [];

        const validationSchema = Yup.object().shape({
            title: Yup.string().required(Constant.MSG_REQUIRED),
            service_type: Yup.array().required(Constant.MSG_REQUIRED),
            fee_type: Yup.array().required(Constant.MSG_REQUIRED),
            start_date: Yup.date().required(Constant.MSG_REQUIRED),
            end_date: Yup.date().required(Constant.MSG_REQUIRED),
            conditions: Yup.array().of(
                Yup.object().shape({
                    left: Yup.string().required(Constant.MSG_REQUIRED),
                    operation: Yup.string().required(Constant.MSG_REQUIRED),
                    right: Yup.string().required(Constant.MSG_REQUIRED),
                })
            )
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.conditions = dataForm?.conditions?.length > 0 ? dataForm.conditions : [Constant.CONDITION_DEFAULT];

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={fieldWarnings}
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
