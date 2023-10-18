import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    confirmSalesOrderHeadhunt,
    createHeadhuntContract,
    updateHeadhuntContract
} from "api/headhunt";
import {publish} from "utils/event";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: false,
            initialForm: {
                "note": "note",
                "attached_file_url": "attached_file_url",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    _onClose() {
        const {actions} = this.props;
        actions.deletePopup();
    }


    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.submitData(dataSubmit, setErrors);
    }

    async submitData(data, setErrors) {
        const {actions, id, idKey} = this.props;
        data.id = id;
        const res = await confirmSalesOrderHeadhunt(data);

        const {data: dataRes, code, msg} = res;
        if (code === Constant.CODE_SUCCESS) {
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
            publish(".refresh", {}, idKey);
        } else {
            setErrors(dataRes);
            actions.putToastError(msg);
        }
    };


    render() {
        const {loading} = this.state;
        return (
            <div>
                {loading && <LoadingSmall className="form-loading"/>}
                <div className="form-container">
                    <FormBase onSubmit={this.onSubmit}
                              initialValues={{}}
                              FormComponent={FormComponent}>
                        <div className={"row mt15"}>
                            <div className="col-sm-12">
                                <button type="submit" className="el-button el-button-success el-button-small">
                                    <span>Xác nhận</span>
                                </button>
                                <button type="button" className="el-button el-button-bricky el-button-small"
                                        onClick={this.onClose}>
                                    <span>Đóng</span>
                                </button>
                            </div>
                        </div>
                    </FormBase>
                </div>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
