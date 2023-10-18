import React from "react";
import {connect} from "react-redux";
import MyUpload from "components/Common/Ui/Form/MyUpload";
import MyField from "components/Common/Ui/Form/MyField";
class FormComponentContractAppendix extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className={"row"}>
                        <div className="col-md-12 mb10">
                            <MyField name={"name"} label={"Tên phụ lục hợp đồng"}
                                     showLabelRequired/>
                        </div>
                        <div className="col-md-12 mb10">
                            <MyUpload name={"contract_appendix_url"} label={"File"}
                                      rows={15}
                                      showLabelRequired
                                      validateType={['pdf', 'docx']}
                                      maxSize={10}
                            />
                        </div>
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

export default connect(mapStateToProps, null)(FormComponentContractAppendix);
