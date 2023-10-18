import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import * as authAction from "actions/authAction";
import * as sysAction from "actions/sysAction";
import * as Constant from "utils/Constant";

import Header from '../Common/Ui/Header';
import Popup from '../Common/Ui/Popup';
import SmartMessageBox from '../Common/Ui/SmartMessageBox';
import SmartMessageBoxVer2 from "components/Common/Ui/SmartMessageBoxVer2"
import Ribbon from '../Common/Ui/Ribbon';
import Navigation from '../Common/Ui/Navigation';
import AdminStorage from "utils/storage";
import Loading from "components/Common/Ui/Loading";


class LayoutMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token_FE: AdminStorage.getItem('token_FE')
        };
    }

    componentDidMount() {
        let token_FE = this.state.token_FE;
        if (token_FE) {
            this.props.authAction.userInfo(token_FE);
        } else {
            window.location.href = Constant.BASE_URL_SIGNIN;
        }
		  if(window){
			window.scrollTo(0, 0);
		  }
    }

	 componentDidUpdate(prevProps) {
		if (this.props.location && prevProps.location && window) {
			if(this.props.location?.pathname !== prevProps.location?.pathname || this.props.location?.search !== prevProps.location?.search){
				window.scrollTo(0, 0);
			}
		}
	 }

    componentWillReceiveProps(newProps) {
        if (!newProps.user) {
            window.location.href = Constant.BASE_URL_SIGNIN;
        }
    }

    render() {
        let {token_FE} = this.state;
        if (!token_FE) {
            return null
        }
        return (
            <div className="wrapper">
                <div ref="mainPanel" className="fixed-header">
                    <Header history={this.props.history}/>
                    <Popup history={this.props.history}/>
                    <Navigation history={this.props.history}/>
                    <div id="main" role="main" style={{minWidth: "768px"}}>
                        <Ribbon history={this.props.history}/>
                        <div className="main-content position-relative">
                            <Loading />
                            <SmartMessageBox/>
									 <SmartMessageBoxVer2/>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        sys: state.sys,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        authAction: bindActionCreators(authAction, dispatch),
        sysAction: bindActionCreators(sysAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutMain);
