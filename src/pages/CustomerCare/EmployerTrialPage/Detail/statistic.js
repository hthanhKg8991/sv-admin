import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {getEmployerStatisticBenefitTrial} from "api/mix";

class Statistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            employer_id : props.employer_id,
            data: null
        };
    }

    async asyncData() {
        const res = await getEmployerStatisticBenefitTrial({employer_id: this.state.employer_id});
        if (res) {
            this.setState({loading: false})
            this.setState({data: res})
        }

    }

    componentDidMount() {
       this.asyncData().then(r => {});
    }
    render() {
        const {resume_applied : resumeApplied,seeker_seen_job: seekerSeenJob } = this.state.data || {};
        const defineDay = [
            {
                name: "Ngày 1",
                day: 1,
            },
            {
                name: "Ngày 2",
                day: 2,
            },
            {
                name: "Ngày 3",
                day: 3,
            }
        ]
        if (!this.state.data){
            return null;
        }

        return (
            <div className="container-fluid text-center content-box">
                <div className="row font-bold mb10">
                    <div className="col-xs-2 text-left">Mục tiêu</div>
                    {defineDay.map(_=>(
                        <div className="col-xs-1" key={_.day.toString()}>{_.name}</div>
                    ))}
                    <div className="col-xs-1">Tổng</div>
                </div>
                {resumeApplied && (
                    <div className="row mb10">
                        <div className="col-xs-2 text-left" key="target">Số lượng hồ sơ ứng tuyển</div>
                        {defineDay.map(_=>(
                            <div className="col-xs-1" key={_.day.toString()}>{resumeApplied.statistic_date?.find(__ => __.day === _.day)?.total || 0}</div>
                        ))}
                        <div className="col-xs-1">{resumeApplied.total || 0}</div>
                    </div>
                )}
                {
                    seekerSeenJob && (
                        <div className="row mb10">
                            <div className="col-xs-2 text-left">Số lượng ứng viên xem tin</div>
                            {defineDay.map(_=>(
                                <div className="col-xs-1" key={_.day.toString()}>{seekerSeenJob.statistic_date?.find(__ => __.day === _.day)?.total || 0}</div>
                            ))}
                            <div className="col-xs-1" key="total">{seekerSeenJob.total || 0}</div>
                        </div>
                    )
                }

            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Statistic);

