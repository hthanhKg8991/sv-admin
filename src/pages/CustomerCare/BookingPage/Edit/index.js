import React from "react";
import {create, getDetail} from "api/booking";
import * as Constant from "utils/Constant";
import _ from "lodash";
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
            loading: true,
            booking: null,
            initialForm: {
                gate: 'booking_box.gate_code',
                page_type_id: 'booking_box.page_type_id',
                booking_box_id: 'booking_box_id',
                job_field_id: 'job_field_id',
                displayed_area: 'displayed_area',
                display_method: 'display_method',
                from_date: 'from_date',
                to_date: 'to_date',
                staff_id: 'staff_id',
                employer_id: 'employer_id',
            }
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(code = null) {
        const {history} = this.props;
        if (code) {
            history.push({
                pathname: Constant.BASE_URL_BOOKING,
                search: '?action=detail&code=' + code
            });
        } else {
            history.push({
                pathname: Constant.BASE_URL_BOOKING
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        /*
        Kiểm tra bắt buộc ngành nên Loại trang là trang ngành
         */
        if (dataSumbit.page_type_id === Constant.SERVICE_PAGE_TYPE_FIELD && Number(dataSumbit.job_field_id) <= 0) {
            setErrors({job_field_id: "Thông tin là bắt buộc"});
            return false;
        }

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions} = this.props;
        const res = await create(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                this.goBack(data.code);
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
            const data = await getDetail({id: id});
            if (data) {
                this.setState({
                    booking: data,
                    loading: false
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
        const {initialForm, booking, loading} = this.state;
        const validationSchema = Yup.object().shape({
            gate: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            page_type_id: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            booking_box_id: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            job_field_id: Yup.number().integer(Constant.MSG_TYPE_VALID).nullable(),
            displayed_area: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            display_method: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            from_date: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            to_date: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            staff_id: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
            employer_id: Yup.number().required(Constant.MSG_REQUIRED).integer(Constant.MSG_TYPE_VALID).nullable(),
        });

        const dataForm = booking ? utils.initFormValue(initialForm, booking) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
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
