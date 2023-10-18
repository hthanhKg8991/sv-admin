import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import _ from 'lodash';
import * as sysAction from "actions/sysAction";
import * as authAction from "actions/authAction";
import AdminStorage from "utils/storage";
import LoadingPage from "components/Common/Ui/LoadingPage";

class Common extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            token_FE: AdminStorage.getItem('token_FE')
        };
    }

    componentDidMount() {
        let token_FE = this.state.token_FE;
        if (token_FE) {
            this.props.authAction.userInfo(token_FE);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.user) {
            if (_.isEmpty(this.props.user) && !_.isEmpty(newProps.user)) { // new user => init Data
                this.setState({loading: true}, () => {
                    this.props.sysAction.branchInit();
                });
            }

            //Tắt loading
            if (Object.keys(newProps.sys.menu).length > 0) {
                this.setState({loading: false});
            }

            // Mới vào nếu chưa có current branch hoặc đổi branch thì chạy initAll
            if (newProps.branch.currentBranch && !_.isEqual(newProps.branch.currentBranch, this.props.branch.currentBranch)) {
                this.setState({loading: true}, () => {
                    this.props.sysAction.initAll(newProps.branch.currentBranch);
                });
            }
        }
    }

    render() {
        let {loading} = this.state;

        if (loading) return (
            <LoadingPage />
        );

        const branchCode = _.get(this.props, ['branch', 'currentBranch', 'code']);
        const channelCode = _.get(this.props, ['branch', 'currentBranch', 'channel_code']);

        return (
            <React.Fragment key={channelCode + "-" + branchCode}>
                {this.props.children}
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Common);
