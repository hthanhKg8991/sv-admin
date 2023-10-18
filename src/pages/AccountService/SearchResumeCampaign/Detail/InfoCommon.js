import React, { Component } from "react";
import { getDetailAccountServiceSearchResumeCampaign, changeStatusAccountServiceSearchResumeCampaign } from "api/mix";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from 'query-string';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup } from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { Link } from 'react-router-dom';
import * as utils from "utils/utils";
import moment from "moment";
class InfoCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      detail: {},
    }
    this.goBack = this._goBack.bind(this);
    this.getDetail = this._getDetail.bind(this);
    this.changeStatus = this._changeStatus.bind(this);
  }

  _goBack() {
    const { history } = this.props;
    history.goBack();
  }

  async _getDetail() {
    const { id } = this.props;
    const res = await getDetailAccountServiceSearchResumeCampaign({ id })
    if (res) {
      this.setState({
        loading: false,
        detail: { ...res }
      })
    }

  }
  _changeStatus() {
    const { actions, id } = this.props;

    actions.SmartMessageBox({
      title: `Không thể tiếp tục gửi CVs đến campaign hoàn thành. Xác nhận hoàn thành campaign?`,
      content: "",
      buttons: ['No', 'Yes']
    }, async (ButtonPressed) => {
      if (ButtonPressed === "Yes") {
        const res = await changeStatusAccountServiceSearchResumeCampaign({ id, status: Constant.AS_FILTER_RESUME_CAMPAIGN_COMPLETE });
        if (res) {
          actions.putToastSuccess('Thao tác thành công');
          this.getDetail()
        }
        actions.hideSmartMessageBox();
      }
    });
  }
  componentDidMount() {
    this.getDetail();
  }

  render() {
    const { loading, detail } = this.state;
    if (loading) {
      return <LoadingSmall style={{ textAlign: "center" }} />
    }
    return <div className="content-box">
      <div className="row mt10">
        <div className="col-sm-12 col-lg-5">
          <div className="col-sm-12 col-xs-12 row-content row-title padding0">
            <span>Thông tin chung</span>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Tên campaign</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              {detail?.name}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Id Nhà tuyển dụng</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              {detail?.employer_id}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Tên nhà tuyển dụng</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              {detail?.employer_name}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Số Cvs yêu cầu</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              {
                utils.formatNumber(detail?.quantity_cv, 0, ",", "")
              }
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Trạng thái campaign</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              <SpanCommon idKey={Constant.COMMON_DATA_KEY_status_campaign_search_resume} value={detail?.status} />
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Ngày tạo campaign</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              {detail?.created_at && moment.unix(detail?.created_at).format("DD-MM-YYYY hh:mm:ss")}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Hạn hỗ trợ</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              {detail?.expired_at && moment.unix(detail?.expired_at).format("DD-MM-YYYY hh:mm:ss")}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">Thông tin yêu cầu</div>
            <div className="col-sm-8 col-xs-8 text-bold">
              {
                detail?.job_title && <div>
                  Theo tin <Link to={`${Constant.BASE_URL_JOB}?${queryString.stringify({ action: 'detail', id: detail?.job_id })}`}>
                    <span>{detail?.job_title}</span>
                  </Link>
                </div>
              }
              {
                detail?.content && <div className="mt10">Yêu cầu khác <span>({detail?.content})</span></div>
              }
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 row-content padding0">
            <div className="col-sm-4 col-xs-4 padding0">File đính kèm
                <span><i className="glyphicon glyphicon-upload ml10" /></span>
            </div>
            <div className="col-sm-8 col-xs-8 text-bold" >
              <a href={detail?.file} download rel="noopener noreferrer" target="_blank"> {detail?.file}</a>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-12 row-content">
          <div className="row-title padding0 mb20 mt30">
            <span >Kết quả gửi CVs</span>
          </div>
          <div className="box-list-statistic-cv">
            <div className="box-statistic-cv cv-send">
              <span>Số CVs đã gửi</span>
              <span>{detail?.total_sent || 0}</span>
            </div>
            <div className="box-statistic-cv cv-waiting">
              <span>Số CVs đang chờ duyệt</span>
              <span>{detail?.total_inactive || 0}</span>
            </div>
            <div className="box-statistic-cv cv-waiting">
              <span>Số CVs được chấp nhận</span>
              <span>{detail?.total_active || 0}</span>
            </div>
            <div className="box-statistic-cv cv-reject">
              <span>Số CVs không phù hợp</span>
              <span>{detail?.total_unsuitable || 0}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-12 mt30">
          {
            detail?.status == Constant.AS_FILTER_RESUME_CAMPAIGN_ACTIVE &&
            <button className="el-button el-button-success el-button-small" onClick={() => this.changeStatus()}>
              <span>Hoàn thành</span>
            </button>
          }

          <button type="button" className="el-button el-button-default el-button-small"
            onClick={() => this.goBack()}>
            <span>Quay lại</span>
          </button>
        </div>
      </div>
    </div>
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(InfoCommon);
