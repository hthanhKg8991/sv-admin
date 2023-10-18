import React, {Component} from "react";
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import {CanRender, Gird, SpanCommon,WrapFilter} from "components/Common/Ui";
import Default from "components/Layout/Page/Default";

import { deletePromotionPrograms, getListPromotionPrograms } from "api/saleOrder";

import { createPopup,hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox } from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";

import ComponentFilter from "pages/Accountant/PromotionProgramsPage/ComponentFilter";

import PopupSendMail from "./PopupSendMail"


const idKey = "PromotionsList";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: "ID",
					width: 100,
					accessor: "id"
				},
				{
					title: "Mã campaign",
					width: 140,
					accessor: "code"
				},
				{
					title: "Tên campaign",
					width: 300,
					accessor: "title"
				},
				{
					title: "Thời gian bắt đầu",
					width: 140,
					cell: row => moment.unix(row?.start_date).format("DD-MM-YYYY")
				},
				{
					title: "Thời gian kết thúc",
					width: 140,
					cell: row => moment.unix(row?.end_date).format("DD-MM-YYYY")
				},
				{
					title: "Trạng thái",
					width: 140,
					cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_promotion_programs_status} value={row?.status}/>
				},
				{
					title: "Hành động",
					width: 190,
					onClick: () => {
					},
					cell: row => (
						<>
							<CanRender actionCode={ROLES.accountant_promotion_programs_update}>
								<span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
								</span>
							</CanRender>
							<CanRender actionCode={ROLES.accountant_promotion_programs_delete}>
								<span className="text-link text-red font-bold ml5"
									onClick={() => this.onDelete(row?.id)}>
                                    Xóa
								</span>
							</CanRender>
							<CanRender actionCode={ROLES.accountant_promotion_programs_sendmail}>
								<span className="text-link text-green font-bold ml5" onClick={() => this.onClickSendMail(row)}>
                                    Gửi email
								</span>
							</CanRender>
						</>
					)
				},
				{
					title: "DS NTD",
					width: 80,
					cell: row => (
						<Link target="_blank" to={`${Constant.BASE_URL_EMPLOYER_WITH_PROMOTION_CODE}?${queryString.stringify({ promotion_q: row.id })}`}>
							<span className="text-link text-blue font-bold ml5">Xem</span>
						</Link>
					),
					onClick: () => {
					},
				},
			],
			loading: false,
			isImport: true,
		};

		this.onClickAdd = this._onClickAdd.bind(this);
		this.onEdit = this._onEdit.bind(this);
		this.onDelete = this._onDelete.bind(this);
		this.onClickSendMail = this._onClickSendMail.bind(this)
	}

	async _onClickSendMail(row){
		const { actions } = this.props;
		actions.createPopup(PopupSendMail, "Chọn Email Campaign", { id : row.id });

		// actions.SmartMessageBox({
		//     title: 'Bạn có muốn gửi email MKT đến danh sách NTD thuộc promotion id : ' + row.id,
		//     content: "",
		//     buttons: ['No', 'Yes']
		// }, async (ButtonPressed) => {
		//     if (ButtonPressed === "Yes") {
		//         const res = await sendMailPromotionProgramEmployer({ promotion_programs_id: row?.id });
		//         if (res) {
		//             actions.putToastSuccess('Thao tác thành công');
		//         }
		//         actions.hideSmartMessageBox();
		//     }
		// });
	}

	_onClickAdd() {
		const {history} = this.props;
		history.push({
			pathname: Constant.BASE_URL_PROMOTION_PROGRAMS,
			search: "?action=edit&id=0"
		});
	}

	_onEdit(id) {
		const {history} = this.props;
		history.push({
			pathname: Constant.BASE_URL_PROMOTION_PROGRAMS,
			search: "?action=edit&id=" + id
		});
	}

	_onDelete(id) {
		const {actions} = this.props;
		actions.SmartMessageBox({
			title: "Bạn có chắc muốn xóa ID: " + id,
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await deletePromotionPrograms({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công");
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
				title="Danh Sách Promotions Campaign"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
				buttons={(
					<div className="left btnCreateNTD">
						<CanRender actionCode={ROLES.accountant_promotion_programs_create}>
							<button type="button" className="el-button el-button-primary el-button-small"
								onClick={this.onClickAdd}>
								<span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
							</button>
						</CanRender>
					</div>
				)}>
				<Gird idKey={idKey}
					fetchApi={getListPromotionPrograms}
					query={query}
					columns={columns}
					defaultQuery={defaultQuery}
					history={history}
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
		actions: bindActionCreators({ putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox, createPopup }, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
