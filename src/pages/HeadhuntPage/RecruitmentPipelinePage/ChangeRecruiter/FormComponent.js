import React from "react";
import {connect} from "react-redux";
import MySelect from "components/Common/Ui/Form/MySelect";
import {getDetailHeadhuntCampaign} from "api/headhunt";
import Filter from "components/Common/Ui/Table/Filter";
import PropTypes from "prop-types";
import {
    putToastError,
    deletePopup,
} from "actions/uiAction";
import {bindActionCreators} from 'redux';

class FormComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            recruiter_campaign_detail: [],
        }
        this.getRecruiterCampaignDetail = this._getRecruiterCampaignDetail.bind(this);
    }

    async _getRecruiterCampaignDetail(id) {
        const res = await getDetailHeadhuntCampaign({id});
        if (res) {
            const recruiter_merge = [res.campaign_group_member_recruiter_main, ...res.list_campaign_group_member_recruiter];
            const recruiter_campaign_detail = recruiter_merge.map(v => ({value: v, label: v}));
            this.setState({recruiter_campaign_detail});
        }
    }

    componentDidMount() {
        const {actions, values} = this.props;
        const {campaign_id} = values || {};
        if (campaign_id && campaign_id > 0) {
            this.getRecruiterCampaignDetail(campaign_id);
        } else {
            actions.deletePopup();
            actions.putToastError("Vui lòng chọn filter campaign!");
        }

    }

    render() {

        const {recruiter_campaign_detail} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelect name={"recruiter_staff_login_name"}
                                  label={"Chọn Recruiter"}
                                  options={recruiter_campaign_detail}
                                  showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

Filter.propTypes = {
    idKey: PropTypes.string.isRequired,
    initFilter: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
    return {
        querySearch: state.filter[ownProps.values.idKey]
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            deletePopup,
            putToastError,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);
