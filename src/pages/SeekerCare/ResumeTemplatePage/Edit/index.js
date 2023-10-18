import React from "react";
import {
    createResumeTemplate,
    updateResumeTemplate,
    resumeTemplateDetail
} from "api/seeker";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {subscribe} from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {asyncApi} from "api";
import queryString from "query-string";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            resume: null,
            loading: true,
            initialForm: {
                title: "title",
                field_id: "field_id",
                resume_id: "resume_id"
            }
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

        if(id > 0){
            if(_.get(history, 'action') === 'POP'){
                history.push({
                    pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                    search: '?action=detail&id=' + id
                });

                return true;
            }

            if(_.get(history, 'action') === 'PUSH'){
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "detail"
                };

                history.push({
                    pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        }else{
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE
            });
        }

        return true;
    }

    _onSubmit(data) {
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit);
        });
    }

    async submitData(data) {
        const {id} = this.state;
        const {actions, history} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateResumeTemplate(data);
        } else {
            res = await createResumeTemplate(data);
        }
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
            if(res.id){
                history.push({
                    pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                    search: '?action=detail&id=' + res.id
                });
            }else{
                history.push({
                    pathname: Constant.BASE_URL_SEEKER_CARE_RESUME_TEMPLATE,
                });
            }
        } else {
            this.setState({loading: false});
        }
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await asyncApi({
                data: resumeTemplateDetail(id)
            });

            const {data} = res;
            if (data) {
                this.setState({
                    loading: false,
                    resume: data
                });
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
        const {id, initialForm, resume, loading} = this.state;
        const data = resume;
        let fieldWarnings = [];

        const validationSchema = Yup.object().shape({
            title: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
            field_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            resume_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
        });

        const dataForm = resume ? utils.initFormValue(initialForm, data) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
                          initialValues={dataForm}
                          fieldWarnings={fieldWarnings}
                          validationSchema={validationSchema}
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
        actions: bindActionCreators({putToastSuccess}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
