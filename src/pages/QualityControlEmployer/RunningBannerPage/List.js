import React, {Component} from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import Gird from "components/Common/Ui/Table/Gird";
import {getRunningBannerList, deleteRunningBanner} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/QualityControlEmployer/RunningBannerPage/ComponentFilter";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import queryString from "query-string";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {Link} from 'react-router-dom';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên công ty",
                    width: 200,
                    cell: row => {
                        const {employer_info} = row;
                        return (
                            <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({action: "detail",id: employer_info?.id})}`}>
                                <span style={{color:'#3276b1'}}>{employer_info?.name}</span>
                            </Link>
                        );
                    },
                    onClick: ()=>{ return false},
                },
                {
                    title: "Loại tài khoản",
                    width: 100,
                    cell: row => {
                        const {employer_info} = row;
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status} value={_.get(employer_info, 'premium_status')}/>
                    },
                    onClick: ()=>{ return false},
                },
                {
                    title: "Quy mô",
                    width: 100,
                    cell: row => {
                        const {employer_info} = row;
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind} value={_.get(employer_info, 'company_kind') || _.get(employer_info, 'company_size')}/>
                    },
                    onClick: ()=>{ return false},
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    },
                    onClick: ()=>{ return false},
                },
                {
                    title: "Logo",
                    width: 80,
                    cell: row => (
                        <>
                            {row?.pc_image_url && (
                                <img src={row.pc_image_url} alt="logo" className="img-responsive"/>
                            )}
                            {!row?.pc_image_url && (
                                <img src="/assets/img/no_image.dc8b35d.png" alt="no logo" className="img-responsive"/>
                            )}
                        </>
                    ),
                    onClick: ()=>{ return false},
                },
                {
                    title: "Chức năng",
                    width: 100,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.quality_control_employer_our_customer_delete}>
                                <span onClick={() => this.onDelete(row.id)} className="btn-delete"><b>Xóa</b></span>
                            </CanRender>
                            <br/>
                            <CanRender actionCode={ROLES.quality_control_employer_our_customer_update}>
                                <span className={"text-link"} onClick={() => this.onEdit(row.id)}><b>Thay logo</b></span>
                            </CanRender>
                        </>
                    ),
                    onClick: ()=>{ return false},
                },
            ],
            loading : false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onEdit = this._onEdit.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_RUNNING_BANNER,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_RUNNING_BANNER,
                search: '?action=edit&id='+ id
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            const params = {
                ...search,
                id: id,
                action: "edit"
            };

            history.push({
                pathname: Constant.BASE_URL_RUNNING_BANNER,
                search: '?' + queryString.stringify(params)
            });

            return true;
        }
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa KH: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteRunningBanner({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, 'RunningBannerList')
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        const idKey = "RunningBannerList";

        return (
            <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh sách khách hàng của chúng tôi"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.quality_control_employer_our_customer_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getRunningBannerList}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
