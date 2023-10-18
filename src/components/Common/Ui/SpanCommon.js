import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class SpanCommon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {idKey, common, value, notStyle} = this.props;
        const items = _.get(common, idKey);
        const item = _.find(items, (o)=> String(o.value) === String(value));
        const styles = {background: item?.background_color, color: item?.text_color || "#000000"};
        const className = !notStyle ? "label" : null;
        return (
            <span className={className} typeof={idKey} style={!notStyle ? styles : null} title={_.get(item, "name", null)}>
                {_.get(item, "name", null)}
            </span>
        )
    }
}

function mapStateToProps(state) {
    return {
        common: _.get(state, ['sys', 'common', 'items'], null)
    };
}

SpanCommon.propTypes = {
    idKey: PropTypes.string.isRequired,
    value: PropTypes.any,
    notStyle: PropTypes.bool
};

export default connect(mapStateToProps, null)(SpanCommon);
