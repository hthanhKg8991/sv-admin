import React, {Component} from "react";
import {connect} from "react-redux";
import Edit from "./Edit";
import Default from "components/Layout/Page/Default";
import {publish, subscribe} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import AcceptanceRecordPackage from "./Detail";
import {getDetailHeadhuntAcceptanceRecord, getDetailHeadhuntSalesOrder} from "api/headhunt";
import * as Constant from "utils/Constant";

const idKey = "AcceptanceRecordEdit";

class EditContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            item: null,
            sales_order: null,
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                if (this.state.id > 0) {
                    this.getDetail(false);
                }
            });
        }, idKey));

        this.getDetail = this._getDetail.bind(this);
        this.refreshId = this._refreshId.bind(this);
        this.getSalesOrderDetail = this._getSalesOrderDetail.bind(this);
    }

    async _getSalesOrderDetail(id) {
        const res = await getDetailHeadhuntSalesOrder({
            id
        });
        if (res) {
            this.setState({sales_order: res});
        }
    }

    async _getDetail(getSO = true) {
        const res = await getDetailHeadhuntAcceptanceRecord({
            id: this.state.id
        });
        if (res) {
            if (getSO) {
                this.getSalesOrderDetail(res.sales_order_id);
            }
            this.setState({item: res});
        }
    }

    async _refreshId(id) {
        this.setState({id}, () => {
            this.getDetail(true);
        });
    }

    componentDidMount() {
        if (this.state.id > 0) {
            this.getDetail();
        }
    }

    render() {
        const {history, common} = this.props;
        const {id, item, sales_order} = this.state;
        let text_status = '';
        if (item) {
            text_status = common.items[Constant.COMMON_DATA_KEY_headhunt_acceptance_record_status].find(v => v.value === item.status)?.name || "";
        }
        return (
            <>
                <Default
                    title={`${id > 0 ? "Chỉnh Sửa" : "Tạo"} biên bản nghiệm thu: ${id} - ${text_status}`}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                    <Edit refreshId={this.refreshId} idKey={idKey} id={id} history={history} item={item}/>
                </Default>
                {sales_order && item && (
                    <div className="col-result col-result-full">
                        <AcceptanceRecordPackage id={id} sales_order={sales_order} history={history}
                                                 idKeySalesOrder={idKey} item={item} idKeyDetail={idKey}/>
                    </div>
                )}
            </>

        )

    }
}

function mapStateToProps(state) {
    return {
        common: state.sys.common,
    };
}

export default connect(mapStateToProps, null)(EditContainer);
