import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "./Edit";
import RecruitmentRequestItems from "pages/HeadhuntPage/RecruitmentRequestPage/Edit/Items";
const idKey = "RecruitmentRequestEdit";

class FormContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id')
        };
        this.setID = this._setID.bind(this)
    }
    _setID(id){
        this.setState({id})
    }

    render() {
        const {history} = this.props;
        const {id} = this.state;
        return (
            <>
                <Default
                    title={`${id > 0 ? "Chỉnh Sửa" : "Thêm Mới"}`}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                    <Edit idKey={idKey} id={id} history={history} setID={this.setID}/>
                </Default>
                {id > 0 && (
                    <>
                        <Default title={"Yêu cầu tuyền dụng"}>
                            <RecruitmentRequestItems id={id} history={history} />
                        </Default>
                    </>


                )}
            </>

        )
    }
}

export default connect(null, null)(FormContainer);
