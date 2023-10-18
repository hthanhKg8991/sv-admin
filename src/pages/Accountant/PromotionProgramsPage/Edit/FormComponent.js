import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";

import {MyConditionField, MyDate, MyField,MySelect, MySelectFetch, MySelectSystem} from "components/Common/Ui";

import {
	getListGroupCampaign,
} from "api/saleOrder";

import {putToastError, putToastSuccess} from "actions/uiAction";
import * as Constant from "utils/Constant";

import SubPromotion from "./SubPromotion"

class FormComponent extends React.Component {
	render() {
		const {values, isEdit} = this.props;
		const common = this.props.sys.common.items;
		const position_allocate = common[Constant.COMMON_DATA_KEY_promotion_programs_position_allocate];
		const positionAllocates = position_allocate.filter(p => p.from === values?.position_apply)
			.map(p => {
				return {label: p.name, value: p.value}
			});

		return (
			<React.Fragment>
				<div className="row">
					<div className="col-sm-12 sub-title-form mb10">
						<span>Thông tin chung</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 mb10">
						<MySelectFetch 
							name={"group_campaign_id"} 
							label={"Chọn group campaign"}
							fetchApi={getListGroupCampaign}
							customDataField={"items"}
							fetchField={{value: "id", label: "name"}}
							fetchFilter={{status: Constant.STATUS_ACTIVED}}
							isMulti
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"code"} label={"Mã campagin"} showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"title"} label={"Tên campagin"} showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyDate name={"start_date"} label={"Thời gian áp dụng"} minDate={moment()} showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyDate name={"end_date"} label={"Thời gian kết thúc"} minDate={moment.unix(values.start_date)}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MySelectSystem name={"status"} label={"Trạng thái"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_promotion_programs_status}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"description"} label={"Mô tả"} multiline rows={5}/>
					</div>
				</div>

				<div className="row mt20">
					<div className="col-sm-12 sub-title-form mb10">
						<span>Giá trị campaign</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"amount"} label={"Giá trị amount"}/>
					</div>
					<div className="col-md-6 mb10">
						<MyField name={"amount_percent"} label={"Giá trị %"}/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MySelectSystem name={"position_apply"} label={"Vị trí áp dụng"}
							type={"common"}
							valueField={"value"}
							idKey={Constant.COMMON_DATA_KEY_promotion_programs_position_apply}
							showLabelRequired/>
					</div>
					<div className="col-md-6 mb10">
						<MySelect name={"position_allocate"} label={"Vị trí phân bổ"}
							options={positionAllocates}
							showLabelRequired/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb10">
						<MyField name={"priority"} label={"Độ ưu tiên"} showLabelRequired/>
					</div>
				</div>

				<div className="row mt20">
					<div className="col-sm-12 sub-title-form mb10">
						<span>Điều kiện áp dụng</span>
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-md-12">
						<MyConditionField values={values} name={"conditions"} label={"Điều kiện"} common={common}/>
					</div>
				</div>

				{isEdit && <div className="mt-5">
					<SubPromotion values={values} name={"promotion_sub"} common={common}/>
				</div>}
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		branch: state.branch,
		sys: state.sys,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);
