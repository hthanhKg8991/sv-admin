import React from "react";
import {createConfig, updateConfig, getDetailConfig} from "api/system";
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

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                name: "name",
                code: "code",
                group_key: "group_key",
                value: "value",
                is_auto_load: "is_auto_load",
                description: "description",
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
                    pathname: Constant.BASE_URL_SYSTEM_CONFIG,
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
                    pathname: Constant.BASE_URL_SYSTEM_CONFIG,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        }else{
            history.push({
                pathname: Constant.BASE_URL_SYSTEM_CONFIG
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
            res = await updateConfig(data);
        } else {
            res = await createConfig(data);
        }
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
            if(res.id){
                history.push({
                    pathname: Constant.BASE_URL_SYSTEM_CONFIG,
                    search: '?action=detail&id=' + res.id
                });
            }else{
                history.push({
                    pathname: Constant.BASE_URL_SYSTEM_CONFIG,
                });
            }
        } else {
            this.setState({loading: false});
        }
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetailConfig({id});
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
        const {id, initialForm, item, loading} = this.state;
        const fieldWarnings  = [];

        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED).max(200, Constant.MSG_MAX_CHARATER_200),
            code: Yup.string().required(Constant.MSG_REQUIRED).max(200, Constant.MSG_MAX_CHARATER_200),
            group_key: Yup.string().required(Constant.MSG_REQUIRED).max(200, Constant.MSG_MAX_CHARATER_200),
            is_auto_load: Yup.number().required(Constant.MSG_REQUIRED),
            value: Yup.string().required(Constant.MSG_REQUIRED),
            description: Yup.string(),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
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
