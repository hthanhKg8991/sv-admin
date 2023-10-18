import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getDetailFieldQuotationRequest} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox,} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import {formatNumber} from "utils/utils";
import queryString from 'query-string';
import _ from "lodash";

const idKey = "QuotationRequestDetail";

class List extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        this.state = {
            quotation_request_id: queryParsed?.id,
            columns: [
                {
                    title: "Gói dịch vụ",
                    width: 200,
                    accessor: "sku_name"
                },
                {
                    title: "Số lượng",
                    width: 80,
                    cell: row => (
                        <>{row?.quantity} {row?.unit}</>
                    )
                },
                {
                    title: "Số tuần",
                    width: 80,
                    accessor: "week_quantity"
                },
                {
                    title: "Thành tiền",
                    width: 160,
                    cell: row => formatNumber(row?.total, 0, ".", "đ")
                },
            ]
        };
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.goBack();
        return true;
    }

    render() {
        const {columns, quotation_request_id} = this.state;
        const {query, history} = this.props;
        return (
            <Default
                title="Danh Sách Gói Hiệu Quả Từ Đăng Ký"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <div className="mt10 mb10">
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                </div>
                <Gird idKey={idKey}
                      fetchApi={getDetailFieldQuotationRequest}
                      query={query}
                      columns={columns}
                      defaultQuery={{quotation_request_id}}
                      history={history}
                      isReplaceRoute={true}
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
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
