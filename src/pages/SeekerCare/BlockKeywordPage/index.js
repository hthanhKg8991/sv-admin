import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PopupBlockKeyword from "./Popup";
import * as uiAction from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import {delSeekerResumeBlacklistKeyword, getSeekerResumeBlacklistKeyword} from "api/system";
const idKey = 'SeekerCareResumeBlacklist';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            columns: [
                {
                    title: "Từ Khóa",
                    width: 220,
                    accessor: "title"
                },
                {
                    title: "Slug",
                    width: 220,
                    accessor: "slug"
                },
                {
                    title: "Thao tác",
                    width: 80,
                    cell: row => <div className="text-center">
                        <span className="text-red font-bold" onClick={() => this.btnDelete(row.id)}>Xóa</span>
                    </div>
                }
            ]
        };
        this.btnAdd = this._btnAdd.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupBlockKeyword, "Thêm Từ Khóa Cấm", {idKey});
    }
    _btnDelete(id){
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await delSeekerResumeBlacklistKeyword({blacklist_keyword_id: id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render () {
        let {columns} = this.state;
        let {query, history, defaultQuery} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter  idKey={idKey} history={history} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title='Danh sách từ khóa cấm'
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.btnAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </div>
                )}
            >
                <Gird idKey={idKey} fetchApi={getSeekerResumeBlacklistKeyword}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}/>
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(null, mapDispatchToProps)(index);
