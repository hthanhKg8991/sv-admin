import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import MyDate from "components/Common/Ui/Form/MyDate";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditPhone: false,
            showEditEmail: false,
            phoneOld: this.props.values.phone,
            emailOld: this.props.values.email
        };
        this.togglePhone = this._togglePhone.bind(this);
        this.toggleEmail = this._toggleEmail.bind(this);
    }
    componentDidMount() {
        const {isEdit, setFieldValue} = this.props;
        if (isEdit){
            setFieldValue('phone','')
            setFieldValue('email','')
        }
    }
    _togglePhone(){
        const {setFieldValue} = this.props;
        const {showEditPhone} = this.state;
        if (showEditPhone){
            setFieldValue('phone','')
        }
        this.setState({showEditPhone: !showEditPhone})
    }
    _toggleEmail(){
        const {setFieldValue} = this.props;
        const {showEditEmail} = this.state;
        if (showEditEmail){
            setFieldValue('email','')
        }
        this.setState({showEditEmail: !showEditEmail})
    }

    render() {
        const {showEditPhone,phoneOld, showEditEmail, emailOld} = this.state;
        const {isEdit} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                {isEdit && (
                    <div className="row">
                        <div className="col-xs-6 d-flex mb20">
                            <div>{`Phone: ${phoneOld}`}</div>
                            <div className="cursor-pointer ml10" onClick={this.togglePhone}>
                                <span className="text-link">{showEditPhone ? "Hủy chỉnh sửa" : "Chỉnh sửa"}</span>
                            </div>
                        </div>
                        <div className="col-xs-6 d-flex mb20">
                            <div>{`Email: ${emailOld || ""}`}</div>
                            <div className="cursor-pointer ml10" onClick={this.toggleEmail}>
                                <span className="text-link">{showEditEmail ? "Hủy chỉnh sửa" : "Chỉnh sửa"}</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                {(!isEdit || showEditPhone) && (
                        <div className="col-md-6 mb10">
                            <MyField name={"phone"} label={"Số điện thoại"} showLabelRequired />
                        </div>
                    )
                }
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"type"}
                                        label={"Loại"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_zalo_zns_list_contact_type}
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"ref_id"} label={"Ref Id"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyDate
                            name={"regist_date"}
                            label={"Ngày đăng ký"}
                        />
                    </div>
                    {(!isEdit || showEditEmail) && (
                        <div className="col-md-6 mb10">
                            <MyField name={"email"} label={"Email"}/>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
