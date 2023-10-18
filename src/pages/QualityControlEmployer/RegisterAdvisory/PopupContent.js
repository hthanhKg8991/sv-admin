import React, { Component } from "react";
import { getAdvisoryRegisterDetail } from "api/mix";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import moment from "moment";

const idKey = "RegisterAdvisory";

class PopupContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  async _fetchData() {
    const { object } = this.props;
    const res = await getAdvisoryRegisterDetail({ register_id: object.id });
    if (res) {
      this.setState({ data: res });
    }
  }
  componentDidMount() {
    this._fetchData();
  }

  render() {
    const { data } = this.state;
    const {
      address,
      company_name,
      email,
      name,
      phone,
      type,
      seeker_name,
      employer_name,
      region,
      created_at,
      seeker_email,
      employer_email,
    } = data;
    return (
      <div className="padding-10">
        <div className="body-table el-table">
          <TableComponent allowDragScroll={false}>
            <TableHeader tableType="TableHeader" width={200}>
              Người cập nhật
            </TableHeader>
            <TableHeader tableType="TableHeader" width={200}>
              Thời gian cập nhật
            </TableHeader>
            <TableBody tableType="TableBody">
              <tr className="el-table-row">
                <td className="el-table-row active">
                  <div className="cell">
                    {seeker_email || employer_email || email}
                  </div>
                </td>
                <td className="el-table-row active">
                  <div className="cell">
                    {moment(created_at).format("DD-MM-YYYY HH:mm:ss")}
                  </div>
                </td>
              </tr>
            </TableBody>
          </TableComponent>
          <div className="p-relative mt15">
            <TableComponent allowDragScroll={false}>
              <TableHeader tableType="TableHeader" width={200}>
                Trường thông tin
              </TableHeader>
              <TableHeader tableType="TableHeader" width={200}>
                Nội dung
              </TableHeader>
              <TableBody tableType="TableBody">
                <tr className="el-table-row">
                  <td>
                    <div className="cell">Họ và tên</div>
                  </td>
                  <td>
                    <div className="cell">{name || seeker_name}</div>
                  </td>
                </tr>
                <tr className="el-table-row tr-background">
                  <td>
                    <div className="cell">Số điện thoại</div>
                  </td>
                  <td>
                    <div className="cell">{phone}</div>
                  </td>
                </tr>
                <tr className="el-table-row">
                  <td>
                    <div className="cell">Địa chỉ</div>
                  </td>
                  <td>
                    <div className="cell">{address}</div>
                  </td>
                </tr>
                <tr className="el-table-row tr-background">
                  <td>
                    <div className="cell">Khu vực tư vấn</div>
                  </td>
                  <td>
                    <SpanCommon
                      idKey={Constant.COMMON_DATA_KEY_region}
                      value={region}
                    />
                  </td>
                </tr>
                <tr className="el-table-row ">
                  <td>
                    <div className="cell">Địa chỉ email</div>
                  </td>
                  <td>
                    <div className="cell">{email}</div>
                  </td>
                </tr>
                {Number(type) === 1 && (
                  <tr className="el-table-row tr-background">
                    <td>
                      <div className="cell">Tên công ty</div>
                    </td>
                    <td>
                      <div className="cell">{company_name}</div>
                    </td>
                  </tr>
                )}
              </TableBody>
            </TableComponent>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(PopupContent);
