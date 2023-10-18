import React, {Component} from "react";
import {connect} from "react-redux";
import config from "config";
import _ from "lodash";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import {Gird,SpanCommon} from "components/Common/Ui";
import CanRender from "components/Common/Ui/CanRender";
import Default from "components/Layout/Page/Default";

import {getListLogPromotionProgram, importPromotionProgram} from "api/saleOrder";

import {hideLoading,putToastError, putToastSuccess, showLoading} from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";

import Detail from "pages/Accountant/PromotionProgramsPage/Detail";

const idKey = "JobDetail";
const idKeyGrid = "CustomerListJobDetail"

class DetailContainer extends Component {
	constructor(props) {
		super(props);

		const searchParam = _.get(props, ["location", "search"]);
		const queryParsed = queryString.parse(searchParam);

		this.state = {
			id: _.get(queryParsed, "id"),
			columns: [
				{
					title: "ID",
					width: 80,
					accessor: "id",
                    
				},
				{
					title: "Ngày Import",
					width: 100,
					cell: row => <span>{moment.unix(row?.created_at).format("DD/MM/YYYY")}</span>
                    
				},
				{
					title: "Người Import",
					width: 160,
					accessor: "created_by",
                    
				},
				{
					title: "Kết Quả Import",
					width: 120,
					cell: row => <span>{row?.total_success}/{row?.total_import}</span>,
                    
				},
				{
					title: "File Kết Quả Import",
					width: 120,
					cell: row => !!row?.success_link && <a className="pointer" target="_blank" download rel="noreferrer" href={row?.success_link}>File</a>,
                    
				},
				{
					title: "Trạng Thái",
					width: 100,
					cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_list_log_promotion_program_status} value={row?.status}/>,
				},
			]
		};

		this.textInput = React.createRef();
		this.onImportFile = this._onImportFile.bind(this);
		this.onChangeFileImport = this._onChangeFileImport.bind(this);
		this.onDownloadTemplate = this._onDownloadTemplate.bind(this);
	}

	async _onChangeFileImport(event) {
		const {actions} = this.props;
		const {id} = this.state;
		const file = event.target.files[0];

		if(!file){
			return;
		}
		this.setState({isImport: false});
		const {name} = file;
		const ext = name?.split(".").pop();
		if(file?.size > Constant.EXTENSION_FILE_SIZE_LIMIT){
			actions.putToastError("File import quá lớn! \n Dung lượng tối đa là 10MB!");
			event.target.value = ""
		}else if(Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
			const dataFile = new FormData();
			dataFile.append("file", file);
			dataFile.append("promotion_programs_id", id);
            
			const body = {file: dataFile, up_file: true};

			actions.showLoading();
			const resImport = await importPromotionProgram(body);
			actions.hideLoading();

			if(resImport) {
				this.setState({loading: false});
				actions.putToastSuccess("Import thành công!");
				publish(".refresh", {}, idKeyGrid);
				// window.open(resImport?.data?.url);
			}else if(resImport?.code === Constant.CODE_FILE_TOO_BIG){
				actions.putToastError("File import quá lớn!")
			}else {
				actions.putToastError(resImport?.msg)
			}
		} else {
			actions.putToastError("Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx");
		}
		event.target.value = ""
		this.setState({isImport: true});
	}

	async _onImportFile() {
		this.textInput.current.click();
	}

	_onDownloadTemplate() {
		window.open(`${config.apiSalesOrderDomain}/template/Template_import_data.xlsx`)
	}

	render() {
		const {query, defaultQuery, history} = this.props;
		const {id, columns, isImport} = this.state;

		return (
			<React.Fragment>
				<Default
					title={"Chi Tiết Promotions Campaign"}
					titleActions={(
						<button type="button" className="bt-refresh el-button" onClick={() => {
							publish(".refresh", {}, idKey)
						}}>
							<i className="fa fa-refresh"/>
						</button>
					)}>
					<Detail idKey={idKey} id={id} history={history}/>
				</Default>
				<Default
					title={"Danh Sách Khách Hàng"}
					titleActions={(
						<button type="button" className="bt-refresh el-button" onClick={() => {
							publish(".refresh", {}, idKeyGrid)
						}}>
							<i className="fa fa-refresh"/>
						</button>
					)}
					buttons={(
						<CanRender actionCode={ROLES.accountant_promotion_programs_import}>
							<div style={{display:"flex", flexFlow:"row wrap", alignItems:"center"}}>
								<button type="button" className="el-button el-button-primary el-button-small"
									onClick={this.onDownloadTemplate}
								>
									<span>Download Template <i className="glyphicon glyphicon-save"/></span>
								</button>
								{!isImport && <input type="file" ref={this.textInput} className="form-control mb10 hidden"
									onChange={this.onChangeFileImport}
									accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv"
								/>}
								<button type="button" className="el-button el-button-warning el-button-small"
									onClick={this.onImportFile}>
									<span>Import file <i className="glyphicon glyphicon-upload"/></span>
								</button>
								<ul className="pl20 mb0">
									<li>File import phải có định dạng: .xlx hoặc .xlsx</li>
									<li>Cột đầu tiên (Cột A) phải là ID NTD</li>
								</ul>
							</div>
						</CanRender>
					)}
				>
					<Gird 
						idKey={idKeyGrid}
						fetchApi={getListLogPromotionProgram}
						query={{
							...query,
							promotion_programs_id: id
						}}
						columns={columns}
						defaultQuery={{
							...defaultQuery,
							promotion_programs_id: id
						}}
						history={history}
						isPushRoute={false}
						isRedirectDetail={false}
					/>
				</Default>
			</React.Fragment>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			putToastSuccess,
			putToastError,
			showLoading,
			hideLoading,
		}, dispatch)
	};
}

export default connect(null, mapDispatchToProps)(DetailContainer);
