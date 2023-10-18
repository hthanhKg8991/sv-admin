import React,{Component} from "react";

class PopupReason extends Component {
    render() {
        let {msg} = this.props;

        return (
           <p className="padding-top-20 padding-bottom-90 paddingLeft30 paddingRight30">{msg}</p>
        )
    }
}
export default PopupReason;
