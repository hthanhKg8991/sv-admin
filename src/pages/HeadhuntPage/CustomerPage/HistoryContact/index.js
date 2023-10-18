import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {getListHeadhuntCustomerContactHistory} from "api/headhunt";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import Detail from "pages/HeadhuntPage/CustomerPage/HistoryContact/Detail";

const idKey = "CustomerHistoryList";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Người cập nhật",
                    width: 100,
                    accessor: "created_by"
                },
                {
                    title: "Ngày cập nhật",
                    width: 100,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_status}
                                             value={row.status}/>,
                },
            ],
            loading: false,
        };
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, customer_id} = this.props;
        return (
            <div className="padding-10">
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntCustomerContactHistory}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, customer_id}}
                      history={history}
                      isRedirectDetail={false}
                      isPushRoute={false}
                      expandRow={row => <Detail {...row}/>}
                />
            </div>
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
