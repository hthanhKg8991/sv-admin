import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "pages/CustomerCare/ToolTransferStepGetEmployerPage/Edit";
import HistoryContainer from "pages/CustomerCare/ToolTransferStepGetEmployerPage/HistoryContainer";

class FormContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id')
        };
    }

    render() {
        const {history} = this.props;
        const {id} = this.state;
        const idKeyList = "ToolTransferStepGetEmployerEdit";
        const idKeyHistory = "ToolTransferStepGetEmployerHistory";

        return (
            <>
                <Default
                    title={`Tạo yêu cầu lấy danh sách NTD`}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKeyList)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                    <Edit idKey={idKeyList} id={id} history={history}/>
                </Default>
                {id > 0 && <HistoryContainer idKey={idKeyHistory} id={id} history={history}/>}
            </>
        )
    }
}

export default connect(null, null)(FormContainer);
