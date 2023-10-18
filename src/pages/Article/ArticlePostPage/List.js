import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getArticle} from "api/article";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import moment from "moment";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Article/ArticlePostPage/ComponentFilter";
import Detail from "./Detail";
import PopupArticlePost from "./Popup/PopupArticlePost";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";

class List extends Component {
    constructor(props) {
        super(props);

        let channel_list = utils.convertArrayToObject(props.sys.channel.items, 'code');
        this.state = {
            columns: [
                {
                    title: "Tiêu đề",
                    width: 200,
                    accessor: 'title'
                },
                {
                    title: "Slug",
                    width: 200,
                    accessor: 'title_slug'
                },
                {
                    title: "Kênh",
                    width: 120,
                    cell: row => (
                        <>{channel_list[row.channel_code] ? channel_list[row.channel_code].display_name : row.channel_code}</>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_article_status} value={row.status}/>
                    )
                },
                {
                    title: "Ngày đăng",
                    width: 160,
                    cell: row => (
                        <>{moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}</>
                    )
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        this.props.uiAction.createPopup(PopupArticlePost, 'Thêm Bài Viết', {object: {}});
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;
        const idKey = "ArticlePostList";

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title={'Danh Sách Bài Viết'}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" ref={input => this.refreshBtn = input}
                            onClick={() => {
                                publish(".refresh", {}, idKey)
                            }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.article_post_create}>
                            <div className="left btnCreateNTD">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm Bài Viết <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey} fetchApi={getArticle}
                      query={query} columns={columns}
                      history={history}
                      expandRow={row => <Detail {...row}/>}/>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
