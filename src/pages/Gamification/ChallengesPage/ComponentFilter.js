import React, {Component} from "react";
import {connect} from "react-redux";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getListFullGamificationChallengesCategory} from "api/gamification";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            challenges_category : [],
        }
        this.asyncData = this._asyncData.bind(this)
    }

    async _asyncData(){
        const res = await getListFullGamificationChallengesCategory({status: Constant.GAMIFICATION_CHALLENGE_CATEGORY_STATUS_ON, per_page: 99 })
        if (res){
            const challenges_category = res.map(v=>({value: v.id, title: `${v.id} - ${v.name}`}));
            this.setState({challenges_category});
        }
    }
    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {challenges_category} = this.state;
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_gamification_challenges_status);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID, Code, Tên" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Category" name="category_id" data={challenges_category}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(ComponentFilter);
