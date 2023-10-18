import React from "react";
import {addSeeker, seekerDetail, seekerRevision, updateSeeker} from "api/seeker";
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
            seeker: null,
            seekerRevision: null,
            loading: true,
            initialForm: {
                name: "name",
                email: "email",
                password: "password",
                mobile: "mobile",
                birthday: "birthday",
                gender: "gender",
                marital_status: "marital_status",
                address: "address",
                province_id: "province_id",
                avatar: "avatar",
                avatar_url: "avatar_url",
                assigned_staff_id: "assigned_staff_id",
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
                    pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
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
                    pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        }else{
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER
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
        const {actions} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateSeeker(data);
        } else {
            res = await addSeeker(data);
        }

        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
                this.goBack(_.get(res, 'id'));
            });
        } else {
            this.setState({loading: false});
        }
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await asyncApi({
                data: seekerDetail(id),
                dataRevision: seekerRevision(id)
            });

            const {data, dataRevision} = res;
            if (data && dataRevision) {
                this.setState({
                    loading: false,
                    seeker: data,
                    seekerRevision: _.pickBy(dataRevision, (item) => {
                        return !_.isUndefined(item) && !_.isNull(item);
                    })
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
        const {id, initialForm, seeker, seekerRevision, loading} = this.state;
        const data = _.merge({}, seeker, seekerRevision);

        let fieldWarnings = [];
        _.forEach(seekerRevision, (item, key) => {
            if (!_.isEqual(item, _.get(seeker, key))) {
                fieldWarnings.push(key);
            }
        });

        const validatePass = Yup.string().nullable();

        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            email: Yup.string().required(Constant.MSG_REQUIRED).email(Constant.MSG_TYPE_VALID).nullable(),
            mobile: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            province_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            address: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            birthday: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            gender: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            marital_status: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            avatar: Yup.string().nullable(),
            password: id > 0 ? validatePass : validatePass.required(Constant.MSG_REQUIRED),
            assigned_staff_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
        });

        const dataForm = seeker ? utils.initFormValue(initialForm, data) : utils.initFormKey(initialForm);

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
