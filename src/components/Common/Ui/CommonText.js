import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class SpanText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {idKey, common, value} = this.props;
        const items = _.get(common, idKey);
        const item = _.find(items, {value: value});

        return (
           <>{_.get(item, "name", null)}</>
        )
    }
}

function mapStateToProps(state) {
    return {
        common: _.get(state, ['sys', 'common', 'items'], null)
    };
}

SpanText.propTypes = {
    idKey: PropTypes.string.isRequired,
    value: PropTypes.any,
    cls: PropTypes.string,
};

export default connect(mapStateToProps, null)(SpanText);
