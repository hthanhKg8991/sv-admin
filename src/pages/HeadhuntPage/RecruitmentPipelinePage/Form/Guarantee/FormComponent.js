import React from "react";
import {getListHeadhuntApplicant} from "api/headhunt";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applicant: [],
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectSearch
                            name={"guarantee_applicant_id"}
                            label={"Bảo hành cho ứng viên"}
                            defaultQuery={{campaign_id:this.props.values.campaign_id}}
                            searchApi={getListHeadhuntApplicant}
                            valueField={"id"}
                            labelField={"seeker_name"}
                            showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default FormComponent;


