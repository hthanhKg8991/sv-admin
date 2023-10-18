import React, {Component} from "react";
import {connect} from "react-redux";
import Default from "components/Layout/Page/Default";
import {publish} from "utils/event";
import _ from "lodash";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import Gird from "components/Common/Ui/Table/Gird";
import {getListVerifyLog} from "api/seeker";
import SpanCommon from "components/Common/Ui/SpanCommon";

class HistoryVerifyContainer extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            columns: [
                {
                    title: "Nội dung xác thực",
                    width: 200,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_verify_type}
                                             value={row?.verify_type} notStyle/>
                },
                {
                    title: "Thời gian xác thực",
                    width: 200,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Trạng thái",
                    width: 200,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_email_verified_status}
                                             value={row?.status} notStyle/>
                },
                {
                    title: "Người xác thực",
                    width: 200,
                    accessor: "approved_by",
                },
            ],
            seeker_id: _.get(queryParsed, 'id'),
        };

        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        const {seeker_id} = this.state;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER,
                search: '?action=detail&id=' + seeker_id
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            history.push({
                pathname: Constant.BASE_URL_SEEKER,
                search: '?' + queryString.stringify({
                    ...search,
                    action: 'detail',
                    id: seeker_id
                })
            });

            return true;
        }
    }

    render() {
        const {history, query, defaultQuery} = this.props;
        const {columns, seeker_id} = this.state;
        const idKey = "HistoryVerifyList";

        return (
            <Default
                title={"Lịch sử xác thực email/số điện thoại"}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <div className="left btnCreateNTD">
                        <button type="button" className="el-button el-button-default el-button-small"
                                onClick={() => this.goBack()}>
                            <span>Quay lại</span>
                        </button>
                    </div>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getListVerifyLog}
                      columns={columns}
                      query={{...query, seeker_id: seeker_id}}
                      defaultQuery={defaultQuery}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                />
            </Default>
        );
    }
}

export default connect(null, null)(HistoryVerifyContainer);
