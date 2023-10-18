import React from "react";
import ComponentFilter from "./ResumeAppliedHistory/ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import { getDeleteRequestEmployer, getListRequirement } from 'api/employer';
import { publish } from 'utils/event';
import { bindActionCreators } from 'redux';
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox } from 'actions/uiAction';
import { connect } from 'react-redux';

class HistoryChangeEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID NTD",
                    width: 100,
                    accessor: "employer_id"
                },
                {
                    title: "Email cũ",
                    width: 150,
                    accessor: "old_data"
                },
                {
                    title: "Email mới",
                    width: 150,
                    accessor: "new_data"
                },
                {
                    title: "Lý do yêu cầu",
                    width: 200,
                    accessor: "reason_request"
                },
                {
                    title: "Lý do không duyệt",
                    width: 200,
                    accessor: "reason_reject"
                },
                {
                    title: "File đính kèm",
                    width: 70,
                    cell: row => (
                        <>
                            {row.file_path && (
                                <a href={row.file_path} rel="noopener noreferrer" target="_blank">Tải file</a>
                            )}
                        </>
                    )
                },
                {
                    title: "Người yêu cầu",
                    width: 100,
                    accessor: "staff_username_request"
                },
                {
                    title: "Người duyệt",
                    width: 100,
                    accessor: "staff_username_response"
                },
                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_status}
                                    value={row.status}/>
                    )
                },
                {
                    title: "action",
                    width: 50,
                    cell: row => (
                        Number(row.status) === Constant.STATUS_INACTIVED && props.employer_id &&
                        <span className="txt-color-red cursor-pointer text-underline" onClick={() => this.onDelete(row.id)}>
                            Xóa
                        </span>
                    )
                }
            ],
            isShow: true,
        };
        this.onDelete = this._onDelete.bind(this);
        this.onFetchSuccess = this._onFetchSuccess.bind(this);
    }

    _onFetchSuccess(data) {
        const { employer_id } = this.props;
        if (employer_id && data.total_items === 0) {
            this.setState({ isShow: false });
        }else{
            this.setState({ isShow: true });
        }
    }

    _onDelete(id) {
        const { actions } = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa yêu cầu này ?',
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const { actions } = this.props;
                const res = getDeleteRequestEmployer(id);
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, this.props.idKey)
            }
        });
    }


    render() {
        const { history, employer_id, idKey } = this.props;
        const { columns , isShow} = this.state;
        let buildColumns = columns;
        // Nếu không tồn tại id thì nó là page List không phải page chi tiết.
        if (!employer_id) {
            buildColumns = buildColumns.filter(_ => (_.title !== "action"))
        }
        const defaultQuery = employer_id > 0 ? {
                type: Constant.REASON_APPROVE_CHANGE_EMAIL,
                employer_id
            }
            : {
                not_status: [Constant.STATUS_INACTIVED, Constant.STATUS_DELETED],
                type: Constant.REASON_APPROVE_CHANGE_EMAIL
            }
        return (
            <div className={`${!isShow && "hidden"}`}>
                {!employer_id ? (
                    <ComponentFilter idKey={idKey}/>
                ) : (
                    <h3 className="mb20 mt30">Lịch sử yêu cầu đổi email công ty</h3>
                )}
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={idKey} fetchApi={getListRequirement}
                              onFetchSuccess={this.onFetchSuccess}
                              defaultQuery={defaultQuery}
                              columns={buildColumns}
                              history={history}
                              hideTableWhenNullData
                              isPushRoute={false}
                              isRedirectDetail={false}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox },
            dispatch)
    };
}

export default connect(null, mapDispatchToProps)(HistoryChangeEmail)
