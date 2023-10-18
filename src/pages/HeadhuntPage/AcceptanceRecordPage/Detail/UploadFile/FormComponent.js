import React from "react";
import {connect} from "react-redux";
import MyUpload from "components/Common/Ui/Form/MyUpload";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="d-flex align-items-center">
                    <div>
                        <MyUpload name={"file_url"} label={"File"}
                                  validateType={['pdf']}
                                  maxSize={10}
                                  viewFile
                        />
                    </div>
                    <div>
                        <button type="submit" style={{background: "none", border: "none"}}
                                className="text-link font-bold ml30">Lưu
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
