import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Gird from "components/Common/Ui/Table/Gird";
import {getListHeadhuntCustomerImportHistory, importHeadhuntCustomerImportHistory} from "api/headhunt";
import {publish} from "utils/event";
import config from "config";
import * as Constant from "utils/Constant";
import {putToastSuccess} from "actions/uiAction";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "CustomerImportHistoryList";

class PopupImportFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 30,
                    accessor: "id"
                },
                {
                    title: "Ngày Import",
                    width: 60,
                    cell: row => (<span>{moment.unix(row.created_at).format("DD-MM-YYYY")}</span>)
                },
                {
                    title: "Người import",
                    width: 100,
                    accessor: "created_by"
                },
                {
                    title: "File import",
                    width: 50,
                    cell: row => (<a href={row.import_url} target="_blank">File</a>)
                },
                {
                    title: "Kết quả import",
                    width: 50,
                    cell: row => (<span>{`${row.total_success}/${row.total}`}</span>)
                },
                {
                    title: "File kết quả import",
                    width: 50,
                    cell: row => (<a href={row.import_result_url} target="_blank">File</a>)
                },
                {
                    title: "Trạng thái",
                    width: 60,
                    onClick: () => {
                    },
                    cell: row => (<SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_import_history_status} value={row?.status}/>)
                },
            ],
            loading: false,
        };
        this.Ref = React.createRef();
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onDownFileSample = this._onDownFileSample.bind(this);
    }

    async _onChangeFileImport(event) {
        const {actions, type} = this.props;
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        let data = new FormData();
        data.append("file", file);
        data.append("type", type);
        const body = {file: data, up_file: true };
        const res = await importHeadhuntCustomerImportHistory(body);
        if (res) {
            actions.putToastSuccess(`Import thành công`);
            publish(".refresh", {}, idKey);
        }
        if(this.Ref.current){
            this.Ref.current.value = null;
        }
    
    }

    _onDownFileSample() {
        window.open(`${config.apiHeadHuntDomain}${this.props.link_sample}`)
    }

    render() {
        const {columns} = this.state;
        const {query, history, type} = this.props;
        return (
            <div>
                <div className="card-body">
                    <div className="crm-section">
                        <div className="mb10">
                            <label className="el-button el-button-warning el-button-small">
                                <span>Import File <i className="glyphicon glyphicon-upload"/></span>
                                <input type="file" className="hidden"
                                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                       onChange={this.onChangeFileImport} ref={this.Ref}/>
                            </label>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onDownFileSample}>
                                <span>Tải file import mẫu <i className="glyphicon glyphicon-download"/></span>
                            </button>
                        </div>
                        <div className="table-section">
                            <Gird idKey={idKey}
                                  fetchApi={getListHeadhuntCustomerImportHistory}
                                  query={query}
                                  columns={columns}
                                  defaultQuery={{type}}
                                  history={history}
                                  isRedirectDetail={false}
                            />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupImportFile);

