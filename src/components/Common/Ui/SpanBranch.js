import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class SpanBranch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {branch, value} = this.props;
        const item = _.find([...branch], {code: value});
        return (
            <span >
                {_.get(item, "title", value)}
            </span>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: _.get(state, ['branch', 'branch_list'], []),
    };
}

SpanBranch.propTypes = {
    value: PropTypes.any.isRequired,
    notStyle: PropTypes.bool
};

export default connect(mapStateToProps, null)(SpanBranch);
