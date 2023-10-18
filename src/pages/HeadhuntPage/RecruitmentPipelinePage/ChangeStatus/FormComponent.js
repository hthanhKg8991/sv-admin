import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import * as Constant from "utils/Constant";
import MySelect from "components/Common/Ui/Form/MySelect";
import {listHeadhuntApplicantStatusReason} from "api/headhunt";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionsReason: [],
            isNote: false,
            status_list:  props.values?.lanes?.map(v => ( {label: v.title, value: v.id})) || []
        }
        this.onChangeStatus = this._onChangeStatus.bind(this);
        this.onChangeReasonStatus = this._onChangeReasonStatus.bind(this);
    }

    componentDidMount() {
        const {status} = this.props.values;
        if(status){
            this.onChangeStatus(status);
        }
    }

    async _onChangeStatus(value) {
        const resReasons = await listHeadhuntApplicantStatusReason({applicant_status_code: value});
        if (resReasons){
            const optionsReason = resReasons.map(item => {
                return {label: item.name, value: item.code}
            });
            this.setState({optionsReason: optionsReason});
        }
    }

    _onChangeReasonStatus(value) {
        this.setState({isNote: value.includes(Constant.HEADHUNT_APPLICATE_REASON_STATUS_OTHER)});
    }

    render() {
        const {optionsReason, isNote, status_list} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Pipeline status</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelect name={"status"} label={"Trạng thái pipeline"}
                                        type={"common"}
                                        options={status_list}
                                        onChange={this.onChangeStatus}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    {optionsReason.length > 0 && (
                        <div className="col-md-12 mb10">
                            <MySelect name={"status_reason"} label={"Lý do"}
                                      options={optionsReason || []}
                                      valueField={"id"}
                                      labelField={"name"}
                                      onChange={this.onChangeReasonStatus}
                                      showLabelRequired
                                      isMulti
                            />
                        </div>
                    )}
                    {isNote && (
                        <div className="col-md-12 mb10">
                            <MyField name={"status_other_reason"} label={"Lý do khác"} showLabelRequired/>
                        </div>
                    )}

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
