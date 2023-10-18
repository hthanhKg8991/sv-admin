import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Edit from "pages/System/ShareBasketListPage//Edit";

const idKey = "ShareBasketListEdit";

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

        return (
            <Default
                title={`${id > 0 ? "Chỉnh Sửa" : "Thêm"} Cấu hình DS Nhận Giỏ (CSKH)`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Edit idKey={idKey} id={id} history={history}/>
            </Default>
        )
    }
}

export default connect(null, null)(FormContainer);
