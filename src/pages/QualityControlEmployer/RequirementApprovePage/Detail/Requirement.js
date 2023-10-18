import React from "react";
import Gird from "components/Common/Ui/Table/Gird";
import { getListRequirement, getListRequirementJob } from "api/employer";
import * as Constant from "utils/Constant";

class ServiceActivated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsTitle: [
                {
                    title: "ID Tin",
                    width: 100,
                    cell: row => (
                        <span className="cursor-pointer" onClick={() => {
                            this.goDetailJob(row.id,
                                row.job_id,
                                Constant.REASON_APPROVE_CHANGE_TITLE)
                        }}>{`ID-${row.job_id}`}</span>
                    )
                }, {
                    title: "Tên công ty",
                    width: 250,
                    accessor: "employer_info.name"
                }, {
                    title: "Tiêu đề cũ",
                    width: 200,
                    accessor: "old_data"
                }, {
                    title: "Tiêu đề mới",
                    width: 200,
                    accessor: "new_data"
                }, {
                    title: "Người yêu cầu",
                    width: 200,
                    accessor: "staff_username_request"
                },
            ],
            columnsEmployerName: [
                {
                    title: "ID NTD",
                    width: 100,
                    cell: row => (
                        <span className="cursor-pointer" onClick={() => {
                            this.goDetailEmployer(row.id,
                                row.employer_id,
                                Constant.REASON_APPROVE_CHANGE_COMPANY)
                        }}>{`ID-${row.employer_id}`}</span>
                    )
                }, {
                    title: "Tên cũ",
                    width: 300,
                    accessor: "old_data"
                }, {
                    title: "Tên mới",
                    width: 200,
                    accessor: "new_data"
                }, {
                    title: "Người yêu cầu",
                    width: 200,
                    accessor: "staff_username_request"
                }
            ],
            columnsEmployerEmail: [
                {
                    title: "ID NTD",
                    width: 100,
                    cell: row => (
                        <span className="cursor-pointer" onClick={() => {
                            this.goDetailEmployer(row.id,
                                row.employer_id,
                                Constant.REASON_APPROVE_CHANGE_EMAIL)
                        }}>{`ID-${row.employer_id}`}</span>
                    )
                }, {
                    title: "Tên công ty",
                    width: 300,
                    accessor: "employer_info.name"
                }, {
                    title: "Email cũ",
                    width: 200,
                    accessor: "old_data"
                }, {
                    title: "Email mới",
                    width: 200,
                    accessor: "new_data"
                }, {
                    title: "Người yêu cầu",
                    width: 200,
                    accessor: "staff_username_request"
                }
            ],
            columnsEmployerEmailVerify: [
                {
                    title: "ID NTD",
                    width: 100,
                    cell: row => (
                        <span className="cursor-pointer" onClick={() => {
                            this.goDetailEmployer(row.id,
                                row.employer_id,
                                Constant.REASON_APPROVE_VERIFY_EMAIL)
                        }}>{`ID-${row.employer_id}`}</span>
                    )
                }, {
                    title: "Tên công ty",
                    width: 250,
                    accessor: "employer_info.name"
                }, {
                    title: "Email NTD",
                    width: 200,
                    accessor: "employer_info.email"
                }, {
                    title: "Người yêu cầu",
                    width: 200,
                    accessor: "staff_username_request"
                },
            ]
        };
        this.goDetailJob = this.goDetailJob.bind(this);
        this.goDetailEmployer = this.goDetailEmployer.bind(this);
    }

    goDetailJob(id, job_id, type) {
        const { history } = this.props;
        history.push({
            pathname: Constant.BASE_URL_REQUIREMENT_APPROVE,
            search: `?action=detail&id=${id}&job_id=${job_id}&type=${type}`
        });
    }

    goDetailEmployer(id, employer_id, type) {
        const { history } = this.props;
        history.push({
            pathname: Constant.BASE_URL_REQUIREMENT_APPROVE,
            search: `?action=detail&id=${id}&employer_id=${employer_id}&type=${type}`
        });
    }


    render() {
        const { history } = this.props;
        const { columnsTitle, columnsEmployerName, columnsEmployerEmail, columnsEmployerEmailVerify } = this.state;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 mt15">
                        <h4>Đổi tiêu đề tin</h4>
                    </div>
                </div>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"changeTitle"} fetchApi={getListRequirementJob}
                              defaultQuery={{
                                  status: Constant.STATUS_INACTIVED,
                                  type: Constant.REASON_APPROVE_CHANGE_TITLE
                              }}
                              columns={columnsTitle}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mt15">
                        <h4>Đổi tên công ty</h4>
                    </div>
                </div>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"changeEmployer"} fetchApi={getListRequirement}
                              defaultQuery={{
                                  status: Constant.STATUS_INACTIVED,
                                  type: Constant.REASON_APPROVE_CHANGE_COMPANY
                              }}
                              columns={columnsEmployerName}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mt15">
                        <h4>Đổi email công ty</h4>
                    </div>
                </div>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"changeEmail"} fetchApi={getListRequirement}
                              defaultQuery={{
                                  status: Constant.STATUS_INACTIVED,
                                  type: Constant.REASON_APPROVE_CHANGE_EMAIL
                              }}
                              columns={columnsEmployerEmail}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mt15">
                        <h4>Xác thực Email</h4>
                    </div>
                </div>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"verifyEmail"} fetchApi={getListRequirement}
                              defaultQuery={{
                                  status: Constant.STATUS_INACTIVED,
                                  type: Constant.REASON_APPROVE_VERIFY_EMAIL
                              }}
                              columns={columnsEmployerEmailVerify}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}/>
                    </div>
                </div>


            </React.Fragment>
        )
    }
}

export default ServiceActivated
