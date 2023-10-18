import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/System/ShareBasketDetailListPage/ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import {getListShareBasketDetail, updateAllShareBasketDetail} from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

const idKey = "ShareRoomBasketList";

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    title: "Tên danh sách nhận",
                    width: 200,
                    accessor: "config_name",
                },
                {
                    title: "Loại CSKH",
                    width: 200,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_assigned_type} value={row?.assigned_type} notStyle/>
                },
                {
                    title: "Username CSKH",
                    width: 200,
                    accessor: "assigned_staff_username",
                },
                {
                    title: "Đánh dấu DS đen",
                    width: 100,
                    cell: row => row?.is_blacklist && <p className="text-center font-bold">X</p>,
                },
            ],
            loading : false,
        };

        this.onUpdateAll = this._onUpdateAll.bind(this);
    }

    async _onUpdateAll() {
        const {actions} = this.props;
        this.setState({loading: true});
        const res = await updateAllShareBasketDetail();
        if(res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess("Thao tác thành công!");
                publish(".refresh", {}, idKey);
            });
        }
    }

    render() {
        const {columns, loading} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <>
                {loading && <LoadingSmall className="form-loading"/>}
                <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="DS CSKH nhận giỏ"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.system_config_employer_share_basket_detail_update_all}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onUpdateAll}>
                                    <span>Cập nhật danh sách CSKH nhận giỏ</span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                    <Gird idKey={idKey}
                          fetchApi={getListShareBasketDetail}
                          query={query}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                          isRedirectDetail={false}
                    />
                </Default>
            </>
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
