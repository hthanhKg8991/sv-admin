import React, {Component} from "react";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from 'components/Common/Ui/Table/FilterLeft';


class ComponentFilter extends Component {

    render() {
        const {query, menuCode, idKey} = this.props;
        return (
            <>
                <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={5}>
                    <SearchField type="input" label="Tags" name="title" timeOut={1000}/>
                </FilterLeft>
            </>

        )
    }
}

export default ComponentFilter;
