import React from "react";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import _ from "lodash";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyField from "components/Common/Ui/Form/MyField";


class FormComponent extends React.Component {
    render() {
        const {fieldWarnings, user, values, fnCallBack} = this.props;
        const isReasonNote = values.reason === Constant.REASON_OTHER_VALUE;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <p>CSKH cần chuyển sang: <b>{user.display_name}</b></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MyField name={"email"} label={"Email"}
                                 isWarning={_.includes(fieldWarnings, 'email')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"reason"} label={"Lý do"}
                                        isWarning={_.includes(fieldWarnings, 'reason')}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_discard_reason}
                                        onChange={fnCallBack}
                                        showLabelRequired
                        />
                    </div>
                    {isReasonNote && (
                        <div className="col-sm-12 mb10">
                            <MyField name={"orther_reason"} label={"Lý do khác"}
                                     isWarning={_.includes(fieldWarnings, 'orther_reason')}
                                     showLabelRequired
                            />
                        </div>
                    )}
                    <div className="col-sm-12 mb10">
                        <MyField name={"note"} label={"Ghi chú"} type={"textarea"}
                                 isWarning={_.includes(fieldWarnings, 'note')}
                                 />
                    </div>
                    <div className="col-sm-2 mb10">
                        <DropzoneImage label={"Tập tin"} name={"attached_file"}
                                       isWarning={_.includes(fieldWarnings, 'attached_file')}
                                       folder={"assignment-request"}
                                       validationImage={{type: Constant.ASSIGNMENT_UPLOAD_TYPE, size: 2048000}}
                                       isFile/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.data,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
