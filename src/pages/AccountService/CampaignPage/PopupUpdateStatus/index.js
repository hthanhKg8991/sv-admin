import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import { changeStatusAccountServiceCampaign, getAccountServiceCampaignList } from "api/mix";

import { deletePopup,putToastError, putToastSuccess } from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import { publish } from "utils/event";

import FormComponent from "./FormComponent";

class PopupAddEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			initialForm: {
				"id": "id",
				"status": "status",
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
		const { actions, idKey } = this.props;
		const res = await changeStatusAccountServiceCampaign({ id: data.id, status: data.status });
		if (res) {
			actions.putToastSuccess("Thao tác thành công");
			actions.deletePopup();
			publish(".refresh", {}, idKey)
		} else {
			setErrors(data);
			actions.putToastError(res.msg);
		}
		this.setState({ loading: false });
	}

	render() {
		const { loading, initialForm } = this.state;
		const validationSchema = Yup.object().shape({
			id: Yup.string().required(Constant.MSG_REQUIRED),
			status: Yup.string().required(Constant.MSG_REQUIRED),
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
