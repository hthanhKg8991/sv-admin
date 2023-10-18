import React from "react";
import {subscribe} from "utils/event";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {connect} from "react-redux";
import _ from "lodash";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import {createCallLine, getDetailCallLine, updateCallLine} from "api/call";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "line": "line",
                "team_id": "team_id",
                "staff_name": "staff_name",
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

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_QA_CALL_LINE_STATISTIC
        });
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
        data.staff_id = null;
        data.team_name = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_team_call_line).find(t => t.value === data.team_id)?.title;
        if (id > 0) {
            data.id = id;
            res = await updateCallLine(data);
        } else {
            res = await createCallLine(data);
        }
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
                history.push({
                    pathname: Constant.BASE_URL_QA_CALL_LINE_STATISTIC,
                });
            });
        } else {
            this.setState({loading: false});
        }
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetailCallLine({line: id});
            if(res) {
                this.setState({item: res,  loading: false});
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
        const {initialForm, item, loading} = this.state;
        const fieldWarnings  = [];

        const validationSchema = Yup.object().shape({
            line: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            team_id: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            staff_name: Yup.string().required(Constant.MSG_REQUIRED).max(255, Constant.MSG_MAX_CHARATER_255).nullable(),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

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
                                    onClick={() => this.goBack()}>
                                <span>Quay lại</span>
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
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
