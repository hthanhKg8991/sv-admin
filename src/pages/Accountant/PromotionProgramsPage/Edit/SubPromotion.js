import React, {Component} from "react";
import {connect} from "react-redux";
import {FieldArray} from "formik";
import {bindActionCreators} from "redux";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";

import MyConditionField from "./CustomConditionField";

// const idKey = Constant.IDKEY_COMBO_PACKAGE;

class SubPromotion extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			data_list: [],
			show_detail: true,
			arrayValue: Array.from(Array(1).keys()),
		};
        
		this.showHide = this._showHide.bind(this);
	}

	_showHide() {
		this.setState({show_detail: !this.state.show_detail});
	}

	render() {
		const {values, name} = this.props;
		const common = this.props.sys.common.items;
		const arrayValue = values[name];
        
		return (
			<>
				<FieldArray name={name}>
					{({remove, push}) => (
						<div className="margin-top-10">
							{arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => (
                            	<div className="col-result-full crm-section" key={index}>
                            		<div className="box-card box-card-group box-full">
                            			<div className="box-card-title pointer box-package-combo" onClick={this.showHide}>
                            				<span className="title left">Điều kiện áp dụng</span>
                            				{/* <div className={classnames("right", show_detail ? "active" : "")}>
                                             <button type="button" className="bt-refresh el-button">
                                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                                             </button>
                                       </div> */}
                            			</div>
                            			<div className="paddingLeft10 paddingRight10">
                            				<div className="margin-top-10">
                            					<MyConditionField values={item} name={`${name}[${index}].conditions`} getValueName={"conditions"} label={"Điều kiện"} common={common}/>
                            				</div>
                            				<div className="margin-top-10 margin-bottom-10">
                            					<div>
                            						<button
                            							type="button"
                            							className="btn btn-danger"
                            							onClick={() => remove(index)}
                            						>
                                                Xoá
                            						</button>
                            					</div>
                            				</div>
                            			</div>
                            		</div>
                            	</div>
                            )
                            )}
							<div className="row paddingLeft0 margin-top-10">
								<div className="col-md-12">
									<button
										type="button"
										className="btn btn-warning"
										onClick={() => push(Constant.CONDITION_SUB_DEFAULT)}
									>
                                        Thêm Điều Kiện
									</button>
								</div>
							</div>
						</div>
					)}
				</FieldArray>
			</>
		)
	}
}

function mapStateToProps(state) {
	return {
		api: state.api,
		sys: state.sys,
		refresh: state.refresh,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SubPromotion);
