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
import {
    createHeadhuntAcceptanceRecord,
    updateHeadhuntAcceptanceRecord
} from "api/headhunt";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialForm: {
                "sales_order_id": "sales_order_id",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);

    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_ACCEPTANCE_RECORD
        })
    }

    _onSubmit(data, action) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const {actions, object, refreshId, history} = this.props;
        let res;
        if (object?.id > 0) {
            data.id = object.id;
            res = await updateHeadhuntAcceptanceRecord(data);
        } else {
            res = await createHeadhuntAcceptanceRecord(data);
        }
        if (res) {
            refreshId(res.id);
            actions.putToastSuccess("Thao tác thành công!");
            history.push({
                pathname: Constant.BASE_URL_HEADHUNT_ACCEPTANCE_RECORD,
                search: '?action=edit&id='+res.id
            })
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, loading} = this.state;
        const {item} = this.props;
        const validationSchema = Yup.object().shape({
            sales_order_id: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

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
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
