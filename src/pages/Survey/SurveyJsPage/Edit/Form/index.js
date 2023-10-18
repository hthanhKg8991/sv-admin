import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SurveyJs from "pages/Survey/SurveyJsPage/Edit/SurveyJs";
import {bindActionCreators} from "redux";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {createSurveyJsQuestion, getDetailSurveyJsQuestion, updateSurveyJsQuestion} from "api/survey";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: false,
            item: null,
            question: null,
            initialForm: {
                "id": "id",
                "code": "code",
                "title": "title",
                "description": "description",
                "question": "question",
                "type": "type",
                "group_survey_id":"group_survey_id"
            },
        };
        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.triggerSubmit = this._triggerSubmit.bind(this);
        this.btnSubmitRef = React.createRef();
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SURVEY,
            search: '?action=list'
        });
        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        this.setState({loading: true}, () => {
            this.submitData(data, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {id, question} = this.state;
        const {actions, history} = this.props;
        data.question = question || data.question;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateSurveyJsQuestion(data);
        } else {
            res = await createSurveyJsQuestion(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                if (data.id) {
                    history.push({
                        pathname: Constant.BASE_URL_SURVEY,
                        search: '?action=edit&id=' + data.id
                    });
                    this.setState({id: data.id, item: data});
                } else {
                    history.push({
                        pathname: Constant.BASE_URL_SURVEY,
                    });
                }
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async _asyncData() {
        const {id} = this.state;
        this.setState({loading: true});
        const res = await getDetailSurveyJsQuestion({id});
        if (res) {
            this.setState({item: res});
        }
        this.setState({loading: false});
    }

    _triggerSubmit(value) {
        this.setState({question: value});
        this.btnSubmitRef.current.click();
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this._asyncData();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps?.question) {
            this.triggerSubmit(nextProps?.question);
        }
    }

    render() {
        const {initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            code: Yup.string().required(Constant.MSG_REQUIRED),
            title: Yup.string().required(Constant.MSG_REQUIRED),
            type: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            group_survey_id: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        const {channel_code} = this.props.branch.currentBranch;

        const url = parseInt(item?.type) === Constant.SURVEY_TYPE_INTERNAL ?
            `${Constant.BASE_URL_SURVEY}?action=detail&id=${item?.id}` :
            `${Constant.URL_FE[channel_code]}/survey/${item?.code}`;

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small" ref={this.btnSubmitRef}>
                                <span>Lưu</span>
                            </button>
                            <a type="button" className="el-button el-button-info el-button-small" href={url} target="_blank" rel="noopener noreferrer">
                                <span>Preview</span>
                            </a>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>
                    <SurveyJs/>
                </FormBase>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
