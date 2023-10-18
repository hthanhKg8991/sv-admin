import React, { Component } from "react";
import moment from "moment";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import CanRender from 'components/Common/Ui/CanRender';
import ROLES from 'utils/ConstantActionCode';
import PopupAddEdit from "./PopupAddEdit"
import { publish } from "utils/event";
import { getListForbiddenKeyword, postDeleteForbiddenKeyword } from "api/system";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup } from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

const idKey = "ForbiddenKeyWorkList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Từ khóa cấm",
                    width: 160,
                    accessor: "keyword"
                },
                {
                    title: "Mô tả",
                    width: 160,
                    accessor: "description"
                },
                {
                    title: "Ngày thêm",
                    width: 130,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YY HH:mm:ss")}</>
                    }
                },
                {
                    title: "Ngày cập nhật",
                    width: 130,
                    cell: row => {
                        return <>{moment.unix(row?.updated_at).format("DD-MM-YY HH:mm:ss")}</>
                    }
                },
                {
                    title: "Người thêm",
                    width: 200,
                    accessor: "created_by"
                },
                {
                    title: "Hành động",
                    width: 130,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.system_forbidden_keyword_update}>
                                <span className="text-link text-warning font-bold mr10"
                                    onClick={() => { this.onClickEdit(row) }}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.system_forbidden_keyword_delete}>
                                <span className="text-link text-red font-bold"
                                    onClick={() => this.onDelete(row?.id, row?.keyword)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                }
            ],
            loading: false,
        };
        this.onDelete = this._onDelete.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
    }

    _onClickAdd() {
        const { actions } = this.props;
        actions.createPopup(PopupAddEdit, "Thêm từ khóa cấm", { isEdit: false, idKey: idKey });
    }

    _onClickEdit(detail) {
        const { actions } = this.props;
        actions.createPopup(PopupAddEdit, "Chỉnh sửa từ khóa cấm", { isEdit: true, detail: detail, idKey: idKey });
    }

    _onDelete(id, keyword) {
        const { actions } = this.props;

        actions.SmartMessageBox({
            title: `Bạn có chắc muốn xóa từ khóa "${keyword}"`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await postDeleteForbiddenKeyword({ id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const { columns } = this.state;
        const { query, defaultQuery, history } = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter} />
                )}
                title="Danh sách từ khóa cấm"
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.system_forbidden_keyword_create}>
                            <div className="left btnCreateNTD">
                                <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                    <span>Thêm Từ Khóa <i
                                        className="glyphicon glyphicon-plus" /></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh" />
                    </button>
                )}
            >
                <Gird
                    idKey={idKey}
                    fetchApi={getListForbiddenKeyword}
                    columns={columns}
                    query={query}
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
        actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
