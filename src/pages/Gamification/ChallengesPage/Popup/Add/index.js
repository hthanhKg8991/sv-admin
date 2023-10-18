import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import {putToastError, putToastSuccess, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {
    createGamificationChallenges,
    updateGamificationChallenges,

} from "api/gamification";

class PopupAddChallenges extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialForm: {
                "name": "name",
                "category_id": "category_id",
                "point": "point",
                "ref_url": "ref_url",
                "icon_url": "icon_url",
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

    _onSubmit(data) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.submitData(dataSubmit);
    }

    async submitData(data) {
        const {actions, idKey, id} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateGamificationChallenges(data);
        } else {
            res = await createGamificationChallenges(data);
        }
        if (res) {
            publish(".refresh", {}, idKey)
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
    };


    render() {
        const {id, item} = this.props;
        const {initialForm} = this.state;
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED),
            category_id: Yup.string().required(Constant.MSG_REQUIRED),
            point: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        <FormBase onSubmit={this.onSubmit}
                                  initialValues={dataForm}
                                  validationSchema={validationSchema}
                                  fieldWarnings={[]}
                                  isEdit={id > 0}
                                  FormComponent={FormComponent}>
                            <div className={"row mt30"}>
                                <div className="col-sm-12">
                                    <button type="submit" className="el-button el-button-success el-button-small">
                                        <span>Lưu</span>
                                    </button>
                                    <button type="button" className="el-button el-button-default el-button-small"
                                            onClick={() => this.goBack()}>
                                        <span>Đóng</span>
                                    </button>
                                </div>
                            </div>
                        </FormBase>
                    </div>
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

export default connect(null, mapDispatchToProps)(PopupAddChallenges);
