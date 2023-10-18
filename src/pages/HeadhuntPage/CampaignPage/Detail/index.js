import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {
    getListHeadhuntCampaignDetail,
    toggleHeadhuntCampaignDetail
} from "api/headhunt";
import moment from "moment";
import EditCampaignDetail from "pages/HeadhuntPage/CampaignPage/Detail/Edit";

const idKey = "CampaignDetailList";


class CampaignDetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên Campaign",
                    width: 200,
                    cell: row => <>{row.campaign_id} - {row?.campaign_info?.name}</>
                },
                {
                    title: "Tên gói dịch vụ",
                    width: 200,
                    cell: row => <>{row?.reference_id} - {row?.reference_name}</>
                },

                {
                    title: "Lọai gói",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_campaign_type}
                                    value={row?.type} notStyle/>,
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_campaign_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Ngày bắt đầu",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {row.start_date && moment.unix(row.start_date)
                                .format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày kết thúc",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {row.end_date && moment.unix(row.end_date)
                                .format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Applicant",
                    width: 120,
                    accessor: "total_applicant"
                },
                {
                    title: "CPA",
                    width: 120,
                    accessor: "cpa"
                },
                {
                    title: "Hành động",
                    width: 240,
                    cell: row => (
                        <>
                             <span className="text-link text-blue font-bold mr10"
                                   onClick={() => this.onEdit(row?.id)}>
                                   Sửa
                             </span>
                            {row.status === Constant.EXPERIMENT_STATUS_ACTIVE && (
                                <span className="text-underline cursor-pointer text-warning font-bold"
                                      onClick={() => this.onToggle(row?.id)}>
                                   Tắt
                                </span>
                            )}
                            {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
                                <span className="text-underline cursor-pointer text-success font-bold"
                                      onClick={() => this.onToggle(row?.id)}>
                                    Bật
                                </span>
                            )}
                        </>
                    )
                },
            ],
            loading: false,
        };
        this.onEdit = this._onEdit.bind(this);
        this.onToggle = this._onToggle.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {id: campaign_id} = this.props;
        this.props.actions.createPopup(EditCampaignDetail, "Thêm Campaign Detail", {campaign_id, idKey})
    }

    _onEdit(id) {
        const {id: campaign_id} = this.props;
        this.props.actions.createPopup(EditCampaignDetail, "Chỉnh sửa Campaign Detail",{id,campaign_id,idKey})
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleHeadhuntCampaignDetail({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {id, history} = this.props;

        return (
            <Default
                title="Campaign Detail"
                buttons={(
                    <div className="left btnCreateNTD">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </div>
                )}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntCampaignDetail}
                      columns={columns}
                      defaultQuery={{campaign_id: id }}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute={false}
                      isPushRoute={false}
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailList);
