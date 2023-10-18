import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Detail from "pages/CustomerCare/EmployerFreemiumPage/DetailPro/Detail";

class PopupDetailHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
                {
                    title: "Người cập nhật",
                    width: 200,
                    accessor: "assigned_staff_username"
                },
                {
                    title: "Thời gian cập nhật",
                    width: 150,
                    accessor: "updated_at"
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                      <SpanCommon idKey={Constant.COMMON_DATA_KEY_freemium_pro_status}
                        value={row?.status} />
                    )
                },
            ]
    };

    this.expandRow = this._expandRow.bind(this);
  }

  _expandRow(row) {
    const {history} = this.props;
    const {id} = this.state;

    return (<Detail detailId={row.id} employerId={id} data={row} history={history}/>);
}

  render() {
    const { items, history } = this.props;
    const {columns} = this.state;
    return (
      <React.Fragment>
        <div className={"row padding10"}>
          <div className={"col-md-12"}>
            <Gird idKey={"PopupDetailPro"}
                data={[items]}
                defaultQuery={{employer_id: items?.id}}
                columns={columns}
                history={history}
                isPushRoute={false}
                isRedirectDetail={false}
                expandRow={row => this.expandRow(row)}
                indexExpandRow={0}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(PopupDetailHistory);

