import React from 'react'
// import ResetWidgets from './ResetWidgets'
import SmallBreadcrumbs from './SmallBreadcrumbs'


export default class Ribbon extends React.Component {
    render() {
        return (
            <div id="ribbon">
                {/*<span className="ribbon-button-alignment">*/}
                {/*    <ResetWidgets />*/}
                {/*</span>*/}
                <SmallBreadcrumbs />
            </div>
        )
    }
}
