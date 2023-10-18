import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {compare} from "utils/utils";
import _ from "lodash";

class ButtonCommon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compare(nextProps, this.props);
    }

    render() {
        const {idKey, common, value, notStyle, onClick} = this.props;
        const items = _.get(common, idKey);
        const item = _.find(items, {value: value});
        const styles = {background: _.get(item, "background_color", null), color: _.get(item, "text_color", '#fff')};
        const className = !notStyle ? "label" : null;

        return (
            <button className={`el-button el-button-small ${className}`} style={!notStyle ? styles : null} onClick={onClick}>
                {_.get(item, "name", null)}
            </button>
        )
    }
}

function mapStateToProps(state) {
    return {
        common: _.get(state, ['sys', 'common', 'items'], null)
    };
}

ButtonCommon.propTypes = {
    idKey: PropTypes.string.isRequired,
    value: PropTypes.any,
    notStyle: PropTypes.bool,
    onClick: PropTypes.func
};

export default connect(mapStateToProps, null)(ButtonCommon);
