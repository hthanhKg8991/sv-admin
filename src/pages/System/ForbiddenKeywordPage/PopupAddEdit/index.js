import React from "react";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { postCreateForbiddenKeyword, postUpdateForbiddenKeyword } from "api/system";
import { putToastSuccess, putToastError, deletePopup } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { publish } from "utils/event";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";

class PopupAddEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			initialForm: {
				id: "id",
				keyword: "keyword",
				description: "description",
			}
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
		const { actions, idKey, isEdit } = this.props;
		const apiSubmit = isEdit ? postUpdateForbiddenKeyword : postCreateForbiddenKeyword;
		const res = await apiSubmit(data);
		if (res) {
			const { data, code, msg } = res;
			if (code === Constant.CODE_SUCCESS) {
				publish(".refresh", {}, idKey);
				actions.putToastSuccess("Thao tác thành công!");
				actions.deletePopup();
			} else {
				setErrors(data);
				actions.putToastError(msg);
			}
		}
		this.setState({ loading: false });
	};

	render() {
		const { initialForm, loading } = this.state;
		const { detail } = this.props;
		const validationSchema = Yup.object().shape({
			keyword: Yup.string().required(Constant.MSG_REQUIRED).max(255, Constant.MSG_MAX_CHARATER_255),
			description: Yup.string().max(255, Constant.MSG_MAX_CHARATER_255),
		});

		const dataForm = detail ? utils.initFormValue(initialForm, detail) : utils.initFormKey(initialForm);

		return (
			<div className="dialog-popup-body">
				{loading && <LoadingSmall className="form-loading" />}
				<div className="popupContainer">
					<FormBase onSubmit={this.onSubmit}
						initialValues={dataForm}
						validationSchema={validationSchema}
						FormComponent={FormComponent}>
						<div className={"row mt15"}>
							<div className="col-sm-12 mb10">
								<button type="submit"
									className="el-button el-button-success el-button-small">
									<span>Lưu</span>
								</button>
								<button type="button"
									className="el-button el-button-default el-button-small"
									onClick={() => this.props.actions.deletePopup()}>
									<span>Quay lại</span>
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
