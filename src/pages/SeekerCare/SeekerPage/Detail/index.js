import React,{Component} from "react";
import classnames from 'classnames';
import {connect} from "react-redux";
import GeneralInf from './GeneralInf';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navActive: 1
        };
    }
    changeNav(navItem){
        this.setState({navActive: navItem});
    }
    render () {
        return (
            <div className="box-inf paddingTop5">
                <div className="nav-box">
                    <div className="nav-group">
                        <div className={classnames("nav-item pointer",this.state.navActive === 1 ? "active" : "")} onClick={this.changeNav.bind(this,1)}>Thông tin chung</div>
                        <div className={classnames("nav-item pointer",this.state.navActive === 2 ? "active" : "")} onClick={this.changeNav.bind(this,2)}>Lịch sử báo xấu</div>
                    </div>
                </div>
                <div className="relative content-box">
                    {this.state.navActive === 1 &&
                        (<GeneralInf {...this.props}/>)
                    }
                    {this.state.navActive === 2 &&
                        (<div/>)
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
