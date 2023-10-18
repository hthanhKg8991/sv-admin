import React from "react";
import CanAction from "components/Common/Ui/CanAction";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "../../../../utils/Constant";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";


class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0,
        };
        this.onChangeReason = this._onChangeReason.bind(this);
    }

    _onChangeReason(type) {
        const {fnCallBack} = this.props;
        this.setState({
            type,
        }, () => {
            fnCallBack(type);
        })
    }


    render() {
        const { type } = this.state;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <CanAction isDisabled>
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"email"} label={"Email"}
                                             readOnly/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"name"} label={"Tên công ty"}
                                             readOnly/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"address"} label={"Địa chỉ"}
                                             readOnly/>
                                </div>
                            </div>
                        </CanAction>
                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MySelectSystem name={"type"} label={"Chọn yêu cầu"}
                                                type={"common"}
                                                valueField={"value"}
                                                idKey={Constant.COMMON_DATA_KEY_request_type}
                                                showLabelRequired
                                                isClosing
                                                onChange={(value) => this.onChangeReason(value)}
                                />
                            </div>
                        </div>
                        {type !== 0 && (
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"reason_request"} label={"Lý do"} showLabelRequired
                                             />
                                </div>
                            </div>)}
                        {type === Constant.REASON_APPROVE_CHANGE_EMAIL && (
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"new_data"} label={"Email công ty mới"}
                                             showLabelRequired />
                                </div>
                            </div>
                        )}
                        {type === Constant.REASON_APPROVE_CHANGE_COMPANY && (
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"new_data"} label={"Tên công ty mới"}
                                             showLabelRequired />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <DropzoneImage label={"File đính kèm"}
                                       name={"file"}
                                       prefix={"yeucau"}
                                       validationImage={{type: Constant.ASSIGNMENT_UPLOAD_TYPE}}
                                       isFile
                                       folder={"reason"}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
