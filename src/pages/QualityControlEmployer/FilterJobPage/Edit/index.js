import React from "react";
import {postFilterCreate} from "api/saleOrder";
import * as Constant from "utils/Constant";
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
                job_id: "job_id",
                expired_at: "expired_at",
                job_field_id: "job_field_id",
                service_code: "service_code",
                displayed_method: "displayed_method",
                displayed_area: "displayed_area",
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
            pathname: Constant.BASE_URL_QC_FILTER_JOB
        });
    }

    _onSubmit(data) {
        this.setState({loading: true}, () => {
            this.submitData(data);
        });
    }

    async submitData(data) {
        const {actions, history} = this.props;
        const res = await postFilterCreate(data);
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
            history.push({
                pathname: Constant.BASE_URL_QC_FILTER_JOB,
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
        const {id, initialForm, loading} = this.state;
        const validationSchema = Yup.object().shape({
            job_id: Yup.string().required(Constant.MSG_REQUIRED),
            expired_at: Yup.string().required(Constant.MSG_REQUIRED),
            service_code: Yup.string().required(Constant.MSG_REQUIRED),
            displayed_area: Yup.string().required(Constant.MSG_REQUIRED),
            displayed_method: Yup.string().required(Constant.MSG_REQUIRED),
        });

        let dataForm = utils.initFormKey(initialForm);

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
