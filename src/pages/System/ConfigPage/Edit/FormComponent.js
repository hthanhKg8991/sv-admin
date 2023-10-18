import React from "react";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"Mã"}
                                 isWarning={_.includes(fieldWarnings, 'code')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"}
                                 isWarning={_.includes(fieldWarnings, 'name')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"value"} label={"Giá trị"}
                                 isWarning={_.includes(fieldWarnings, 'value')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"group_key"} label={"Group key"}
                                 isWarning={_.includes(fieldWarnings, 'group_key')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"is_auto_load"} label={"Tự động load"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_auto_load_value}
                                        isWarning={_.includes(fieldWarnings, 'is_auto_load')}
                                        isClosing
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"description"} label={"Mô tả"} type={"textarea"}
                                 isWarning={_.includes(fieldWarnings, 'description')}
                                 />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
