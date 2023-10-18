import React from "react";
import {createEmployerNotDisturb} from "api/employer";
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

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            detail: null,
            loading: false,
            initialForm: {
                name: "name",
                email: "email",
                phone: "phone",
                start_date: "start_date",
            },
            dataLogo: null
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
            pathname: Constant.BASE_URL_EMPLOYER_NOT_DISTURB
        });
    }

    _onSubmit(data) {
        const {actions} = this.props;
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        const {email, phone} = dataSumbit;
        if((!!email + !!phone) === 0) {
            actions.putToastError("Vui lòng nhập 1 trong 2 trường email hoặc số điện thoại!");
            return;
        }

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit);
        });
    }

    async submitData(data) {
        const {actions, history} = this.props;
        const res = await createEmployerNotDisturb(data);
        if (res) {
            const {code} = res;
            if(code === Constant.CODE_VALIDATION_DUPLICATE) {
                const confirm = window.confirm("Email hoặc SĐT đã tồn tại. Bạn có muốn thêm vào danh sách!");
                if(confirm) {
                    const dataDuplicate = {...data, allowed_create: true};
                    const resDuplicate = await createEmployerNotDisturb(dataDuplicate);
                    this.setState({loading: false});
                    if(!resDuplicate) return;
                } else {
                    this.setState({loading: false});
                    return;
                }
            }
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER_NOT_DISTURB,
            });
        } else {
            this.setState({loading: false});
        }
    };

    // async asyncData() {
    //     const {id} = this.state;
    //
    //     if (id > 0) {
    //         const res = await getDetail(id);
    //         if(res) {
    //             const resEmployer = await getEmployerDetail(res.employer_id);
    //             res.job_id = res.id;
    //             res.employer_name = resEmployer.name;
    //             res.employer_address = resEmployer.address;
    //             res.email = res.job_contact_info.contact_email;
    //             res.name = res.job_contact_info.contact_name;
    //             res.type = Constant.REASON_APPROVE_CHANGE_TITLE;
    //             this.setState({detail: res,  loading: false});
    //         }
    //     } else {
    //         this.setState({loading: false});
    //     }
    // }

    render() {
        const {id, initialForm, detail, loading} = this.state;

        const validationSchema = Yup.object().shape({
            name: Yup.string().min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255),
            email: Yup.string().min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).email(Constant.MSG_TYPE_VALID),
            phone: Yup.string().min(10, Constant.MSG_MIN_CHARATER_10).max(255, Constant.MSG_MAX_CHARATER_255),
            start_date: Yup.string().required(Constant.MSG_REQUIRED),
        });

        let dataForm = detail ? utils.initFormValue(initialForm, detail) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
