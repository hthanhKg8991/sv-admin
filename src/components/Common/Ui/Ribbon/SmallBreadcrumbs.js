import React from 'react'
import {connect} from 'react-redux';
import * as utils from "utils/utils";

class SmallBreadcrumbs extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            breadcrumbs: []
        };
    }

    initBreadcrumbs(menu){
        let pathname = window.location.pathname;
        let navigation = [];
        Object.keys(menu).forEach((key) => {
            navigation.push(menu[key])
        });
        let breadcrumbs = utils.getBreadcrumbs(pathname, {}, navigation);
        if (!breadcrumbs.length){
            breadcrumbs = ['Home'];
        }
        let title = breadcrumbs[1] ? breadcrumbs[1] : breadcrumbs[0];
        document.title = title + ' - ERP';
        this.setState({breadcrumbs: breadcrumbs});
    }

    componentWillMount() {
        if (this.props.sys.menu){
            this.initBreadcrumbs(this.props.sys.menu);
        }
    }

    componentWillReceiveProps(newProps){
        if (newProps.sys.menu){
            this.initBreadcrumbs(newProps.sys.menu);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        return (
            <ol className="breadcrumb">
                {
                    this.state.breadcrumbs.map((it,key) => (
                        <li key={key}>{it}</li>
                    ))
                }
            </ol>
        )
    }
}

function mapStateToProps(state) {
    return {
        router: state.router,
        sys: state.sys,
    };
}


export default connect(mapStateToProps)(SmallBreadcrumbs)
