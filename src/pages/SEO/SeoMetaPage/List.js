import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SEO/SeoMetaPage/ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteSeoMeta, getListSeoMeta} from "api/system";
import SpanText from "components/Common/Ui/SpanText";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "SeoMetaList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên trang",
                    width: 120,
                    accessor: "page_name"
                },
                {
                    title: "Trọng số",
                    width: 120,
                    cell: row => (
                        <SpanText idKey={Constant.COMMON_DATA_KEY_seo_meta_priority} value={row?.priority} />
                    )
                },
                {
                    title: "Title",
                    width: 120,
                    accessor: "title"
                },
                {
                    title: "URL",
                    width: 150,
                    accessor: "url"
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_seo_template_status} value={row?.status} />
                    )
                },
                {
                    title: "Thời gian cập nhật",
                    width: 120,
                    time: true,
                    accessor: "updated_at"
                },
                {
                    title: "Hành động",
                    width: 100,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.article_seo_meta_update}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>Chỉnh sửa</span>
                            </CanRender>
                            <CanRender actionCode={ROLES.article_seo_meta_update}>
                                <span className="text-link text-red font-bold ml5" onClick={() => this.onDelete(row?.id)}>Xóa</span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading : false,
            isImport: true,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SEO_META,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SEO_META,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa SEO meta ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteSeoMeta({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
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
                    title="Danh Sách Seo Meta"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.article_seo_template_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListSeoMeta}
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
