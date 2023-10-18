import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SEO/TagPage/ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteTag, getListTag, importTag} from "api/employer";

const idKey = "TagList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Title",
                    width: 130,
                    accessor: "title"
                },
                {
                    title: "Slug",
                    width: 130,
                    accessor: "slug"
                },
                {
                    title: "Meta title",
                    width: 130,
                    accessor: "meta_title"
                },
                {
                    title: "Meta description",
                    width: 130,
                    accessor: "meta_description"
                },
                {
                    title: "Keywords",
                    width: 130,
                    accessor: "meta_keywords"
                },
                {
                    title: "Từ khóa",
                    width: 130,
                    cell: row => {
                        const {tag_keywords} = row;
                        if(!Array.isArray(tag_keywords)) {return ""};
                        return tag_keywords.map((_, idx) => <React.Fragment key={idx.toString()}>{_} <br/></React.Fragment>)
                    }
                },
                {
                    title: "Hành động",
                    width: 130,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.article_tag_update}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>Chỉnh sửa</span> <br/>
                            </CanRender>
                            <span className="text-link text-green font-bold" onClick={() => this.onView(row)} >Xem</span> <br/>
                            <CanRender actionCode={ROLES.article_tag_delete}>
                                <span className="text-link text-red font-bold" onClick={() => this.onDelete(row?.id)}>Xóa</span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading : false,
            isImport: true,
        };

        this.textInput = React.createRef();
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onImportFile = this._onImportFile.bind(this);
        this.onView = this._onView.bind(this);
    }

    async _onChangeFileImport(event) {
        const {actions} = this.props;
        const file = event.target.files[0];
        if(!file){
            return;
        }
        this.setState({isImport: false});
        const {name} = file;
        const ext = name?.split(".").pop();
        if(Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
            let data = new FormData();
            data.append("file", file);
            const body = {file: data,up_file: true};
            const resImport = await importTag(body);
            if(resImport) {
                this.setState({loading: false});
                actions.putToastSuccess(`Import ${resImport?.total_import} dữ liệu thành công!`);
                publish(".refresh", {}, idKey);
            }
        } else {
            actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
        }
        this.setState({isImport: true});
    }

    async _onImportFile() {
        this.textInput.current.click();
    }

    _onView(object) {
        const {channel_code} = this.props.branch.currentBranch;
        const slug = String(object?.link_301) === String(object?.slug) || !object.link_301 ?
                `${Constant.TAG_LINK_FE[channel_code]}/${object?.slug}`:
                object?.link_301;
        window.open(`${Constant.URL_FE[channel_code]}/${slug}`);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TAG,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TAG,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa tag ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteTag({id});
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
        const {columns, isImport} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh Sách Tag"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.article_tag_add}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                            <CanRender actionCode={ROLES.article_tag_import}>
                                {isImport && <input type="file" ref={this.textInput} className="form-control mb10 hidden" onChange={this.onChangeFileImport}/>}
                                <button type="button" className="el-button el-button-warning el-button-small" onClick={this.onImportFile}>
                                    <span>Import dữ liệu <i className="glyphicon glyphicon-upload"/> </span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListTag}
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
