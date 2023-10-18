import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "./ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {publish} from "utils/event";
import {
    deleteApplicantAcceptanceHeadhunt,
    listApplicantAcceptanceHeadhunt
} from "api/headhunt";
import moment from "moment"
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {SpanCommon} from "components/Common/Ui";

const idKey = "ApplicantAcceptanceList";

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    title: "Tên ứng viên",
                    width: 80,
                    cell: row => (<span>{`${row.applicant_id} - ${row.applicant_seeker_name}`}</span>)
                },
                {
                    title: "Vị trí tuyển dụng",
                    width: 120,
                    cell: row => <div>
                        <div>
                            <span className="font-bold mr5">Contract request:</span>
                            <span>{`${row.contract_request_id} - ${row.contract_request_title}`}</span>
                        </div>
                        <div>
                            <span className="font-bold mr5">Mã hợp đồng:</span>

                            <span>{row.contract_code}</span>
                        </div>
                        <div>
                            <span className="font-bold mr5">Khách hàng:</span>
                            <span>{`${row.customer_id} - ${row.customer_company_name}`}</span>
                        </div>
                    </div>
                },
                {
                    title: "Ngày onboard",
                    width: 50,
                    cell: row => <span>{row.onboard_at ? moment.unix(row.onboard_at).format("DD/MM/YYYY") : ""}</span>
                },
                {
                    title: "Ứng viên bảo hành",
                    width: 60,
                    cell: row =>
                        <span>{row.applicant_guarantee_applicant_id ? "Ứng viên bảo hành" : "Ứng viên mới"}</span>
                },
                {
                    title: "Recruiter",
                    width: 70,
                    accessor: "applicant_recruiter_staff_login_name"
                },
                {
                    title: "Ngày gửi nghiệm thu",
                    width: 35,
                    cell: row => <span>{row.created_at ? moment.unix(row.created_at).format("DD/MM/YYYY") : ""}</span>
                },
                {
                    title: "Trạng thái",
                    width: 50,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_acceptance_status}
                                    value={row.acceptance_record_status_approved} notStyle/>
                },
                {
                    title: "Biên bản nghiệm thu",
                    width: 80,
                    cell: row => (
                        <div>
                            <div>
                                <span className="font-bold mr5">ID biên bản:</span>
                                <span>{row.acceptance_record_id}</span>
                            </div>
                            <div>
                                <span className="font-bold mr5">Ngày duyệt:</span>
                                <span>{row.acceptance_approved_at ? moment.unix(row.acceptance_approved_at).format("DD/MM/YYYY") : ""}</span>
                            </div>
                        </div>
                    )
                },
                {
                    title: "Sale nghiệm thu",
                    width: 70,
                    cell: row => <div>
                        {row.customer_staff_login_name?.map((v, i) => (<div key={i}>{v}</div>))}
                    </div>
                },
                {
                    title: "Thao tác",
                    width: 40,
                    cell: row => <div className="text-center">
                        <CanRender actionCode={ROLES.headhunt_applicant_acceptance_delete}>
                            <span onClick={() => this.onDelete(row.id)}
                                  className="text-link text-red text-center font-bold">Xóa</span>
                        </CanRender>
                    </div>
                },
            ],
            loading: false,
        };
        this.onDelete = this._onDelete.bind(this);
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ứng viên nghiệm thu',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteApplicantAcceptanceHeadhunt({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Ứng viên nghiệm thu"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={listApplicantAcceptanceHeadhunt}
                      query={query}
                      columns={columns}
                      history={history}
                      isReplaceRoute
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            SmartMessageBox,
            hideSmartMessageBox,
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
