import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import { sendMailPromotionProgramEmployer } from "api/saleOrder";

import { deletePopup,putToastError, putToastSuccess } from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

import FormComponent from "./FormComponent";

class PopupAddEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			initialForm: {
				"email_marketing_campaign_id": "email_marketing_campaign_id",
			},
		};
		this.onSubmit = this._onSubmit.bind(this);
	}

	_onSubmit(data, action) {
		const { setErrors } = action;

		this.setState({ loading: true }, () => {
			this.submitData(data, setErrors);
		});
	}

	async submitData(data, setErrors) {
		const { actions, id } = this.props;
		const res = await sendMailPromotionProgramEmployer({ promotion_programs_id: id, email_marketing_campaign_id: data.email_marketing_campaign_id });
		if (res) {
			actions.putToastSuccess("Thao tác thành công");
			actions.deletePopup();

		} else {
			setErrors(data);
			actions.putToastError(res.msg);
		}
		this.setState({ loading: false });
	}

	render() {
		const { loading, initialForm } = this.state;
		const validationSchema = Yup.object().shape({
			email_marketing_campaign_id: Yup.string().required(Constant.MSG_REQUIRED),
		});
		const dataForm = utils.initFormKey(initialForm);
		return (
			<div className="dialog-popup-body">
				{loading && <LoadingSmall className="form-loading" />}
				<div className="popupContainer">
					<FormBase
						onSubmit={this.onSubmit}
						initialValues={dataForm}
						validationSchema={validationSchema}
						fieldWarnings={[]}
						FormComponent={FormComponent}>
						<div className={"row mt15"}>
							<div className="col-sm-12 mb10">
								<button type="submit"
									className="el-button el-button-success el-button-small">
									<span>Xác nhận</span>
								</button>
								<button type="button"
									className="el-button el-button-default el-button-small"
									onClick={() => this.props.actions.deletePopup()}>
									<span>Đóng</span>
								</button>
							</div>
						</div>
					</FormBase>
				</div>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ putToastSuccess, putToastError, deletePopup }, dispatch)
	};
}

export default connect(null, mapDispatchToProps)(PopupAddEdit);
