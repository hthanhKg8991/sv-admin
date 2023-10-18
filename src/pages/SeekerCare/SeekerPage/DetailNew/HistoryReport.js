import React from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import { publish } from 'utils/event';
import {getPointGuaranteeList, getPointGuaranteeReport, deletePointGuarantee} from "api/saleOrder";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import queryString from "query-string";
import monent from "moment";
import Filter from "components/Common/Ui/Table/Filter";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as utils from "utils/utils";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";

class HistoryReport extends  React.Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            columnsReport: [
                {
                    title: "Lý do báo xấu",
                    width: 600,
                    cell: row => (
                        <>
                            <SpanCommon value={row?.reason} idKey={Constant.COMMON_DATA_KEY_guarantee_reason} notStyle/>
                            <SpanCommon value={row?.reason} idKey={Constant.COMMON_DATA_KEY_employer_report_abuse} notStyle/>
                        </>
                    ),
                    onClick: ()=>{ return false},
                },
                {
                    title: "Số lượt",
                    width: 100,
                    accessor: "total",
                    onClick: ()=>{ return false},
                },
                {
                    title: "Xóa",
                    width: 100,
                    cell: row => (
                        ((row.total > 0) && <CanRender actionCode={ROLES.seeker_care_seeker_report_seeker_delete}>
                            <span onClick={() => this.onDelete(row.reason)} className="btn-delete"><b>Xóa</b></span>
                        </CanRender>)
                    ),
                    onClick: ()=>{ return false},
                },
            ],
            columnsList: [
                {
                    title: "Nhà tuyển dụng",
                    width: 300,
                    cell: row => (
                        <>{row?.employer_info?.name}</>
                    )
                },
                {
                    title: "Lý do",
                    width: 500,
                    cell: row => (
                        <>
                            <SpanCommon value={row.reason} idKey={Constant.COMMON_DATA_KEY_guarantee_reason} />
                            <SpanCommon value={row.reason} idKey={Constant.COMMON_DATA_KEY_employer_report_abuse} />
                            <br/>
                            {_.get(row, "reason_other") && (<span>Lý do khác: {_.get(row, "reason_other")}</span>)}
                        </>
                    )
                },
                {
                    title: "Thời gian",
                    width: 200,
                    cell: row => (
                        <>{monent.unix(_.get(row, "created_at")).format("DD-MM-YYYY hh:mm:ss")}</>
                    )
                },
                {
                    title: "IP Address",
                    width: 100,
                    accessor: "ip"
                }
            ]
        };

        this.onDelete = this._onDelete.bind(this);
    }

    _onDelete(id) {
        const {actions, seeker} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa lịch sử ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deletePointGuarantee({
                    reason: id,
                    seeker_id: seeker.id
                });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, 'GuaranteeReport')
            }
        });
    }


    render() {
        const {columnsList, columnsReport} = this.state;
        const {history, seeker} = this.props;
        const guarantee_reason = utils.convertArrayValueCommonData(this.props.common, Constant.COMMON_DATA_KEY_guarantee_reason);
        const employer_report_abuse = utils.convertArrayValueCommonData(this.props.common, Constant.COMMON_DATA_KEY_employer_report_abuse);
        const reasons = [...guarantee_reason, ...employer_report_abuse];
        return (
            <>
                <div className={"row mt15"}>
                    <Filter idKey={"GuaranteeList"}>
                        <SearchField className={"col-md-3"} type="datetimerangepicker" label="Thời gian" name="created_at"/>
                        <SearchField className={"col-md-3"} type="dropbox" label="Lý do" name="reason" data={reasons}/>
                    </Filter>
                    <div className={"clearfix"}/>
                </div>

                <div className={"row mt15"}>
                    <div className={"col-md-12 mt10"}>
                        <Gird idKey={"GuaranteeReport"}
                              fetchApi={getPointGuaranteeReport}
                              query={{seeker_id: seeker.id, common:reasons}}
                              columns={columnsReport}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                              isPagination={false}
                        />
                    </div>
                </div>

                <div className={"row mt15"}>
                    <div className={"col-md-12 mt10"}>
                        <Gird idKey={"GuaranteeList"}
                              fetchApi={getPointGuaranteeList}
                              defaultQuery={{seeker_id: seeker.id, includes: "employer_info"}}
                              columns={columnsList}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                        />
                    </div>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        common: _.get(state, ['sys', 'common', 'items'], null)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryReport);