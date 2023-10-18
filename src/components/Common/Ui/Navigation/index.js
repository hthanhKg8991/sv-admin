import React from 'react';
import NavMenu from './NavMenu';
import MinifyMenu from './MinifyMenu'

export default class Navigation extends React.Component {
    render() {
        return (
            <aside id="left-panel">
                <nav>
                    <NavMenu openedSign={'<i class="fa fa-minus-square-o"/>'} closedSign={'<i class="fa fa-plus-square-o"/>'} accordion={false}/>
                </nav>
                <MinifyMenu />
            </aside>
        )
    }
}
