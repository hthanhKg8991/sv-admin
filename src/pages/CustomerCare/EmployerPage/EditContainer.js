import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Edit from "pages/CustomerCare/EmployerPage/Edit";
import Add from "pages/CustomerCare/EmployerPage/Add";

class FormContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            page_type: _.get(queryParsed, 'page_type'),
        };
    }

    render() {
        const {history} = this.props;
        const {id, page_type} = this.state;
        const idKey = "EmployerEdit";

        return (
            <Default
                title={id > 0 ? 'Chỉnh sửa Nhà Tuyển Dụng' : "Thêm mới Nhà Tuyển Dụng"}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {id > 0 ? <Edit idKey={idKey} id={id} history={history} page_type={page_type}/> :
                        <Add idKey={idKey} id={id} history={history} page_type={page_type}/>
                }
            </Default>
        )
    }
}

export default connect(null, null)(FormContainer);
