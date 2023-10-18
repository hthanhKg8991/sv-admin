import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {getListEmployerHistoryClass} from "api/employer";

class HistoryClassContainer extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            columns: [
                {
                    title: "Phân loại hiện tại",
                    width: 200,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                             value={row?.employer_classification_new} notStyle/>
                },
                {
                    title: "Phân loại cũ",
                    width: 200,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                             value={row?.employer_classification_old} notStyle/>
                },
                {
                    title: "Thời gian phân loại",
                    width: 200,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Phòng",
                    width: 200,
                    accessor: "room_info.name",
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
        const idKey = "HistoryClassList";

        return (
            <Default
                title="Lịch Sử Xác Thực Phân Loại Nhà Tuyển Dụng"
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
                      fetchApi={getListEmployerHistoryClass}
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

export default connect(null, null)(HistoryClassContainer);
