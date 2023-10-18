import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/QualityControlEmployer/CustomerSuggest/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {deleteCustomer, getListCustomerSuggest} from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";
import SpanSystem from "components/Common/Ui/SpanSystem";

const idKey = "CustomerSuggestList";

class List extends Component {
    constructor(props) {
        super(props);
        const {vsics} = props;
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Kênh",
                    width: 100,
                    accessor: "channel_code"
                },
                {
                    title: "Mã code",
                    width: 100,
                    accessor: "code"
                },
                {
                    title: "Loại code",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_type_code}
                                             value={row?.type_code} notStyle />
                },
                {
                    title: "Tên company",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Số điện thoại",
                    width: 120,
                    accessor: "phone"
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_suggest_status}
                                             value={row?.status} />
                },
                {
                    title: "Tỉnh thành",
                    width: 120,
                    cell: row => row?.province_id && <SpanSystem value={row?.province_id} type={"province"} notStyle/>
                },
                {
                    title: "Địa chỉ",
                    width: 120,
                    accessor: "address"
                },
                {
                    title: "Lĩnh vực hoạt động",
                    width: 120,
                    cell: row => Array.isArray(vsics) ?
                        vsics.filter(v => Array.isArray(row?.fields_activity) &&
                            row?.fields_activity.includes(v?.id))
                            .map(m => m?.name) : null,
                },
                {
                    title: "Quy mô",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                             value={row?.company_kind}
                                             notStyle />,
                },
                // {
                //     title: "Hành động",
                //     width: 120,
                //     cell: row => (
                //         <>
                //             <CanRender actionCode={ROLES.customer_care_customer_update}>
                //                 <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                //                     Chỉnh sửa
                //                 </span>
                //             </CanRender>
                //             <CanRender actionCode={ROLES.customer_care_customer_delete}>
                //                 <span className="text-link text-red font-bold ml5" onClick={() => this.onDelete(row?.id)}>
                //                     Xóa
                //                 </span>
                //             </CanRender>
                //         </>
                //     )
                // },
            ],
            loading : false,
            isImport: true,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        // const {history} = this.props;
        // history.push({
        //     pathname: Constant.BASE_URL_CUSTOMER,
        //     search: '?action=edit&id=0'
        // });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_CUSTOMER,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa KH ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteCustomer({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
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
                    title="Danh Sách Mã số thuế/CMND"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    // buttons={(
                    //     <div className="left btnCreateNTD">
                    //         <CanRender actionCode={ROLES.customer_care_customer_create}>
                    //             <button type="button" className="el-button el-button-primary el-button-small"
                    //                     onClick={this.onClickAdd}>
                    //                 <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                    //             </button>
                    //         </CanRender>
                    //     </div>
                    // )}
                    >
                <Gird idKey={idKey}
                      fetchApi={getListCustomerSuggest}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
