import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class SpanSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {system, value, multi, notStyle, idKey, label} = this.props;
        let item = _.find(system, o => String(o[idKey]) === String(value));
        const styles = {background: _.get(item, "background_color", null), color: _.get(item, "text_color", '#fff')};
        const className = !notStyle ? "label" : null;
        return (
            <>
                {multi && (', ')}
                <span className={className} style={!notStyle ? styles : null}>
                    {_.get(item, label, value)}
                </span>
            </>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const {type} = ownProps;

    return {
        system: _.get(state, ['sys', type, 'items'], null)
    };
}

SpanSystem.defaultProps = {
    idKey: "id",
    label: "name",
};

SpanSystem.propTypes = {
    value: PropTypes.any.isRequired,
    notStyle: PropTypes.bool,
    multi: PropTypes.bool,
    idKey: PropTypes.string,
    label: PropTypes.string,
};

export default connect(mapStateToProps, null)(SpanSystem);
