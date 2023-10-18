import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {getListHeadhuntApplicantLog} from "api/headhunt";
import Detail from "pages/HeadhuntPage/RecruitmentPipelinePage/History/Detail";

const idKey = "ApplicantList";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Người cập nhật",
                    width: 100,
                    accessor: "applicant_info.created_by"
                },
                {
                    title: "Ngày cập nhật",
                    width: 100,
                    time: true,
                    accessor: "applicant_info.created_at"
                },
            ],
            loading: false,
        };
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, object} = this.props;

        return (
            <div className="padding-10">
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntApplicantLog}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, uid: object.uid}}
                      history={history}
                      isRedirectDetail={false}
                      isPushRoute={false}
                      expandRow={row => <Detail {...row} history={history}/>}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
