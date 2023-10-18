import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classnames from "classnames";
import * as uiAction from "actions/uiAction";
import moment from "moment";

class SmartMessageBoxVer2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			smart_message: props.ui.smart_message_v2 ? props.ui.smart_message_v2 : {},
			action_type: "",
			isShowPopup: 2,
			isSpamPrevent: false
		};
		this.btnOnClickHandle = this._btnOnClickHandle.bind(this);
		this.hideBox = this._hideBox.bind(this);
	}

	_hideBox() {
		this.setState({ isShowPopup: 3 });
		setTimeout(() => {
			this.props.uiAction.hideSmartMessageBoxV2();
		}, 300);
	}

	async _btnOnClickHandle(callbackFunc = null) {
		// check callBackFunc nếu không có sẽ tự gán action đóng popup
		if (callbackFunc) {
			const { smart_message } = this.state;

			if (smart_message?.uniqueKey) {
				const reversedString = smart_message?.uniqueKey?.split("").reverse().join("");

				const timePrev = localStorage.getItem(reversedString);
				if (timePrev) {
					const secondsDif = moment(timePrev).diff(moment());
					if (!isNaN(secondsDif) && Math.round(Math.abs(secondsDif) / 1000) < 10) {
						alert("Thao tác của bạn đã được thực hiện vui lòng đợi 10s để thực hiện lần nữa!");
						return;
					}

					localStorage.removeItem(reversedString);
				}
				localStorage.setItem(reversedString, moment());
			}
			this.props.uiAction.showLoading();
			await callbackFunc();
			this.props.uiAction.hideLoading();
		} else {
			this.hideBox();
		}
	}

	componentWillReceiveProps(newProps) {
		for (var i in localStorage) {
			if (localStorage.hasOwnProperty(i)) {
				const momentLST = moment(localStorage[i]);
				if (momentLST.isValid()) {
					const secondsDif = momentLST.diff(moment());
					if (!isNaN(secondsDif) && Math.round(Math.abs(secondsDif) / 1000) > 12) {
						localStorage.removeItem(i);
					}
				}
			}
		}

		if (newProps.ui.smart_message_v2) {
			this.setState({ isShowPopup: 1 });
			this.setState({ action_type: "" });
			this.setState({
				smart_message: {
					...newProps.ui.smart_message_v2,
					optional: {
						isPreventAutoClose: !!newProps.ui.smart_message_v2
					}
				}
			});
		} else {
			this.setState({ isShowPopup: 2 });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(JSON.stringify(nextState) === JSON.stringify(this.state));
	}

	render() {
		let fade = "fadeIn";
		if (this.state.isShowPopup === 3) {
			fade = "fadeOut";
		}
		return (
			<React.Fragment>
				{[1, 3].includes(this.state.isShowPopup) && (
					<div style={{zIndex: 999}} className={classnames("divMessageBox animated fast", fade)}>
						<div className={classnames("MessageBoxContainer animated fast", fade)}>
							<div className="MessageBoxMiddle">
								<span className="MsgTitle">{this.state.smart_message.title}</span>
								<div className="pText">{this.state.smart_message.content}</div>
								<div className="MessageBoxButtonSection" style={{display: "flex", justifyContent:"flex-end"}}>
									{this.state.smart_message.buttons &&
										this.state.smart_message.buttons.length > 0 &&
										this.state.smart_message.buttons.map((item, key) => {
											return (
												<button
													key={key}
													className="btn btn-default btn-sm botTempo"
													style={{
														...item?.style,
														marginLeft: "8px"
													}}
													onClick={() => this.btnOnClickHandle(item?.callback)}
												>
													{item?.text}
												</button>
											);
										})}
								</div>
							</div>
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		lang: state.lang,
		ui: state.ui
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SmartMessageBoxVer2);
