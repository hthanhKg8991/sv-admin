import React from "react";
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
import queryString from "query-string";
import {getTeamMember} from "api/auth";
import {createEmployerResignV2} from "api/saleOrderV2";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "employer_id": "employer_id",
            },
            customer: []
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
                    pathname: Constant.BASE_URL_EMPLOYER_RESIGN_V2,
                    search: '?action=list'
                });

                return true;
            }

            if(_.get(history, 'action') === 'PUSH'){
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "list"
                };

                history.push({
                    pathname: Constant.BASE_URL_EMPLOYER_RESIGN_V2,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        }else{
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER_RESIGN_V2
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
        // const created_object = customer.find(c => Number(c?.id) === Number(data?.created_by_id));
        if (id > 0) {
            // data.id = id;
            // res = await updateEmployerResign({...data, created_by: created_by});
        } else {
            res = await createEmployerResignV2(data);
        }
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
            if(res.id){
                history.push({
                    pathname: Constant.BASE_URL_EMPLOYER_RESIGN_V2,
                    search: '?action=detail&id=' + res.id
                });
            }else{
                history.push({
                    pathname: Constant.BASE_URL_EMPLOYER_RESIGN_V2,
                });
            }
        } else {
            this.setState({loading: false});
        }
    };

    async _getTeamMember() {
        const res = await getTeamMember();
        if(res) {
            this.setState({customer: res});
        }
    }

    componentDidMount() {
        const {id} = this.state;
        this._getTeamMember();
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const {id, initialForm, item, loading} = this.state;
        const fieldWarnings  = [];

        const validationSchema = Yup.object().shape({
            employer_id: Yup.number().required(Constant.MSG_REQUIRED),
            // reason: Yup.string().required(Constant.MSG_REQUIRED),
            // created_by_id: Yup.number().required(Constant.MSG_REQUIRED),
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
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
