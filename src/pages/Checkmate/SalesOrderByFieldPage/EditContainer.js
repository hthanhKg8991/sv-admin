import React, {Component} from "react";
import {publish, subscribe} from "utils/event";
import _ from "lodash";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "pages/Checkmate/SalesOrderByFieldPage/Edit";
import FieldPackage from "pages/Checkmate/SalesOrderByFieldPage/Package/FieldPackage";
import AppendixPackage from "pages/Checkmate/SalesOrderByFieldPage/Package/AppendixPackage";
import {getDetailSalesOrderByField} from "api/saleOrder";
import * as utils from "utils/utils";

const idKey = "SalesOrderByFieldEdit";

class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: null,
            isShowField: false,
            isShowAppendix: false,
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this._getSaleOrder();
        }, idKey));
        this.subscribers.push(subscribe('.refresh', () => {
            this._reRenderAppendix();
        }, `${idKey}Appendix`));
    }

    async _getSaleOrder() {
        const searchParam = _.get(this.props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        const id = _.get(queryParsed, 'id');
        if(id > 0) {
            this.setState({isShowField: false});
            const res = await getDetailSalesOrderByField({id: id});
            if (res) {
                this.setState({object: res, isShowField: true});
                if (parseInt(res.status) === Constant.SALE_ORDER_ACTIVED) {
                    this.setState({isShowAppendix: true});
                }
            }
        }
    }

    _reRenderAppendix() {
        this.setState({isShowAppendix: false}, () => {
            this.setState({isShowAppendix: true});
        });
    }

    componentDidMount() {
        this._getSaleOrder();
    }

    render() {
        const {history} = this.props;
        const {object, isShowField, isShowAppendix} = this.state;
        const searchParam = _.get(this.props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        const id = _.get(queryParsed, 'id');
        const status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_by_field_status);
        const title = object ? `Chỉnh Sửa Quản Lý Phiếu Đăng Ký - ID ${object?.id} - ${status[object?.status]}` : "Thêm Quản Lý Phiếu Đăng Ký";
        return (
            <>
                <Default
                    title={title}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                    <Edit idKey={idKey} id={id} history={history}/>
                </Default>
                {isShowField && (
                    <div className="box-field-package mt20">
                        <FieldPackage sales_order_id={id} history={history} object={object}/>
                    </div>
                )}
                {isShowAppendix && (
                    <div className="box-appendix-package mt20">
                        <AppendixPackage sales_order_id={id} history={history} object={object}/>
                    </div>
                )}
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormContainer);
