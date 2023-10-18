import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import PopupAddStaff from "pages/Payment/BankPage/Popup/AddStaff";
import classnames from 'classnames';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {deleteBankStaff, getListBankStaff} from "api/statement";
import moment from "moment";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {publish, subscribe} from "utils/event";

const idKey = "BankStaffList";

class Staff extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
        };
        this.asyncData = this._asyncData.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
    }

    async _asyncData() {
        const {object} = this.props;
        const res = await getListBankStaff({bank_id: object.id});
        if (res) {
            this.setState({data_list: res, loading: false});
        }
    }

    _btnAdd() {
        const {uiAction, object} = this.props;
        uiAction.createPopup(PopupAddStaff, "Thêm KTCN", {bank_id: object.id, idKey: idKey});
    }

    async _btnDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                this.setState({loading: true});
                const res = await deleteBankStaff({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                this.setState({loading: false});
            }
        });
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {data_list, loading} = this.state;

        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 crm-section">
                            <div className="top-table">
                                <div className="left">
                                    <CanRender actionCode={ROLES.payment_manage_bank_create_staff_bank}>
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                                onClick={this.btnAdd}>
                                            <span>Thêm nhân viên <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </CanRender>
                                </div>
                            </div>
                            {loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <TableComponent DragScroll={false}>
                                    <TableHeader tableType="TableHeader" width={300}>
                                        Tên Nhân viên
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Email
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Ngày thêm
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Thao tác
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {data_list.map((item, key) => {
                                            return (
                                                <tr key={key}
                                                    className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
                                                    <td>
                                                        <div className="cell">{item?.staff_info?.display_name}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">{item?.staff_info?.email}</div>
                                                    </td>
                                                    <td>
                                                        <div
                                                            className="cell">{moment.unix(item?.created_at).format('DD-MM-YYYY hh:mm:ss')}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <CanRender
                                                                actionCode={ROLES.payment_manage_bank_delete_staff_bank}>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger"
                                                                          onClick={() => {
                                                                              this.btnDelete(item?.id)
                                                                          }}>
                                                                        Xóa
                                                                    </span>
                                                                </div>
                                                            </CanRender>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Staff);
