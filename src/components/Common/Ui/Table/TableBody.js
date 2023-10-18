import React, {Component} from "react";

class TableBody  extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(newProps) {

    }
    render() {
        return(
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}
export default TableBody;