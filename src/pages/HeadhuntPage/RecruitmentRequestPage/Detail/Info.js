import React, {Component} from "react";
import {connect} from "react-redux";
import {
    getDetailRecruitmentRequest,
    getListFullIndustryHeadhunt,
    getListFullRecruitmentRequestDetail
} from "api/headhunt";
import moment from "moment";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import TableComponent from "components/Common/Ui/Table";
import * as Constant from "utils/Constant";
import queryString from 'query-string';
import {subscribe} from "utils/event";
import {getVsic} from "api/system";

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: null,
            data_list: [],
            vsics: [],
            industry: [],
        }
        this.asyncData = this._asyncData.bind(this);
        this.goBack = this._goBack.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.getListVsic = this._getListVsic.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }
    _goBack(){
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST,
        });
        return true;
    }
    _btnEdit(){
        const {history,id} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST,
            search: '?' + queryString.stringify({id,action: "edit"})
        });
        return true;
    }
    async _getListVsic() {
        const res = await getVsic();
        if(res) {
            this.setState({
                vsics: res
            })
        }
    }
    async _asyncData(){
        const {id} = this.props;
        const [object, data_list] = await Promise.all([
            getDetailRecruitmentRequest({id}),
            getListFullRecruitmentRequestDetail({recruitment_request_id: id})
        ]);
        if (object && data_list){
            this.setState({object,data_list});
        }
    }

    async _getListIndustry() {
        const res = await getListFullIndustryHeadhunt();
        if (res){
            this.setState({industry: res})
        }
    }
    componentDidMount(){
        this.getListVsic();
        this.asyncData();
        this._getListIndustry();
    }
    render() {
        const {object, data_list, vsics, industry} = this.state;
        if (!object) return null;
        return (
            <div className="row">
                <div className="col-sm-6">
                    <div className="row">
                        <div className="col-sm-12 sub-title-form mb10">
                            <span>Thông tin chung</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Ngày request</div>
                        <div className="col-md-9 mb10 font-bold">{moment.unix(object.request_at).format('DD-MM-YYYY')}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Deadline</div>
                        <div className="col-md-9 mb10 font-bold">{object.deadline_at ? moment.unix(object.deadline_at).format('DD-MM-YYYY') : ""}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Giá trị request</div>
                        <div className="col-md-9 mb10 font-bold">{object.request_value}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Note</div>
                        <div className="col-md-9 mb10 font-bold" dangerouslySetInnerHTML={{__html: object?.note}} />
                    </div>
                    <div className="row">
                        <div className="col-sm-12 sub-title-form mb10">
                            <span>Thông tin hợp đồng</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Hợp đồng</div>
                        <div className="col-md-9 mb10 font-bold">{object.contract_info?.name}</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 sub-title-form mb10">
                            <span>Nhân viên chăm sóc</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Sale</div>
                        <div className="col-md-9 mb10 font-bold">
                            {Array.isArray(object.list_sale_staff_login_name)
                            && object.list_sale_staff_login_name.map((v,idx)=>(
                                <div key={idx}>{v}</div>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Recruiter</div>
                        <div className="col-md-9 mb10 font-bold">
                            {Array.isArray(object.list_recruiter_staff_login_name)
                            && object.list_recruiter_staff_login_name.map((v,idx)=>(
                                <div key={idx}>{v}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="row">
                        <div className="col-sm-12 sub-title-form mb10">
                            <span>Thông tin khách hàng</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Khách hàng</div>
                        <div className="col-md-9 mb10 font-bold">{object.customer_info?.company_name}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Ngành nghề</div>
                        <div className="col-md-9 mb10 font-bold">
                            {industry?.find(v=> v.id === object.customer_info?.industry_id)?.name}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Lĩnh vực hoạt động</div>
                        <div className="col-md-9 mb10 font-bold">
                            {Array.isArray(object.customer_info?.fields_activity) &&
                            vsics.filter(v => object.customer_info?.fields_activity.includes(v?.id))
                                .map((m,j) => <div key={j}>{m?.name}</div>)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Mã số thuế</div>
                        <div className="col-md-9 mb10 font-bold">{object.customer_info?.tax_code}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 mb10">Contact</div>
                        <div className="col-sm-10 mb10">
                            <div className="crm-section">
                                    <div className="body-table el-table">
                                        <TableComponent className="table-custom" DragScroll={false}>
                                            <TableHeader tableType="TableHeader" width={80}>
                                                Tên liên hệ
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={80}>
                                                Email liên hệ
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={80}>
                                                SĐT liên hệ
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={80}>
                                                Chức vụ
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                {object?.customer_contact_info?.map((item, key) => {
                                                    return (
                                                        <React.Fragment key={key}>
                                                            <tr>
                                                                <td>
                                                                    <div className="cell-custom mb10 mt10">
                                                                        {item.name}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="cell-custom mb10 mt10">
                                                                        {item.email}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="cell-custom mb10 mt10">
                                                                        {item.phone}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="cell-custom text-center mb10 mt10">
                                                                        {item.position}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </TableBody>
                                        </TableComponent>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-12 sub-title-form mb10">
                            <span>Yêu cầu tuyển dụng</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb10">
                            <div className="crm-section">
                                <div className="body-table el-table">
                            <TableComponent className="table-custom" DragScroll={false}>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Vị trí tuyển dụng
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Số lượng cần tuyển
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Địa điểm làm việc
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Quy trình phỏng vấn
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Yêu cầu kinh nghiệm
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Yêu cầu khác
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    Gói dịch vụ
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Mức phí 1 ứng viên
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={80}>
                                    Bảo hành
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={50}>
                                    Điều khoản thanh toán
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={50}>
                                    File JD
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list?.map((item, key) => {
                                        return (
                                            <React.Fragment key={key}>
                                                <tr>
                                                    <td>
                                                        <div className="cell-custom mb10 mt10">
                                                            {item.title}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mb10 mt10">
                                                            {item.quantity_needed}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom mb10 mt10">
                                                            {item.location}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10">
                                                            {item.interview_process}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10" dangerouslySetInnerHTML={{__html: item.experience_required}} />
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10" dangerouslySetInnerHTML={{__html: item.other_required}} />
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10">
                                                            {item.sku_code}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10">
                                                            {item.fee}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10">
                                                            {item.guarantee}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10">
                                                            {item.payment_term}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell-custom text-center mb10 mt10">
                                                            <a href={item.file_url} target={"_blank"}>File</a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <button className="el-button el-button-primary mr15" onClick={this.btnEdit}>Chỉnh sửa</button>
                    <button className="el-button el-button-default mr15" onClick={this.goBack}>Quay lại</button>
                </div>
            </div>
        )
    }
}

export default connect(null, null)(Info);
