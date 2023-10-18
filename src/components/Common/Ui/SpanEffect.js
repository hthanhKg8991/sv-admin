import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class SpanEffect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {effect, value, notStyle} = this.props;
        const item = _.find(effect, {code: value});
        const styles = {background: _.get(item, "background_color", null), color: _.get(item, "text_color", '#fff')};
        const className = !notStyle ? "label" : null;

        return (
            <span className={className} style={!notStyle ? styles : null}>
                {_.get(item, "name", value)}
            </span>
        )
    }
}

function mapStateToProps(state) {
    return {
        effect: _.get(state, ['sys', 'effect', 'items'], null)
    };
}

SpanEffect.propTypes = {
    value: PropTypes.any.isRequired,
    notStyle: PropTypes.bool
};

export default connect(mapStateToProps, null)(SpanEffect);
