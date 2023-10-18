import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getListGuaranteeReport} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox,
} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import queryString from 'query-string';

const idKey = "EmployerGuaranteeReport";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID NTD",
                    width: 100,
                    accessor: "employer_id",
                },
                {
                    title: "Tên Công ty",
                    width: 300,
                    cell: row => (
                        <React.Fragment>
                            <span className="cursor-pointer"
                                  style={{color: '#3276b1'}}>{row?.employer_info?.name}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.employer_id
                        };
                        window.open(Constant.BASE_URL_EMPLOYER + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Số hồ sơ báo xấu",
                    width: 80,
                    onClick: row => {
                        this.onDetail(row);
                    },
                    cell: row => <span className="text-link">{row?.total_guarantee}</span>
                },
            ]
        };
        this.onDetail = this._onDetail.bind(this);
    }


    _onDetail(row) {
        const {history} = this.props;
        const {employer_id} = row;
        history.push({
            pathname: Constant.BASE_URL_GUARANTEE_REPORT,
            search: '?action=listJob&employer_id=' + employer_id || 0,
        });
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách NTD báo xấu ứng viên"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListGuaranteeReport}
                      query={query}
                      columns={columns}
                      defaultQuery={{}}
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
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
