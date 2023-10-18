import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import Ckeditor from 'components/Common/InputValue/Ckeditor';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {createArticle, updateArticle} from "api/article";
import {publish} from "utils/event";

class PopupArticlePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_error: {},
            object_required: ['title', 'title_slug', 'description', 'meta_description', 'meta_keyword']
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    async _onSave(object) {
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();

        let res;
        if (!object.id) {
            res = await createArticle(object);
        } else {
            res = await updateArticle(object);
        }

        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.uiAction.deletePopup();
            publish(".refresh", {}, 'ArticlePostList');
        }
        this.props.uiAction.hideLoading();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;

        // create slug
        if (name === 'title' && !object.id)
            object['title_slug'] = utils.stringToSlug(value);

        this.setState({object: object});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {object, object_error, object_required, name_focus} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12 mb30">
                                    <Input2 type="text" name="title" label="Tiêu đề"
                                            required={object_required.includes('title')}
                                            error={object_error.title} value={object.title} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb30">
                                    <Input2 type="text" name="title_slug" label="Slug"
                                            required={object_required.includes('title_slug')}
                                            error={object_error.title_slug} value={object.title_slug}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Ckeditor name="description"
                                              label="Ghi chú"
                                              height={100}
                                              required={object_required.includes('description')}
                                              toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                              value={object.description}
                                              error={object_error.description}
                                              onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb30">
                                    <Input2 type="text" name="meta_description" label="Meta description"
                                            required={object_required.includes('meta_description')}
                                            error={object_error.meta_description}
                                            value={object.meta_description}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb30">
                                    <Input2 type="text" name="meta_keyword" label="Meta keyword"
                                            required={object_required.includes('meta_keyword')}
                                            error={object_error.meta_keyword}
                                            value={object.meta_keyword}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
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
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupArticlePost);
