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
        const {idKey, common, value, cls} = this.props;
        const items = _.get(common, idKey);
        const item = _.find(items, {value: value});
        const styles = {color: _.get(item, "background_color", null)};
        let className = cls || `col-sm-8 col-xs-8`;

        return (
            <span className={className} style={styles} typeof={idKey}>
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

SpanText.propTypes = {
    idKey: PropTypes.string.isRequired,
    value: PropTypes.any,
    cls: PropTypes.string,
};

export default connect(mapStateToProps, null)(SpanText);
