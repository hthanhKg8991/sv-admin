import React from "react";
import PropTypes from "prop-types";
import classnames from 'classnames';
import _ from "lodash";

class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indexActive: Number(props.tabActive) || 0
        };
    }

    _onChange(indexActive) {
        this.setState({indexActive: indexActive});
    }

    render() {
        const {items} = this.props;
        const {indexActive} = this.state;
        const componentActive = _.get(items, [indexActive, 'component'], null);

        return (
            <React.Fragment>
                <div className="nav-box">
                    <div className="nav-group">
                        {items.map((item, key) => {
                            const isDisabled = _.get(item, 'isDisabled', false);

                            return !isDisabled && (
                                <div className={classnames("nav-item pointer", {active: key === indexActive})}
                                     key={key}
                                     onClick={() => this._onChange(key)}>
                                    {item.title}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="relative content-box">
                    {componentActive}
                </div>
            </React.Fragment>
        )
    }
}

Tab.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        component: PropTypes.any.isRequired
    })).isRequired
};

export default Tab;
