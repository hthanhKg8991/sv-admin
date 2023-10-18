import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import {
   WrapFilter, 
   Gird, 
   SpanCommon, 
   CanRender
} from "components/Common/Ui";
import {Link} from "react-router-dom";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import queryString from "query-string";
import ROLES from "utils/ConstantActionCode";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {
    getListPromotionProgramEmployer,
    // createPromotionProgramEmployer,
    deletePromotionProgramEmployer,
} from "api/saleOrder";
import PopupCreate from "./PopupCreate";
import * as uiAction from "actions/uiAction";

const idKey = "GroupCampaignPageList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
               {
                  title: "Mã Campaign",
                  width: 80,
                  accessor: "promotion_programs_id"
               },
               {
                  title: "Nhà Tuyển Dụng",
                  width: 200,
                  cell: row => (
                     <Link
                         target={"_blank"}
                         to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                             id: row.employer_id,
                             action: "detail"
                         })}`}>
                         <span>{row.employer_id} - {row.employer_name}</span>
                     </Link>
                 )
               },
               {
                  title: "Mã code",
                  width: 120,
                  accessor: 'promotion_programs_code'
               },
               {
                  title: "CSKH",
                  width: 140,
                  accessor: 'assigned_staff_username'
               },
               {
                  title: "Phiếu đã dùng",
                  width: 100,
                  accessor: 'sales_order_id'
               },
               {
                  title: "Trạng thái sử dụng",
                  width: 140,
                  cell: row => <div className="text-center">
                     <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_with_code_promotion_status} value={row?.status}/>
                  </div>
               },
            //    {
            //       title: "Trạng thái gửi mail",
            //       width: 140,
            //       cell: row => <div className="text-center">
            //          <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_with_code_promotion_email_status} value={row?.status_mail}/>
            //       </div>
            //    },
            //    {
            //       title: "Opened",
            //       width: 80,
            //       accessor: 'open_count'
            //    },
            //    {
            //       title: "Click",
            //       width: 80,
            //       accessor: 'click_count'
            //    },
               {
                  title: "Hành Động",
                  width: 100,
                  cell: row => (
                     <>
                        <CanRender actionCode={ROLES.customer_care_list_employer_code_promotion_delete}>
                           &nbsp;&nbsp;
                           <span className="pointer text-bold text-red" onClick={()=>{this.onDelete(row?.id)}}>Xoá</span>
                        </CanRender>
                     </>
                  )
               },
            ],
            loading: false,
        };

        this.onCreate = this._onCreate.bind(this)
        this.onDelete = this._onDelete.bind(this)
    }

    _onCreate (){
        const {uiAction} = this.props;
        uiAction.createPopup(PopupCreate, "Thêm NTD dùng code promotion");
    }

    _onDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa NTD ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deletePromotionProgramEmployer({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách NTD dùng code promotion"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.customer_care_list_employer_code_promotion_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onCreate}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListPromotionProgramEmployer}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
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
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
