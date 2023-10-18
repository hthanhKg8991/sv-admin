import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import * as Constant from "utils/Constant";
import moment from "moment";
import {getListCampaignDetail, getStatusZaloCampaignDetail,} from "api/zalo";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "ZaloZNSCampaignDetailList";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Campaign ID",
                    width: 60,
                    accessor: "campaign_id"
                },
                {
                    title: "Name",
                    width: 100,
                    accessor: "to_name"
                },
                {
                    title: "Phone",
                    width: 100,
                    accessor: "to_phone"
                },
                {
                    title: "Loại",
                    width: 50,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_zalo_zns_list_contact_type}
                                    value={row?.type}/>,
                },
                {
                    title: "Thời gian gửi",
                    width: 80,
                    cell: row =>
                        <span>{`${moment.unix(row.sending_schedule).format("HH")}h - ${moment.unix(row.sending_schedule).format("DD/MM/YYYY")}`}</span>,
                },
                {
                    title: "Trạng thái",
                    width: 60,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_zalo_zns_campaign_detail_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Delivery time(zalo)",
                    width: 60,
                    cell: row => <span>{moment.unix(row.delivery_time).format("DD-MM-YYYY hh:mm:ss")}</span>,
                    accessor: "delivery_time"
                },
                {
                    title: "Trạng thái gửi(zalo)",
                    width: 100,
                    cell: row => <div className={"text-center"}>{row.status_message === 0 ?
                        <i className="fa fa-refresh text-primary cursor-pointer"
                           onClick={() => this.getStatusZalo(row.id)}/> :
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_zalo_zns_campaign_detail_status_zalo}
                                    value={row?.status_message}/>}</div>,
                }
            ],
            loading: false,
        };
        this.getStatusZalo = this._getStatusZalo.bind(this);
    }

    async _getStatusZalo(id) {
        const res = await getStatusZaloCampaignDetail({id});
        if (res) {
            publish(".refresh", {}, idKey);
        }
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Campaign Detail"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListCampaignDetail}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
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
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
