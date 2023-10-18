import React from "react";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import {getEmployerSearchEmailFullReq} from "api/employer";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logo: null
        };
        this.onChangeEmail = this._onChangeEmail.bind(this);
    }

    async _onChangeEmail(value) {
        const {setFieldValue} = this.props;
        if(value) {
            const res = await getEmployerSearchEmailFullReq({email: value});
            if(res && res?.data) {
                setFieldValue("name", res?.data?.name);
            }
        }
    }

    render() {
        const {fieldWarnings} = this.props;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MyField name={"name"} label={"Tên NTD"}
                                 isWarning={_.includes(fieldWarnings, 'name')}
                        />
                    </div>
                    <div className="col-sm-6 mb10">
                        <MyField name={"email"} label={"Email"}
                                 isWarning={_.includes(fieldWarnings, 'email')}
                                 onChange={(e) => this.onChangeEmail(e)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MyField name={"phone"} label={"Số ĐT"}
                                 isWarning={_.includes(fieldWarnings, 'phone')}
                        />
                    </div>
                    <div className="col-sm-6 mb10">
                        <MyDate name={"start_date"} label={"Ngày cấm làm phiền"}
                                isWarning={_.includes(fieldWarnings, 'start_date')}
                                showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
