import React, {Component} from "react";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {FilterLeft} from "components/Common/Ui";

class ComponentFilter extends Component {
    render () {
        const {query,idKey,menuCode} = this.props;
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} >
                <SearchField type="input" label="Từ khóa, Slug" name="q" timeOut={1000}/>
            </FilterLeft>
        )
    }
}

export default ComponentFilter;
