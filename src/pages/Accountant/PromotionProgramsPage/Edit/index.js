import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {createPromotionPrograms, getDetailPromotionPrograms, updatePromotionPrograms} from "api/saleOrder";

import {putToastError, putToastSuccess} from "actions/uiAction";
import * as Constant from "utils/Constant";
import {subscribe} from "utils/event";
import * as utils from "utils/utils";

import FormComponent from "./FormComponent";

class Edit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.id,
			item: null,
			loading: true,
			initialForm: {
				"group_campaign_id": "group_campaign_id",
				"code": "code",
				"title": "title",
				"status": "status",
				"description": "description",
				"start_date": "start_date",
				"end_date": "end_date",
				"amount": "amount",
				"amount_percent": "amount_percent",
				"position_apply": "position_apply",
				"position_allocate": "position_allocate",
				"priority": "priority",
				"conditions": "conditions",
				"promotion_sub": "promotion_sub"
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
					pathname: Constant.BASE_URL_PROMOTION_PROGRAMS,
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
					pathname: Constant.BASE_URL_PROMOTION_PROGRAMS,
					search: "?" + queryString.stringify(params)
				});

				return true;
			}
		} else {
			history.push({
				pathname: Constant.BASE_URL_PROMOTION_PROGRAMS
			});
		}

		return true;
	}

	_onSubmit(data, action) {
		const {setErrors} = action;
		const dataSumbit = _.pickBy(data, (item) => {
			return !_.isUndefined(item);
		});
		this.setState({loading: true}, () => {
			this.submitData(dataSumbit, setErrors);
		});
	}

	async submitData(data, setErrors) {
		const {id} = this.state;
		const {actions, history} = this.props;
		let res;
		if (id > 0) {
			data.id = id;
			res = await updatePromotionPrograms(data);
		} else {
			res = await createPromotionPrograms(data);
		}

		if (res) {
			const {data, code, msg} = res;
			if (code === Constant.CODE_SUCCESS) {
				actions.putToastSuccess("Thao tác thành công!");
				if (data.id) {
					history.push({
						pathname: Constant.BASE_URL_PROMOTION_PROGRAMS,
						search: "?action=detail&id=" + data.id
					});
				} else {
					history.push({
						pathname: Constant.BASE_URL_PROMOTION_PROGRAMS,
					});
				}
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
			const res = await getDetailPromotionPrograms({id});
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
		const {id, initialForm, item, loading} = this.state;

		const validationSchema = Yup.object().shape({
			group_campaign_id: Yup.array(),
			code: Yup.string().required(Constant.MSG_REQUIRED),
			title: Yup.string().required(Constant.MSG_REQUIRED),
			start_date: Yup.number().required(Constant.MSG_REQUIRED),
			position_apply: Yup.number().required(Constant.MSG_REQUIRED),
			position_allocate: Yup.number().required(Constant.MSG_REQUIRED),
			priority: Yup.number().required(Constant.MSG_REQUIRED),
			conditions: Yup.array().of(
				Yup.object().shape({
					left: Yup.string().required(Constant.MSG_REQUIRED),
					operation: Yup.string().required(Constant.MSG_REQUIRED),
					right: Yup.string().required(Constant.MSG_REQUIRED),
				})
			),
			promotion_sub: Yup.array().of(
				Yup.object().shape({
					id: Yup.string(),
					from_condition: Yup.string(),
					conditions: Yup.array().of(
						Yup.object().shape({
							left: Yup.string().required(Constant.MSG_REQUIRED),
							operation: Yup.string().required(Constant.MSG_REQUIRED),
							right: Yup.string().required(Constant.MSG_REQUIRED),
						})
					),
				})
			),
		});
		const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
		dataForm.conditions = dataForm?.conditions?.length > 0 ? dataForm.conditions : [Constant.CONDITION_DEFAULT];
		dataForm.promotion_sub = dataForm?.promotion_sub?.length > 0 ? dataForm.promotion_sub : [];
		dataForm.status = dataForm?.status || Constant.PROMOTIONS_STATUS_DRAFT;

		return (
			<div className="form-container">

				{loading && <LoadingSmall className="form-loading"/>}

				<FormBase onSubmit={this.onSubmit}
					initialValues={dataForm}
					validationSchema={validationSchema}
					isEdit={id > 0}
					fieldWarnings={[]}
					FormComponent={FormComponent}>
					<div className={"row mt30"}>
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
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
	};
}

export default connect(null, mapDispatchToProps)(Edit);
