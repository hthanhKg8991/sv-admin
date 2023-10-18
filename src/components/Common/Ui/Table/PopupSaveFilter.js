import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";

class PopupSaveFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div id="formCreatContainer" style={{minHeight:"250px", height:"40vh"}}>
                <div className="col-sm-12 col-xs-12 mb15">
                    <MyField name={"name"} label="Tên bộ lọc" showLabelRequired/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language
    };
}

export default connect(mapStateToProps, null)(PopupSaveFilter);
