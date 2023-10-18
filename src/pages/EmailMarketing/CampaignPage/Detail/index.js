import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, SmartMessageBox, createPopup} from "actions/uiAction";
import * as Constant from "utils/Constant";
import moment from "moment";
import {getListCampaignDetail,} from "api/emailMarketing";
import SpanCommon from "components/Common/Ui/SpanCommon";
const idKey = "EmailMarketingCampaignDetailList";

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
                    title: "Email",
                    width: 100,
                    accessor: "to_email"
                },
                {
                    title: "Loại",
                    width: 50,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_email_marketing_list_contact_type} notStyle
                                    value={row?.type}/>,
                },
                {
                    title: "Send",
                    width: 50,
                    accessor: "sent"
                },
                {
                    title: "Opened",
                    width: 50,
                    accessor: "opened"
                },
                {
                    title: "Click",
                    width: 50,
                    accessor: "click"
                },  {
                    title: "Unsubscribe",
                    width: 50,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_email_marketing_campaign_unsubscribe_type}
                                    value={row?.unsubscribe}/>
                },
                {
                    title: "Thời gian gửi",
                    width: 80,
                    cell: row => <span>{`${moment.unix(row.sending_schedule).format("HH")}h - ${moment.unix(row.sending_schedule).format("DD/MM/YYYY")}`}</span>,
                },
                {
                    title: "Trạng thái",
                    width: 60,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_email_marketing_campaign_detail_status}
                                    value={row?.status}/>,
                }
            ],
            loading: false,
        };

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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Detail);
