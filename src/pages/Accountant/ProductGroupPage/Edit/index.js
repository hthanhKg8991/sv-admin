import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {createItemsGroup, getDetailItemsGroup, updateItemsGroup} from "api/saleOrder";

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
				"name": "name",
				"discount_rate": "discount_rate",
				"promotion_rate": "promotion_rate",
				"available_from_date": "available_from_date",
				"available_to_date": "available_to_date",
				"status": "status",
				"package": "package",
				"expired_at":"expired_at"
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
					pathname: Constant.BASE_URL_ACCOUNTANT_PRODUCT_GROUP,
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
					pathname: Constant.BASE_URL_ACCOUNTANT_PRODUCT_GROUP,
					search: "?" + queryString.stringify(params)
				});

				return true;
			}
		} else {
			history.push({
				pathname: Constant.BASE_URL_ACCOUNTANT_PRODUCT_GROUP
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
			res = await updateItemsGroup(data);
		} else {
			res = await createItemsGroup(data);
		}
		if (res) {
			this.setState({loading: false});
			const {data, code, msg} = res;
			if (code === Constant.CODE_SUCCESS) {
				actions.putToastSuccess("Thao tác thành công!");
				history.push({
					pathname: Constant.BASE_URL_ACCOUNTANT_PRODUCT_GROUP,
				});
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
			const res = await getDetailItemsGroup({id});
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
		const fieldWarnings = [];

		const validationSchema = Yup.object().shape({
			name: Yup.string().required(Constant.MSG_REQUIRED),
			available_from_date: Yup.string().required(Constant.MSG_REQUIRED),
			available_to_date: Yup.string().required(Constant.MSG_REQUIRED),
			status: Yup.string().required(Constant.MSG_REQUIRED),
			package: Yup.string().required(Constant.MSG_REQUIRED),
		});

		const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
		if (!item){
			dataForm.status =  Constant.STATUS_ACTIVED;
		}

		return (
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
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
	};
}

export default connect(null, mapDispatchToProps)(Edit);
