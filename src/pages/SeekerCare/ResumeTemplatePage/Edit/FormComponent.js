import React from "react";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {getResume} from "api/seeker";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChangeField = this._onChangeField.bind(this);
    }

    _onChangeField (value) {
        const {setFieldValue} = this.props;
        const params = {
            "field_ids[0]": value,
            "resume_type": 1,
            "status": 1,
            branch_code: null,
        };
        if(!value){
            setFieldValue("resume_id",null);
        }
        this.setState({defaultQuery: params});
    }

    componentWillReceiveProps(newProps) {
        const {values} = newProps;
        if(values.field_id){
            const params = {
                "field_ids[0]": values.field_id,
                "resume_type": 1,
                "status": 1,
                branch_code: null,
            };
            this.setState({defaultQuery: params})
        }
    }

    render() {
        const {fieldWarnings} = this.props;
        const {defaultQuery} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-9 mb10">
                        <MyField name={"title"}
                                 label={"Tiêu đề"}
                                 isWarning={_.includes(fieldWarnings, 'title')}
                                 showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-9 mb10">
                        <MySelectSystem name={"field_id"}
                                        label={"Ngành nghề"}
                                        type={"jobField"}
                                        isWarning={_.includes(fieldWarnings, 'field_id')}
                                        onChange={(value) => this.onChangeField(value)}
                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-9 mb10">
                        <MySelectSearch
                            name={"resume_id"}
                            label={"Hồ sơ"}
                            searchApi={getResume}
                            labelField={"title"}
                            valueField={"id"}
                            isWarning={_.includes(fieldWarnings, 'resume_id')}
                            defaultQuery={defaultQuery}
                            showLabelRequired />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default FormComponent;
