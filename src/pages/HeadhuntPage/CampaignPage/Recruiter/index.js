import React from "react";
import {connect} from "react-redux";
import {putToastError, putToastSuccess, createPopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {getListHeadhuntCampaignGroupMember} from "api/headhunt";
import Gird from "components/Common/Ui/Table/Gird";
import PopupRecruiter from "pages/HeadhuntPage/CampaignPage/Popup/PopupRecruiter";

const idKey = "CampaignGroupMemberList";

class Recruiter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên",
                    width: 100,
                    accessor: "group_member_login_name"
                },
                {
                    title: "Ngày tạo",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
            ]
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    async _onClickAdd() {
        const {actions, id} = this.props;
        let members = [];
        const res = await getListHeadhuntCampaignGroupMember({campaign_id: id, per_page: 999});
        if (res) {
            members = res.items.map(item => item.group_member_login_name)
        }
        actions.createPopup(PopupRecruiter, 'Cập nhật recuiter', {
            idKey,
            object: {campaign_id: id, list_group_member_login_name: members}
        });
    }

    render() {
        const {query, defaultQuery, history, id} = this.props;
        const {columns} = this.state;

        return (
            <div className="form-container">
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin recruiter</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 mb10">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Cập nhật recruiter <i className="glyphicon glyphicon-refresh"/></span>
                        </button>
                    </div>
                    <div className="col-sm-12">
                        <Gird idKey={idKey}
                              fetchApi={getListHeadhuntCampaignGroupMember}
                              query={query}
                              columns={columns}
                              defaultQuery={{...defaultQuery, campaign_id: id}}
                              history={history}
                              isRedirectDetail={false}
                              isPushRoute={false}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Recruiter);
