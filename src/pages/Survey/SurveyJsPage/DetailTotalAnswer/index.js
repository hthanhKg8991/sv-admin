import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import { getListSurveyJsAnswer } from "api/survey";
class PopupDetailTotalAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "ID",
          width: 150,
          accessor: "id"
        },
        {
          title: "Ngày thực hiện survey",
          width: 200,
          accessor: "created_at",
          time: true,
        },
        {
          title: "ID user thực hiện survey",
          width: 200,
          accessor: "uid"
        },
      ]
    };
  }
  render() {
    const { surveyjs_question_id } = this.props;
    const { columns } = this.state;

    return (
      <div className="dialog-popup-body">
        <div className="mt10 p10">
          <Gird idKey={"PopupDetailPro"}
            defaultQuery={{ surveyjs_question_id }}
            fetchApi={getListSurveyJsAnswer}
            columns={columns}
            isRedirectDetail={false}
            isPushRoute={false}
          />
        </div>
        <hr className="v-divider mb10" />
        <div className="v-card-action ">
          <button type="button" className="el-button el-button-primary el-button-small" onClick={() => this.props.uiAction.deletePopup()}>
            <span>Đóng</span>
          </button>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(PopupDetailTotalAnswer);

