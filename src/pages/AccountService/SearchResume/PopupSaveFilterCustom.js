import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";

class PopupSaveFilterCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{height:"100%",}}>
                <div className="col-sm-12 col-xs-12 mb15">
                    <MyField name={"name"} label="Tên bộ lọc" showLabelRequired/>
                </div>
                <div className="col-sm-12 col-xs-12 mt5 mb5">
                    {this.props?.values?.title && <span>Bộ lọc sẽ được lưu vào campaign {this.props?.values?.title}</span>}
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

export default connect(mapStateToProps, null)(PopupSaveFilterCustom);
