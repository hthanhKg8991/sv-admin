import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {bindActionCreators} from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {
	createGroupCampaign,
	getDetailGroupCampaign,
	updateGroupCampaign,
} from "api/saleOrder";

import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish,subscribe} from "utils/event";
import * as utils from "utils/utils";

import FormComponent from "./FormComponent";

class Edit extends React.Component {
	constructor(props) {
		super(props);
		let defaultItem = {
			name: props.detail?.name,
			division_code: props.detail?.division_code,
		};
        
		this.state = {
			id: props.id,
			item: defaultItem,
			loading: true,
			initialForm: {
				"name": "name",
				"division_code": "division_code",
			},
		};

		this.subscribers = [];
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this.asyncData();
			});
		}, props.idKey));

		this.onSubmit = this._onSubmit.bind(this);
	}

	_onSubmit(data, action) {
		const {setErrors} = action;
		const dataSubmit = _.pickBy(data, (item) => {
			return !_.isUndefined(item);
		});

		this.setState({loading: true}, () => {
			this.submitData(dataSubmit, setErrors);
		});
	}

	async submitData(data) {
		const {id} = this.state;
		const {uiAction,idKey} = this.props;
		this.setState({loading: false});
        
		let res;
		if (id > 0) {
			data.id = id;
			res = await updateGroupCampaign(data);
		} else {
			res = await createGroupCampaign(data);
		}
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công!");
			publish(".refresh", {}, idKey);
			this.setState({id: res?.id || 0});
			uiAction.deletePopup();
			this.asyncData();
		}
		this.setState({loading: false});
	}

	async asyncData() {
		const {id} = this.state;

		if (id > 0) {
			const res = await getDetailGroupCampaign({id});
			if (res) {
				this.setState({item: res, loading: false});
			}
		} else {
			this.setState({loading: false});
		}
	}

	componentDidMount() {
		const {id} = this.state;
		if (id > 0) {
			this.asyncData();
		} else {
			this.setState({loading: false});
		}
	}

	render() {
		const {initialForm, item, loading} = this.state;
		const {uiAction} = this.props
		const fieldWarnings = [];
		const shapeValidateDefault = {
			name: Yup.string().required(Constant.MSG_REQUIRED),
			// division_code: Yup.string().nullable(),
		};
		const validationSchema = Yup.object().shape({
			...shapeValidateDefault,
		});

		const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

		return (
			<React.Fragment>
				<div className="form-container">

					{loading && <LoadingSmall className="form-loading"/>}

					<FormBase 
						onSubmit={this.onSubmit}
						initialValues={dataForm}
						validationSchema={validationSchema}
						fieldWarnings={fieldWarnings}
						FormComponent={FormComponent}
					>
						<div className="row">
							<div className="col-sm-12 col-xs-12">
								<button type="submit" className="el-button el-button-success el-button-small">
									<span>Lưu</span>
								</button>
								<button type="button" className="el-button el-button-default el-button-small" onClick={() => uiAction.deletePopup()}>
									<span>Đóng</span>
								</button>
							</div>
						</div>
					</FormBase>
				</div>
			</React.Fragment>

		)
	}
}

function mapStateToProps(state) {
	return {
		branch: state.branch
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
