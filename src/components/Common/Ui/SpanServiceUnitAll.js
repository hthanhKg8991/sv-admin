import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import _ from "lodash";

class SpanServiceUnit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { service, effect, serviceFree, value } = this.props;
        const item = _.find([...service, ...effect, ...serviceFree], { code: value });
        return (
            <span className="ml5">
                {_.get(item, "unit", value)}
            </span>
        )
    }
}

function mapStateToProps(state) {
    return {
        service: _.get(state, ['sys', 'service', 'list'], null),
        effect: _.get(state, ['sys', 'effect', 'list'], null),
        serviceFree: _.get(state, ['sys', 'serviceFree', 'list'], null)
    };
}

SpanServiceUnit.propTypes = {
    value: PropTypes.any.isRequired,
};

export default connect(mapStateToProps, null)(SpanServiceUnit);
