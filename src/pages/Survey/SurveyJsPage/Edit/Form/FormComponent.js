import React from "react";
import { connect } from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as Constant from "utils/Constant";
import { getListGroupSurvey } from "api/survey";
class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listGroupSurvey: []
        };
        this.loadListGroupSurvey = this._loadListGroupSurvey.bind(this);
    }

    async _loadListGroupSurvey() {
        const res = await getListGroupSurvey({ status: 1 });

        if (res) {
            this.setState({
                listGroupSurvey: res?.items?.map(item => ({ value: item.id, label: item.name })) || []
            })
        }
    }

    componentDidMount() {
        this.loadListGroupSurvey()
    }

    render() {
        const { listGroupSurvey } = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"Code"} showLabelRequired />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"title"} label={"Tiêu đề"} showLabelRequired />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"type"} label={"Loại"}
                            type={"common"}
                            valueField={"value"}
                            idKey={Constant.COMMON_DATA_KEY_survey_type}
                            showLabelRequired />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"description"} label={"Mô tả"} />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelect
                            name="group_survey_id"
                            label="Group Survey"
                            options={listGroupSurvey || []}
                            showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
