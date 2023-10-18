import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getListConfig} from "api/system";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/System/ConfigPage/ComponentFilter";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "ConfigList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Mã cấu hình",
                    width: 160,
                    accessor: "code",
                },
                {
                    title: "Tên cấu hình",
                    width: 160,
                    accessor: "name",
                },
                {
                    title: "Nhóm cấu hình",
                    width: 160,
                    accessor: "group_key",
                },
                {
                    title: "Giá trị",
                    width: 160,
                    accessor: "value",
                },
                {
                    title: "Tự động load",
                    width: 160,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_auto_load_value}  value={row?.is_auto_load} />
                    )
                },
                {
                    title: "Mô tả",
                    width: 250,
                    accessor: "description"
                }
            ],
            loading : false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SYSTEM_CONFIG,
            search: '?action=edit&id=0'
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh Sách Cấu Hình"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.system_config_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListConfig}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
