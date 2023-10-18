import React, { Component } from "react";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import { connect } from "react-redux";

class ComponentFilter extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render() {
        const { query, menuCode, idKey } = this.props;

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Từ khóa" name="keyword" timeOut={1000} />
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

export default connect(mapStateToProps, {})(ComponentFilter);
