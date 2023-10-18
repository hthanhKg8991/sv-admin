import React, { Component } from "react";
import Gird from "components/Common/Ui/Table/Gird";
import { getListUppercaseKeyword, postDeleteUppercaseKeyword } from "api/system";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox } from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import moment from "moment";
import CanRender from 'components/Common/Ui/CanRender';
import ROLES from 'utils/ConstantActionCode';
import * as Constant from 'utils/Constant';

const idKey = "UppercaseKeyWorkList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Từ khóa",
                    width: 160,
                    accessor: "keyword"
                },
                {
                    title: "Từ in Hoa",
                    width: 160,
                    accessor: "uppercase"
                },
                {
                    title: "Mô tả",
                    width: 160,
                    accessor: "description"
                },
                {
                    title: "Ngày thêm vào",
                    width: 160,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YY HH:mm:ss")}</>
                    }
                },
                {
                    title: "Ngày cập nhật",
                    width: 160,
                    cell: row => {
                        return <>{moment.unix(row?.updated_at).format("DD-MM-YY HH:mm:ss")}</>
                    }
                },
                {
                    title: "",
                    width: 160,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.system_uppercase_keyword_delete}>
                                <span className="textRed text-underline cursor-pointer"
                                      onClick={() => this.onDelete(row.id)}>
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
    }

    _onClickAdd() {
        const { history } = this.props;
        history.push({
            pathname: Constant.BASE_URL_SYSTEM_UPPERCASE_KEYWORD,
            search: '?action=detail&id=0'
        });
    }

    _onDelete(id) {
        const { actions } = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa Từ Khóa này',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await postDeleteUppercaseKeyword({ id });
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
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách Từ khóa In Hoa"
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.system_uppercase_keyword_create}>
                            <div className="left btnCreateNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm Từ Khóa <i
                                        className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListUppercaseKeyword}
                      query={{}}
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
        actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox },
            dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
