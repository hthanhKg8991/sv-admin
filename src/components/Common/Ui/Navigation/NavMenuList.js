import React from 'react'
import NavMenuItem from './NavMenuItem'

export default function SmartMenuList(props) {

    const {items, ...p} = props;

    return (
        <ul {...p}>
            {items.map((item) => {
                if (parseInt(item.visible_status) === 1) {
                    return <NavMenuItem item={item} key={item.id}/>;
                }else{
                    return null;
                }
            })}
        </ul>
    )
}
