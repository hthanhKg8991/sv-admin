import React from "react";
import MySelect from "components/Common/Ui/Form/MySelect";
import PropTypes from "prop-types";
import _ from "lodash";
import {connect} from "react-redux";

class MySelectService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {type, idKey, labelField, valueField, serviceType, isFree} = this.props;
        let data = _.get(this.props, [type, 'items']);
        if(type === 'common'){
            data = _.get(data, idKey);
        }

        const dataOptions = [];
        data.map((item) => {
            if(item.service_type === serviceType && ((isFree && item.is_free === isFree) || !isFree)) {
                dataOptions.push({
                    value: _.get(item, valueField),
                    label: _.get(item, labelField)
                })
            }
            return true;
        });

        return (
            dataOptions ? <MySelect {...this.props} options={dataOptions}/> : null
        );
    }
}

MySelectService.defaultProps = {
    labelField: "name",
    valueField: "id"
};

MySelectService.propTypes = {
    idKey: PropTypes.string,
    type: PropTypes.string.isRequired,
    serviceType: PropTypes.string,
    labelField: PropTypes.string,
    valueField: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    const {type} = ownProps;

    return {
        [type]: state.sys[type]
    };
}

export default connect(mapStateToProps, null)(MySelectService);
