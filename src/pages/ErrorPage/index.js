import React, {Component} from "react";

class index extends Component {
    render () {
        return (
            <div style={{fontSize:"60px"}}>{this.props.msg ? this.props.msg : "Page not found"}</div>
        )
    }
}

export default index;
