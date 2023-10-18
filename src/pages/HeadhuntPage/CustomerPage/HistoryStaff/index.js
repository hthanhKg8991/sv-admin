import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {getListHeadhuntCustomerHistoryStaff} from "api/headhunt";
import * as Constant from "utils/Constant";

const idKey = "CustomerHistoryStaff";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhân viên cũ",
                    width: 100,
                    accessor: "staff_old"
                },
                {
                    title: "Nhân viên mới",
                    width: 100,
                    accessor: "staff_new"
                },
                {
                    title: "Loại",
                    width: 100,
                    cell: row => Constant.CUSTOMER_FIELD_TYPE[row.type],
                },
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
                      fetchApi={getListHeadhuntCustomerHistoryStaff}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, customer_id}}
                      history={history}
                      isRedirectDetail={false}
                      isPushRoute={false}
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
