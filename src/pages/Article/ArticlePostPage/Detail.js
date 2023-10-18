import React, {Component} from "react";
import {
    toggleStatusArticle,
    deleteArticle
} from "api/article";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import {connect} from "react-redux";
import {publish} from "utils/event";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import PopupArticlePost from "pages/Article/ArticlePostPage/Popup/PopupArticlePost";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.onToggleStatus = this._onToggleStatus.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onEdit() {
        const object = this.props;
        this.props.uiAction.createPopup(PopupArticlePost, 'Chỉnh Sửa Bài Viết', {object});
    }

    async _onDelete() {
        const object = this.props;
        const res = await deleteArticle({id: object.id});
        if (res) {
            const {actions} = this.props;
            actions.putToastSuccess('Xóa bài viết thành công');
            publish(".refresh", {}, 'ArticlePostList')
        }
    }

    async _onToggleStatus() {
        const {id, actions} = this.props;
        const res = await toggleStatusArticle({id});
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
        }
        publish(".refresh", {}, 'ArticlePostList');
    }

    render() {
        const object = this.props;
        return (
            <>
                {object.status !== 99 && (
                    <>
                        {/*<CanRender actionCode={ROLES.article_post_toggle_status}>*/}
                            <button type="button"
                                    className={`el-button ${object.status === 1 ? 'el-button-warning' : 'el-button-primary'} el-button-small`}
                                    onClick={this.onToggleStatus}>
                                <span>{(object.status === 1) ? 'Hủy kích hoạt' : 'Kích hoạt'}</span>
                            </button>
                        {/*</CanRender>*/}

                        <CanRender actionCode={ROLES.article_post_update}>
                            <button type="button"
                                    className={`el-button el-button-info el-button-small`}
                                    onClick={this.onEdit}>
                                <span>Chỉnh sửa</span>
                            </button>
                        </CanRender>

                        <CanRender actionCode={ROLES.article_post_delete}>
                            <button type="button"
                                    className={`el-button el-button-bricky el-button-small`}
                                    onClick={this.onDelete}>
                                <span>Xóa</span>
                            </button>
                        </CanRender>
                    </>
                )}

                {object.status === 99 && (
                    <span style={{fontSize: "12px"}}>Bài viết đã bị xóa!</span>
                )}
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Detail);

