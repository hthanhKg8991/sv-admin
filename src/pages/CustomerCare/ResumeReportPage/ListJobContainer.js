import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getDetailGuaranteeReport} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilterJob";
import {
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox,
} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import queryString from 'query-string';
import _ from "lodash";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "EmployerGuaranteeReportDetail";

class List extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        this.state = {
            employer_id: queryParsed?.employer_id,
            columns: [
                {
                    title: "ID Hồ Sơ",
                    width: 100,
                    accessor: "seeker_id"
                },
                {
                    title: "Họ và tên",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            <span className="cursor-pointer"
                                  style={{color: '#3276b1'}}>{row?.seeker_info?.name}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.seeker_id
                        };
                        window.open(Constant.BASE_URL_SEEKER + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Lý do báo xấu",
                    width: 250,
                    cell: row => (<>
                        <SpanCommon value={row?.reason} idKey={Constant.COMMON_DATA_KEY_guarantee_reason} notStyle/>
                        <br/>
                        {row?.reason_other && (
                            <span>
                            - Lý do khác : {row?.reason_other}
                        </span>
                        )}
                    </>)
                },
                {
                    title: "Ngày đánh giá",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
            ]
        };
        this.onDetail = this._onDetail.bind(this);
        this.goBack = this._goBack.bind(this);
    }


    _onDetail(row) {
        const {history} = this.props;
        const {employer_id} = row;
        history.push({
            pathname: Constant.BASE_URL_GUARANTEE_JOB,
            search: '?action=edit&employer_id=' + employer_id || 0,
        });
    }

    _goBack() {
        const {history} = this.props;
        history.goBack();
        return true;
    }

    render() {
        const {columns, employer_id} = this.state;
        const {query, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Lịch sử báo xấu ứng viên"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getDetailGuaranteeReport}
                      query={query}
                      columns={columns}
                      defaultQuery={{employer_id}}
                      history={history}
                      isPushRoute={false}
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
