import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import * as Constant from "utils/Constant";
import Default from "components/Layout/Page/Default";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {getEmployerAccuracyLog} from "api/employer";
import queryString from "query-string";

class HistoryEmailVerifyContainer extends Component {
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
            employer_id: _.get(queryParsed, 'id'),
        };

        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        const {employer_id} = this.state;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?action=detail&id=' + employer_id
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?' + queryString.stringify({
                    ...search,
                    action: 'detail',
                    id: employer_id
                })
            });

            return true;
        }
    }

    render() {
        const {history, query, defaultQuery} = this.props;
        const {columns, employer_id} = this.state;
        const idKey = "HistoryEmailVerifyList";

        return (
            <Default
                title={"Lịch Sử Xác Thực Email Nhà Tuyển Dụng"}
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
                      fetchApi={getEmployerAccuracyLog}
                      columns={columns}
                      query={{...query, employer_id: employer_id}}
                      defaultQuery={defaultQuery}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                />
            </Default>
        );
    }
}

export default connect(null, null)(HistoryEmailVerifyContainer);
