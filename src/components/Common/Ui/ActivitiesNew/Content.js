import React from 'react';

import Notification from './Notification';


class AlignItemsList extends React.Component {
    render() {
        const {dataNotify, onView, onDelete} = this.props;
        return (
            <Notification onView={onView} onDelete={onDelete} dataNotify={dataNotify}/>
        )
    };
}

export default AlignItemsList;
