import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {createBundle, getDetailBundle, updateBundle} from "api/saleOrder";

import {putToastError, putToastSuccess} from "actions/uiAction";
import * as Constant from "utils/Constant";
import {subscribe} from "utils/event";
import * as utils from "utils/utils";

import FormComponent from "./FormComponent";

class Edit extends React.Component {
	constructor(props) {
		super(props);
		let defaultItem = {status: Constant.STATUS_ACTIVED, available_from_date : moment().unix()};
		this.state = {
			id: props.id,
			item: defaultItem,
			loading: true,
			initialForm: {
				"name": "name",
				"discount_rate": "discount_rate",
				"available_from_date": "available_from_date",
				"available_to_date": "available_to_date",
				"status": "status",
				"code": "code",
				"description": "description",
				"price": "price",
				"origin_price": "origin_price",
				"branch_code": "branch_code",
				"ordering": "ordering",
				"is_display": "is_display",
				"type": "type",
				"is_new": "is_new",
			},
		};

		this.subscribers = [];
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this.asyncData();
			});
		}, props.idKey));

		this.onSubmit = this._onSubmit.bind(this);
		this.goBack = this._goBack.bind(this);
	}

	_goBack(id) {
		const {history} = this.props;

		if (id > 0) {
			if (_.get(history, "action") === "POP") {
				history.push({
					pathname: Constant.BASE_URL_BUNDLES_PACKAGE_PAGE,
					search: "?action=list"
				});

				return true;
			}

			if (_.get(history, "action") === "PUSH") {
				const search = queryString.parse(_.get(history, ["location", "search"]));
				const params = {
					...search,
					action: "list"
				};

				history.push({
					pathname: Constant.BASE_URL_BUNDLES_PACKAGE_PAGE,
					search: "?" + queryString.stringify(params)
				});

				return true;
			}
		} else {
			history.push({
				pathname: Constant.BASE_URL_BUNDLES_PACKAGE_PAGE
			});
		}

		return true;
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

	async submitData(data, setErrors) {
		const {id} = this.state;
		const {actions, history} = this.props;
		let res;
		if (id > 0) {
			data.id = id;
			res = await updateBundle(data);
		} else {
			res = await createBundle(data);
		}
		if (res) {
			this.setState({loading: false});
			const {data, code, msg} = res;
			if (code === Constant.CODE_SUCCESS) {
				actions.putToastSuccess("Thao tác thành công!");
				history.push({
					pathname: Constant.BASE_URL_BUNDLES_PACKAGE_PAGE,
					search: `?action=edit&id=${data?.id || 0}`
				});
				this.setState({id: data?.id || 0});
				this.asyncData();
			} else {
				setErrors(data);
				actions.putToastError(msg);
			}
		}
		this.setState({loading: false});
	}

	async asyncData() {
		const {id} = this.state;

		if (id > 0) {
			const res = await getDetailBundle({id});
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
		const {branch} = this.props;
		const {id, initialForm, item, loading} = this.state;
		const fieldWarnings = [];
		const shapeValidateDefault = {
			name: Yup.string().required(Constant.MSG_REQUIRED),
			code: Yup.string().required(Constant.MSG_REQUIRED),
			available_from_date: Yup.string().required(Constant.MSG_REQUIRED),
			available_to_date: Yup.string().required(Constant.MSG_REQUIRED),
			status: Yup.string().required(Constant.MSG_REQUIRED),
			price: Yup.string().required(Constant.MSG_REQUIRED),
			origin_price: Yup.string().required(Constant.MSG_REQUIRED),
			ordering: Yup.string().required(Constant.MSG_REQUIRED),
			is_display: Yup.string().required(Constant.MSG_REQUIRED),
			type: Yup.string().required(Constant.MSG_REQUIRED),
			is_new: Yup.string().required(Constant.MSG_REQUIRED),
		};
		const {channel_code} = branch.currentBranch;
		const isMW = channel_code === Constant.CHANNEL_CODE_MW;
		const shapeValidateOptional = !isMW ? {
			branch_code: Yup.string().required(Constant.MSG_REQUIRED),
			description: Yup.string().required(Constant.MSG_REQUIRED)
		} : {};
		const validationSchema = Yup.object().shape({
			...shapeValidateDefault,
			...shapeValidateOptional
		});

		const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

		return (
			<React.Fragment>
				<div className="form-container">

					{loading && <LoadingSmall className="form-loading"/>}

					<FormBase onSubmit={this.onSubmit}
						initialValues={dataForm}
						validationSchema={validationSchema}
						fieldWarnings={fieldWarnings}
						FormComponent={FormComponent}>
						<div className={"row mt15"}>
							<div className="col-sm-12">
								<button type="submit" className="el-button el-button-success el-button-small">
									<span>Lưu</span>
								</button>
								<button type="button" className="el-button el-button-default el-button-small"
									onClick={() => this.goBack(id)}>
									<span>Quay lại</span>
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
		actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
