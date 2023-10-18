import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Payment/BankPage/ComponentFilter";
import Staff from "pages/Payment/BankPage/Staff";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import {getListBank, updateStatusPrint} from "api/statement";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const idKey = "BankList";


class List extends Component {
    constructor(props) {
        super(props);
        this.updateStatusPrint = this._updateStatusPrint.bind(this);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Logo",
                    width: 80,
                    cell: row => row?.logo && (
                        <img src={row?.logo} alt="logo" className="bank-logo"/>
                    )
                },
                {
                    title: "Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Tên ngân hàng",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Chi nhánh",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_branch_name}
                                    value={row?.branch_code} notStyle/>,
                },
                {
                    title: "Số tài khoản",
                    width: 200,
                    accessor: "account_number"
                },
                {
                    title: 'Trạng thái',
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_bank_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Ngày tạo",
                    width: 120,
                    time: true,
                    accessor: "created_at",
                },
                {
                    title: "Hiển thị trên PĐK",
                    width: 120,
                    time: true,
                    onClick: _ => {},
                    cell: row => <div className="text-center">
                        <FormControlLabel
                        control={<Checkbox
                            checked={row.status_print === 1}
                            color="primary"
                            disabled={row.status === 99}
                            icon={
                                <CheckBoxOutlineBlankIcon
                                    fontSize="large"/>}
                            checkedIcon={
                                <CheckBoxIcon
                                    fontSize="large"/>}
                            onChange={() => {
                                this.updateStatusPrint(row.id, row.status_print === Constant.COMMON_DATA_KEY_BANK_STATUS_PRINT_SHOW ? Constant.COMMON_DATA_KEY_BANK_STATUS_PRINT_HIDE : Constant.COMMON_DATA_KEY_BANK_STATUS_PRINT_SHOW)
                            }}/>}
                    />
                    </div>,
                },
            ],
            loading: false,
        };
    }
    async _updateStatusPrint(id, status_print) {
        const res = await updateStatusPrint({id, status_print});
        if (res){
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Bank"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListBank}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                      expandRow={row => <Staff object={row}/>}
                />
            </Default>
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
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
