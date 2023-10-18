import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey} = this.props;
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã số thuế" name="tax_code" timeOut={1000}/>
                <SearchField type="datetimerangepicker" label="Thời gian mua hàng" name="ordered_on" />
            </FilterLeft>
        )
    }
}

export default connect(null, null)(ComponentFilter);
