import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class SpanJobField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const { jobField, value} = this.props;
        const item = _.find(jobField, {id: value});
        return (
            <span>
                {_.get(item, "name", null)}
            </span>
        )
    }
}

function mapStateToProps(state) {
    return {
        jobField: _.get(state, ['sys', 'jobField', 'items'], null)
    };
}

SpanJobField.propTypes = {
    value: PropTypes.any,
};

export default connect(mapStateToProps, null)(SpanJobField);
