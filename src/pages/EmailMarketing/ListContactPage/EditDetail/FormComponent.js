import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditEmail: false,
            emailOld: this.props.values.email
        };
    }
    componentDidMount() {
        const {isEdit, setFieldValue} = this.props;
        if (isEdit){
            setFieldValue('email','')
        }
    }

    render() {
        const {showEditEmail,emailOld} = this.state;
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
                        <div className="col-xs-12 d-flex mb20">
                            <div>{`Email: ${emailOld}`}</div>
                            <div className="cursor-pointer ml10" onClick={()=>this.setState({showEditEmail: !showEditEmail})}>
                                <span className="text-link">Sửa</span>
                                <i className="glyphicon glyphicon-edit ml10"/>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                {(!isEdit || showEditEmail) && (
                        <div className="col-md-6 mb10">
                            <MyField name={"email"} label={"Email"} showLabelRequired />
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
                                        idKey={Constant.COMMON_DATA_KEY_email_marketing_list_contact_type}
                                        showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default FormComponent;
