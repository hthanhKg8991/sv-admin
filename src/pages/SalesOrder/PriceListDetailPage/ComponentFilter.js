import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getListPriceList} from "api/saleOrderV2";

class ComponentFilter extends Component {

    constructor() {
        super();
        this.state = {
        }

        this.getListPriceList = this._getListPriceList.bind(this);
    }

    async _getListPriceList() {
        const res = await getListPriceList({
            per_page: 999
        });

        if (res && Array.isArray(res?.items)) {
            const firstValueFound = res?.items?.find((item) => Number(item?.status) === Constant.SKU_PRICE_STATUS_ACTIVE)?.id
            this.setState({price_list: res?.items,firstValue: firstValueFound});
        }
    }

    componentDidMount() {
        this.getListPriceList();
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {price_list} = this.state;
        const price_list_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_price_list_status_v2);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã, Tên SKU" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={price_list_status}/>
                <SearchField type="dropbox" label="Bảng giá" name="price_list_id" key_value="id" key_title="title"
                             data={price_list}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        province: state.province,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
