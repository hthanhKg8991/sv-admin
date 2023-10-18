import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {getLogsOpportunity} from "api/saleOrder";
import Gird from "components/Common/Ui/Table/Gird";
import moment from "moment";
import classnames from "classnames";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import TableComponent from "components/Common/Ui/Table";
import {
    COMMON_DATA_KEY_bank_status,
    COMMON_DATA_KEY_opportunity_ability,
    COMMON_DATA_KEY_opportunity_active_status,
    COMMON_DATA_KEY_opportunity_contact_status,
    COMMON_DATA_KEY_opportunity_keep_reason,
    COMMON_DATA_KEY_opportunity_keep_status,
    COMMON_DATA_KEY_opportunity_keywords,
    COMMON_DATA_KEY_opportunity_level,
    COMMON_DATA_KEY_opportunity_package_type,
    COMMON_DATA_KEY_opportunity_priority,
    COMMON_DATA_KEY_opportunity_response_quote_status,
    COMMON_DATA_KEY_opportunity_send_quote_status,
    COMMON_DATA_KEY_opportunity_status,
    COMMON_DATA_KEY_opportunity_status_cancel
} from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";

const mapDataChange = {
    'employer_id': {name: 'ID NTD'},
    'channel_code': {name: 'Kênh'},
    'sales_order_id': {name: 'Mã phiếu'},
    'name': {name: 'Tên cơ hội'},
    'level': {name: 'Level cơ hội', common: COMMON_DATA_KEY_opportunity_level},
    'revenue': {name: 'Doanh số bao gồm thuế'},
    'ability': {name: 'Cấp độ khả năng', common: COMMON_DATA_KEY_opportunity_ability},
    'reason_guess': {name: 'Lý do dự đoán'},
    'expected_date': {name: 'Ngày kỳ vọng', common: "time"},
    'package_type': {name: 'Gói dịch vụ', common: COMMON_DATA_KEY_opportunity_package_type},
    'note': {name: 'Ghi chú'},
    'assigned_date': {name: 'Ngày vào giỏ', common: "time"},
    'expired_date': {name: 'Thời hạn cơ hội', common: "time"},
    'priority': {name: 'Độ ưu tiên', common: COMMON_DATA_KEY_opportunity_priority},
    'status': {name: 'Trạng thái', common: COMMON_DATA_KEY_opportunity_active_status},
    'opportunity_status': {name: 'Trạng thái cơ hội', common: COMMON_DATA_KEY_opportunity_status},
    'schedule_call': {name: 'Lịch gọi lại', common: "time"},
    'contact_status': {name: 'Trạng thái liên hệ với KH', common: COMMON_DATA_KEY_opportunity_contact_status},
    'recruitment_demand': {name: 'Nhu cầu tuyển'},
    'recruitment_demands': {name: 'Json danh sách nhu cầu tuyển'},
    'campaign': {name: 'Chiến dịch'},
    'send_quote_status': {name: 'Gửi báo giá cho KH', common: COMMON_DATA_KEY_opportunity_send_quote_status},
    'response_quote_date': {name: 'Ngày KH dự kiến phản hồi về báo giá', common: "time"},
    'response_quote_status': {name: 'Phản hồi về báo giá', common: COMMON_DATA_KEY_opportunity_response_quote_status},
    'purchase_status': {name: 'Trạng thái KH hoàn thiện thủ tục'},
    'keep_status': {name: 'Trạng thái giữ cơ hội', common: COMMON_DATA_KEY_opportunity_keep_status},
    'keep_reason': {name: 'Lý do giữ cơ hội', common: COMMON_DATA_KEY_opportunity_keep_reason},
    'keep_notice': {name: 'Ghi chú giữ cơ hội'},
    'cancel_status': {name: 'Trạng thái thất bại', common: COMMON_DATA_KEY_opportunity_status_cancel},
    'cancel_reason': {name: 'Lý do thất bại', common: 'reason'},
    'cancel_notice': {name: 'Ghi chú đóng cơ hội'},
    'staff_email': {name: 'CSKH'},
    'keywords': {name: 'Từ khóa', common: COMMON_DATA_KEY_opportunity_keywords},
    'created_at': {name: 'Ngày tạo', common: "time"},
    'created_by': {name: 'Người tạo'},
    'created_source': {name: 'Nguồn tạo'},
    'updated_at': {name: 'Ngày cập nhật', common: "time"},
}

class PopupOpportunityLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Người cập nhật",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {row?.created_by === "admin" ? "Hệ thống" : row?.created_by}
                        </React.Fragment>
                    )
                },
                {
                    title: "Thời gian cập nhật",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
            ]
        };
        this.onClose = this._onClose.bind(this);
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    _renderRow(field, value, row) {
        if (!value) {
            return " ";
        }
        if (Array.isArray(value)) {
            const data = value.map(_ => {
                this._renderRow(field, _);
            });
            return data.join(", ");
        }
        if (mapDataChange[field]?.common) {
            if (mapDataChange[field]?.common === "time") {
                return moment.unix(value)
                    .format("DD/MM/YYYY HH:mm:ss");
            }
            if (mapDataChange[field]?.common === "reason") {
                const mapList = {
                    1: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_1,
                    2: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_2,
                    4: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_4,
                    5: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_5,
                    6: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_6,
                    7: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_7,
                    99: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_99,
                }

                let commonReason;
                if(row?.new_data?.cancel_status === 1 && row?.new_data?.cancel_reason === 99){
                    commonReason = Constant.COMMON_DATA_KEY_opportunity_cancel_reason_system;
                }else{
                    commonReason = mapList[row?.old_data?.level] || Constant.COMMON_DATA_KEY_opportunity_cancel_reason_1;
                }

                return <SpanCommon value={value} idKey={commonReason} notStyle/>
            }
            return <SpanCommon value={value} idKey={mapDataChange[field]?.common} notStyle/>
        }
        return value
    }


    render() {
        const {columns, history} = this.state;
        const {id} = this.props;
        return (
            <div className="row mx-2 padding30">
                <div className={"col-md-12 mt10"}>
                    <Gird idKey={"HistoryChanged"} fetchApi={getLogsOpportunity}
                          defaultQuery={{opportunity_id: id}}
                          columns={columns}
                          history={history}
                          isPushRoute={false}
                          isRedirectDetail={false}
                          expandRow={row => (<div>
                              <TableComponent allowDragScroll={false}>
                                  <TableHeader tableType="TableHeader" width={120}>
                                      Trường thay đổi
                                  </TableHeader>
                                  <TableHeader tableType="TableHeader" width={120}>
                                      Giá trị cũ
                                  </TableHeader>
                                  <TableHeader tableType="TableHeader" width={300}>
                                      Giá trị mới
                                  </TableHeader>
                                  <TableBody tableType="TableBody">
                                      {Object.keys(row?.diff_data).length > 0 ? Object.keys(row?.diff_data).map((_, key) => {
                                          return (
                                              <React.Fragment key={key}>
                                                  <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                                      <td>
                                                          <div
                                                              className="cell-custom mt5 mb5">{mapDataChange[_]?.name || _}</div>
                                                      </td>
                                                      <td>
                                                          <div className="cell-custom mt5 mb5">
                                                              {row.old_data ? this._renderRow(_, row.diff_data[_].old) : null}
                                                          </div>
                                                      </td>
                                                      <td>
                                                          <div className="cell-custom mt5 mb5">
                                                              {this._renderRow(_, row.diff_data[_].new, row)}
                                                          </div>
                                                      </td>
                                                  </tr>
                                              </React.Fragment>
                                          )
                                      }) : (
                                          <tr>
                                              <td colSpan={3} className="table-td-empty">
                                                  <div className="cell"><span>Không có dữ liệu</span></div>
                                              </td>
                                          </tr>
                                      )}
                                  </TableBody>
                              </TableComponent>
                          </div>)
                          }
                          indexExpandRow={0}/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupOpportunityLogs);
