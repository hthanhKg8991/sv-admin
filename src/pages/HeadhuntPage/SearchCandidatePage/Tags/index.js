import React, {Component} from "react";
import GirdCustomHeader from "pages/HeadhuntPage/SearchCandidatePage/GirdCustomHeader";
import {deleteTagHeadhunt, getListTagHeadhunt} from "api/headhunt";
import {publish} from "utils/event";
import {createPopup, SmartMessageBox, hideSmartMessageBox, putToastSuccess} from "actions/uiAction";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import Default from "components/Layout/Page/Default";
import AddTagPopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddTag";

const idKey = "TagsList"

class TagsPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Từ khóa",
                    width: 50,
                    accessor: "title"
                },
                {
                    title: "Candidate chứa tag",
                    width: 50,
                    accessor: "total_candidate_tag"
                },
                {
                    title: "Thao tác",
                    width: 50,
                    cell: row => <div>
                        <span onClick={() => this.onEdit(row)} className="text-link text-primary font-bold mr10">
                            Chỉnh sửa
                        </span>
                        <span onClick={() => this.onDelete(row.id)} className="text-link text-red font-bold">
                            Xóa
                        </span>
                    </div>
                }
            ]
        }
        this.onDelete = this._onDelete.bind(this);
        this.onAdd = this._onAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
    }

    _onAdd() {
        const {actions} = this.props;
        actions.createPopup(AddTagPopup, "Thêm mới", {idKey});
    }

    _onEdit(object) {
        const {actions} = this.props;
        actions.createPopup(AddTagPopup, "Chỉnh sửa", {idKey, object});
    }

    async _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteTagHeadhunt({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                    actions.hideSmartMessageBox();
                }
            }
        });
    }

    render() {
        const {history, query} = this.props;
        const {columns} = this.state;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Tags"
                buttons={(
                    <div className="left btnCreateNTD">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </div>
                )}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <GirdCustomHeader idKey={idKey} fetchApi={getListTagHeadhunt}
                                  columns={columns}
                                  isRedirectDetail={false}
                                  isPushRoute={false}
                                  history={history}/>
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createPopup,
            SmartMessageBox,
            hideSmartMessageBox,
            putToastSuccess
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(TagsPopup);

