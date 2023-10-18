import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from 'query-string';
import EvaluateInfo from './EvaluateInfo';
import EvaluateToMark from './EvaluateToMark/index';
import EvaluateQA from './EvaluateQA';
import EvaluateComment from './EvaluateComment';
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {}
        };
        this.getInfo = this._getInfo.bind(this);
    }
    _getInfo(info){
        this.setState({info: info});
    }
    componentWillMount(){
        let params = queryString.parse(window.location.search);
        if (!params['xlite_call_id']){
            this.props.history.push(Constant.BASE_URL);
        }
    }

    render () {
        let {info} = this.state;
        return (
            <div className="row-body">
                <div className="col-result-full crm-section">
                    <div className="relative box-card box-full">
                        <div className="box-card-title">
                            <span className="title left">Đánh Giá Cuộc Gọi</span>
                        </div>
                        <div className="card-body">
                            <EvaluateInfo history={this.props.history} changeInfo={this.getInfo}/>
                            {info.staff_id && (
                                <>
                                    <EvaluateToMark history={this.props.history} info={info}/>
                                    <EvaluateQA history={this.props.history} info={info}/>
                                    <EvaluateComment />
                                </>
                            )}
                        </div>
                    </div>
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

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
