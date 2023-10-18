import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import * as uiAction from 'actions/uiAction'

class SmartMessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smart_message: props.ui.smart_message ? props.ui.smart_message : {},
            action_type: "",
            isShowPopup: 2
        };
        this.btnOnclick = this._btnOnclick.bind(this);
        this.hideBox = this._hideBox.bind(this);
    }
    _hideBox(){
        this.setState({isShowPopup: 3});
        setTimeout(() => {
            this.props.uiAction.hideSmartMessageBox();
        },300);
    }

    _btnOnclick(action_type){
        if (this.state.smart_message.ButtonPressed && action_type !== this.state.action_type){
            if (action_type === "No"){
                this.hideBox();
            }else{
                this.setState({action_type: action_type});
                this.state.smart_message.ButtonPressed(action_type,(smart_message = null) => {
                    if (smart_message){
                        //init lại messageBox
                        this.setState({smart_message: smart_message});
                        this.setState({action_type: ""});
                    }else{
                        this.hideBox();
                    }
                });
            }
        }
    }

    componentWillMount(){

    }

    componentWillReceiveProps(newProps) {
        if (newProps.ui.smart_message){
            this.setState({isShowPopup: 1});
            this.setState({action_type: ""});
            this.setState({smart_message: newProps.ui.smart_message});
        }else{
            this.setState({isShowPopup: 2});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render () {
        let fade = "fadeIn";
        if (this.state.isShowPopup === 3){
            fade = "fadeOut"
        }
        return (
            <React.Fragment>
                {[1,3].includes(this.state.isShowPopup) && (
                    <div className={classnames("divMessageBox animated fast",fade)}>
                        <div className={classnames("MessageBoxContainer animated fast",fade)}>
                            <div className="MessageBoxMiddle">
                                <span className="MsgTitle">{this.state.smart_message.title}</span>
                                <div className="pText">{this.state.smart_message.content}</div>
                                <div className="MessageBoxButtonSection">
                                    {this.state.smart_message.buttons && this.state.smart_message.buttons.length > 0 && this.state.smart_message.buttons.map((item,key) => {
                                        return(
                                            <button key={key} className="btn btn-default btn-sm botTempo" onClick={this.btnOnclick.bind(this,item)}> {item}</button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        )
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(SmartMessageBox);
