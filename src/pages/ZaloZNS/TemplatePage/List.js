import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "./Popup/PopupForm";
import * as Constant from "utils/Constant";
import {
    getListTemplate, syncTemplate,
} from "api/zalo";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "ZaloZNSTemplateList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Template Zalo Id",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Trạng thái",
                    width: 50,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_zalo_zns_template_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 50,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.zalo_zns_template_update}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onClickSync = this._onClickSync.bind(this);
        this.onEdit = this._onEdit.bind(this);
    }

    _onClickSync() {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có Sync Data Template',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await syncTemplate();
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    _onEdit(object) {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Chỉnh sửa', {idKey, object});
    }


    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Quản Lý Template"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.zalo_zns_template_sync}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickSync}>
                                <span>Sync data <i className="glyphicon glyphicon-refresh"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListTemplate}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
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
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
