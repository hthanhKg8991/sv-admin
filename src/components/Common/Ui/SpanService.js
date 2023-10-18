import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class SpanService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {service, effect, serviceFree, value, notStyle} = this.props;
        const item = _.find([...service,...effect,...serviceFree], {code: value});
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
        service: _.get(state, ['sys', 'service', 'items'], []),
        effect: _.get(state, ['sys', 'effect', 'items'], []),
        serviceFree: _.get(state, ['sys', 'serviceFree', 'items'], [])
    };
}

SpanService.propTypes = {
    value: PropTypes.any.isRequired,
    notStyle: PropTypes.bool
};

export default connect(mapStateToProps, null)(SpanService);
