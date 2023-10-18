import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {detailByCodeHeadhuntCustomer} from "api/headhunt";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import moment from "moment";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: null,
            loading: false,
            initialForm: {
                "tax_code": "tax_code",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true, detail: null}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const res = await detailByCodeHeadhuntCustomer(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                this.setState({detail: data})
            } else if (code === Constant.CODE_NON_RECORD) {
                this.setState({detail: {}})
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, loading, detail} = this.state;
        const validationSchema = Yup.object().shape({
            tax_code: Yup.string().required(Constant.MSG_REQUIRED),
        });
        const dataForm = utils.initFormKey(initialForm);
        return (
            <div>
                {loading && <LoadingSmall className="form-loading"/>}
                <div className="form-container">
                    <FormBase onSubmit={this.onSubmit}
                              initialValues={dataForm}
                              validationSchema={validationSchema}
                              fieldWarnings={[]}
                              FormComponent={FormComponent}>
                        <div className={"row mt15"}>
                            <div className="col-sm-12">
                                <button type="submit" className="el-button el-button-success el-button-small">
                                    <span>Kiểm tra</span>
                                </button>
                            </div>
                        </div>
                    </FormBase>
                </div>
                <div className="p-3">
                    {detail && (
                        <>
                            {detail.id ? (
                                <div className="crm-section">
                                    <div className="body-table el-table">
                                        <TableComponent allowDragScroll={false}>
                                            <TableHeader tableType="TableHeader" width={50}>
                                                ID
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={80}>
                                                Mã số thuế
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Tên công ty
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Nhân viên Sale
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={80}>
                                                Ngày tạo
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                <tr>
                                                    <td>
                                                        <div className="cell-custom">
                                                            {detail.id}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom">
                                                            {detail.tax_code}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom">
                                                            {detail.company_name}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom">
                                                            <span>{detail?.customer_staff_info?.customer_headhunt_sale?.map((v, i) => (
                                                                <div key={i}>{v}</div>))}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom">
                                                            {moment.unix(detail.created_at).format("DD-MM-YYYY")}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </TableBody>
                                        </TableComponent>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-red">
                                    {Constant.MSG_NON_CUSTOMER}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
