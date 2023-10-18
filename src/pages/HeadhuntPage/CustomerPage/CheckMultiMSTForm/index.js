import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { importHeadhuntCustomerImportHistory} from "api/headhunt";
import config from "config";
import * as Constant from "utils/Constant";
import {putToastSuccess, putToastError} from "actions/uiAction";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";

class PopupImportFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            file: null,
            result: null,
        };
        this.Ref = React.createRef();
        this.onChangeFileImport = this._onChangeFileImport.bind(this);
        this.onDownFileSample = this._onDownFileSample.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onChangeFileImport(event) {
        const file = event.target.files[0];
        this.setState({file, result: null})

        if(this.Ref.current){
            this.Ref.current.value = null;
        }

    }

    async _onSubmit(){
        const {actions} = this.props;
        const {file} = this.state;
        if(file){
            let data = new FormData();
            data.append("file", file);
            data.append("type", Constant.IMPORT_HISTORY_TYPE_CHECK_MST);
            const body = {file: data, up_file: true };
            const res = await importHeadhuntCustomerImportHistory(body);
            if (res) {
                this.setState({result: res, file: null})
            }
        }else {
            actions.putToastError("Vui lòng tải lên file!")
        }

    }

    _onDownFileSample() {
        window.open(`${config.apiHeadHuntDomain}${Constant.HEADHUNT_FILE_IMPORT_CHECK_MST_SAMPLE}`)
    }

    render() {
        const {result, file} = this.state;
        return (
            <div>
                <div className="card-body">
                    <div className="crm-section">
                        <div className="mb10">
                            <span className="mr15">Mã số thuế</span>
                            <label className="el-button el-button-small">
                                <i className="glyphicon glyphicon-upload"/>
                                <input type="file" className="hidden"
                                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                       onChange={this.onChangeFileImport} ref={this.Ref}/>
                            </label>
                            {file && (<span className="text-link">{file.name}</span>)}
                        </div>
                        <div className="mb10">
                            <button type="button" className="el-button el-button-success el-button-small"
                                    onClick={this.onSubmit}>
                                <span>Kiểm tra</span>
                            </button>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onDownFileSample}>
                                <span>Tải file import mẫu <i className="glyphicon glyphicon-download"/></span>
                            </button>
                        </div>
                        {result && (
                            <div className="table-section">
                                <div className="body-table el-table">
                                    <TableComponent allowDragScroll={false}>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            File import
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            File kết quả
                                        </TableHeader>
                                        <TableBody tableType="TableBody" >
                                            <tr className="el-table-row">
                                                <td>
                                                    <div className="cell"><a href={result.import_url}  className="text-link" target="_blank">File</a></div>
                                                </td>
                                                <td>
                                                    <div className="cell"><a href={result.import_result_url} className="text-link" target="_blank">File</a></div>
                                                </td>
                                            </tr>
                                        </TableBody>
                                    </TableComponent>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupImportFile);

