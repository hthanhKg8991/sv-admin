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
import {getMergeDataRevision} from "utils/utils";
import {putToastError, putToastSuccess} from "actions/uiAction";
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

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                    search: '?action=detail&id=' + id
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
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
        } else {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        // filter loại bỏ tỉnh thành đặc biệt trước khi submit
        const province_list = this.props.sys.provinceInForm.items;
        const province = province_list.filter(_ => _.id === Number(data.province_id));
        const {setErrors} = action;
        if(province?.length === 0){
            setErrors({"province_id": "Vui lòng chọn Tỉnh/Thành phố"});
            return false;
        }
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
            res = await updateSeeker(data);
        } else {
            res = await addSeeker(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                if (data.id) {
                    history.push({
                        pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                        search: '?action=detail&id=' + data.id
                    });
                } else {
                    history.push({
                        pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
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
        const data = getMergeDataRevision(seeker, seekerRevision);
        let fieldWarnings = [];
        _.forEach(seekerRevision, (item, key) => {
            if (!_.isEqual(item, _.get(seeker, key))) {
                fieldWarnings.push(key);
            }
        });

        const shape = {
            name: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            email: Yup.string().required(Constant.MSG_REQUIRED).email(Constant.MSG_TYPE_VALID).nullable(),
            mobile: Yup.string().min(10, Constant.MSG_MIN_CHARATER_10).required(Constant.MSG_REQUIRED).nullable(),
            province_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            address: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            birthday: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            gender: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            avatar: Yup.string().nullable(),
            assigned_staff_id: id > 0 ? null : Yup.number().required(Constant.MSG_REQUIRED).nullable(),
            password: id > 0 
            ? Yup.string().nullable() 
            : Yup.string().required(Constant.MSG_REQUIRED)
                .min(8, Constant.MSG_MIN_CHARATER_8)
                .max(255, Constant.MSG_MAX_CHARATER_255)
                .matches("(\\d){1}([a-zA-Z]){1}(\\w*)|(\\w*)([a-zA-Z]){1}(\\d){1}",{message: Constant.MSG_PASSWORD_REGEX, excludeEmptyString: true }),
            marital_status: Yup.number().required(Constant.MSG_REQUIRED).nullable()
        };

        const validationSchema = Yup.object().shape(shape);

        const dataForm = seeker ? utils.initFormValue(initialForm, data) : utils.initFormKey(initialForm);
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

function mapStateToProp(state) {
    return {
        branch: state.branch,
        sys: state.sys
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(mapStateToProp, mapDispatchToProps)(Edit);
