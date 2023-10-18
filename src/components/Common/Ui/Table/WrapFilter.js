import React from "react";
import _ from "lodash";
import QuickFilter from "components/Common/Ui/Table/QuickFilter";
import {connect} from "react-redux";

class WrapFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {idKey, menu, query, ComponentFilter, history, is_archived, is_search_employer, hideQuickFilter, options} = this.props;
        const pathname = window.location.pathname;
        let menuCode = null;
        if(menu){
            _.forEach(menu, (item) => {
                if (_.has(item, 'child')) {
                    _.forEach(item.child, (itemChild) => {
                        if (itemChild.url === pathname) {
                            menuCode = itemChild.code;
                        }
                    })
                } else {
                    if (item.url === pathname) {
                        menuCode = item.code;
                    }
                }
            });
        }

        return (
            <React.Fragment>
                {!_.isEmpty(menuCode) && !hideQuickFilter && <QuickFilter idKey={idKey} menuCode={menuCode} query={query}/>}
                {!_.isEmpty(menuCode) && ComponentFilter && <ComponentFilter is_search_employer={is_search_employer} is_archived={is_archived} history={history} idKey={idKey} menuCode={menuCode} query={query} options={options}/>}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        menu: state.sys.menu
    };
}

export default connect(mapStateToProps, null)(WrapFilter);
