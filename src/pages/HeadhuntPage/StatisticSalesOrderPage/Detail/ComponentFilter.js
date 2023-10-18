import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey, channel} = this.props;
        const channel_code = channel?.map(v=> ({value: v.code , title: v.display_name}))
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã số thuế" name="tax_code" timeOut={1000}/>
                <SearchField type="datetimerangepicker" label="Thời gian mua hàng" name="ordered_on" />
                <SearchField type="dropbox" label="website" name="channel_code" data={channel_code} />
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        channel: state.sys?.channel?.items,
    };
}

export default connect(mapStateToProps, null)(ComponentFilter);
