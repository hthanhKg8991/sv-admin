import { Component } from "react";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import { connect } from "react-redux";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import moment from "moment";
class TableDetailFilter extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { detail, sys } = this.props;
    detail = JSON.parse(detail || "") || {};

    const language_list = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_language_resume);
    const language = language_list.find(item => item.value == detail?.language)
    const experiment_list = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_job_experience_range);
    const experience = experiment_list.find(item => item.value == detail?.experience)
    const seeker_level = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_seeker_level);
    const level = seeker_level.find(item => item.value = detail?.level)
    const gender_list = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_job_gender);
    const seeker_gender = gender_list.find(item => item.value == detail?.seeker_gender);
    const work_time_list = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_resume_working_method);
    const work_time = work_time_list.find(item => item.value == detail?.work_time);
    const is_seen_list = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_is_seen_resume_account_service);
    const is_seen = is_seen_list.find(item => item.value == detail?.is_seen)
    const is_sent_list = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_account_service_resume_is_sent);
    const is_sent = is_sent_list.find(item => item.value == detail?.is_sent)
    const provinces = sys.province.items;
    const province = provinces.find(item => detail["province_ids[]"] == item?.id);
    const job_list = sys.jobField.items;
    const field_job = job_list.find(item => detail["field_ids[]"] == item?.id)
    const created_at = Constant.ORDER_BY_CONFIG.find(item => item.value == detail["order_by[created_at]"]);
    const updated_at = Constant.ORDER_BY_CONFIG.find(item => item.value == detail["order_by[updated_at]"]);

    return (
      <div className="body-table el-table">
        <TableComponent allowDragScroll={false}>
          <TableHeader tableType="TableHeader" width={200}>
            Điều kiện lọc
          </TableHeader>
          <TableHeader tableType="TableHeader" width={100}>
            Giá trị
          </TableHeader>

          <TableBody tableType="TableBody">
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Tên vị trí hoặc chức danh</div>
              </td>
              <td>
                <div className="cell-custom">{detail?.q}</div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom">Kênh</div>
              </td>
              <td>
                <div className="cell-custom">{Constant.CHANNEL_LIST[detail?.channel_code || ""]}</div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Địa điểm</div>
              </td>
              <td>
                <div className="cell-custom">{province?.name || ""}</div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom ">Ngành nghề</div>
              </td>
              <td>
                <div className="cell-custom">{field_job?.name}</div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Mức lương tối thiểu</div>
              </td>
              <td>
                <div className="cell-custom">{detail["salary_range[from]"] && (+detail["salary_range[from]"] || 0).toLocaleString()}</div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom">Mức lương tối đa</div>
              </td>
              <td>
                <div className="cell-custom">{detail["salary_range[to]"] && (+detail["salary_range[to]"] || 0).toLocaleString()}</div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Kinh nghiệm</div>
              </td>
              <td>
                <div className="cell-custom">{experience?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom">Ngoại ngữ</div>
              </td>
              <td>
                <div className="cell-custom">{language?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Bằng cấp</div>
              </td>
              <td>
                <div className="cell-custom">{level?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom">Hình thước làm việc</div>
              </td>
              <td>
                <div className="cell-custom">{work_time?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Giới tính</div>
              </td>
              <td>
                <div className="cell-custom">{seeker_gender?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom">Trạng thái hồ sơ</div>
              </td>
              <td>
                <div className="cell-custom">{is_sent?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Trạng thái hiển thi</div>
              </td>
              <td>
                <div className="cell-custom">{is_seen?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom">Ngày tạo</div>
              </td>
              <td>
                <div className="cell-custom">
                  {detail["created_at[from]"] && moment.unix(detail["created_at[from]"]).format('DD/MM/YYYY')}
                  -
                  {detail["created_at[to]"] && moment.unix(detail["created_at[to]"]).format('DD/MM/YYYY')}
                </div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Ngày làm mới</div>
              </td>
              <td>
                <div className="cell-custom">
                  {detail["refreshed_at[from]"] && moment.unix(detail["refreshed_at[from]"]).format('DD/MM/YYYY')}
                  -
                  {detail["refreshed_at[to]"] && moment.unix(detail["refreshed_at[to]"]).format('DD/MM/YYYY')}
                </div>
              </td>
            </tr>
            <tr className="el-table-row tr-background">
              <td>
                <div className="cell-custom tr-background">Sắp xếp theo thời gian tạo</div>
              </td>
              <td>
                <div className="cell-custom">{created_at?.title}</div>
              </td>
            </tr>
            <tr className="el-table-row">
              <td>
                <div className="cell-custom">Sắp xếp theo thời gian cập nhật</div>
              </td>
              <td>
                <div className="cell-custom">{updated_at?.title}</div>
              </td>
            </tr>
          </TableBody>
        </TableComponent>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    sys: state.sys,
    api: state.api,
  };
}

export default connect(mapStateToProps, null)(TableDetailFilter);
