import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {bindActionCreators} from 'redux';
import {exportListSME, getListSME} from "api/saleOrder";
import {publish} from "utils/event";
import {putToastSuccess} from "actions/uiAction";
import {renderColumns} from "./table";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerPageSME/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import moment from "moment";

const idKey = "EmployerListSME";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: renderColumns(props),
            loading: false,
        };
        this.onClickExport = this._onClickExport.bind(this);
    }

    async asyncExport() {
        const {actions, query} = this.props;
        const res = await exportListSME(query);
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess('Thao tác thành công');
            });
        } else {
            this.setState({loading: false});
        }
    }

    _onClickExport() {
        if (this.state.loading === false) {
            this.setState({loading: true}, () => {
                this.asyncExport();
            });
        }
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, is_archived, user} = this.props;
        // Nếu NTD là trường nhóm thì filter CSKH thuộc nhóm NTD đó
        const staffFilter = user?.data?.division_code === Constant.DIVISION_TYPE_customer_care_leader ?
            {"assigned_staff_id[0]": user?.data?.id} : {};
        let defaultQuerySearch = {...query, ...staffFilter, year: moment().format('YYYY')} ;
        let apiFetch = getListSME;
        const actionCodeExport = ROLES.customer_care_employer_sme_30_export;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query}
                                ComponentFilter={ComponentFilter} is_archived={is_archived}/>
                )}
                title={`Danh Sách Nhà Tuyển Dụng SME > 30M`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={actionCodeExport}>
                            <div className="left btnExportNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickExport}>
                                    <span>Xuất Excel  <i
                                        className="glyphicon glyphicon-file"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey}
                      fetchApi={apiFetch}
                      query={defaultQuerySearch}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}/>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
