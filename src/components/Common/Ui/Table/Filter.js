import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {pushFilter, removeFilter} from "actions/filterAction";
import _ from "lodash";
import BoxSearch from "components/Common/Ui/Table/BoxSearch";

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this._onSearch.bind(this);
    }

    _onSearch(params) {
        const {actions, idKey} = this.props;

        actions.pushFilter(idKey, params);
    }

    componentWillUnmount() {
        const {actions, idKey} = this.props;

        actions.removeFilter(idKey);
    }

    render() {
        const {idKey, initFilter, query} = this.props;
        const filter = _.get(this.props, "Filter" + idKey, initFilter);

        const criteria = filter || query;

        return (
            <BoxSearch showQtty={9999} onChange={this.onSearch} filter={criteria}>
                {this.props.children}
            </BoxSearch>
        );
    }
}

Filter.propTypes = {
    idKey: PropTypes.string.isRequired,
    initFilter: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
    const {idKey} = ownProps;

    return {
        ['Filter' + idKey]: state.filter[idKey]
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({pushFilter, removeFilter}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
