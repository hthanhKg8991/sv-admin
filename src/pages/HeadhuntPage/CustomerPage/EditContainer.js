import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "pages/HeadhuntPage/CustomerPage/Edit";
import EditStaff from "pages/HeadhuntPage/CustomerPage/Edit/Staff";

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
        const idKey = "CustomerEdit";
        const idKeyStaff = "CustomerEditStaff";

        return (
            <>
                <Default
                    title={`${id > 0 ? "Chỉnh Sửa" : "Thêm"} Lead`}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                    <Edit idKey={idKey} id={id} history={history}/>
                </Default>
                {id > 0 && (
                    <Default
                        titleActions={(
                            <button type="button" className="bt-refresh el-button" onClick={() => {
                                publish(".refresh", {}, idKeyStaff)
                            }}>
                                <i className="fa fa-refresh"/>
                            </button>
                        )}>
                        <EditStaff idKey={idKeyStaff} id={id} history={history}/>
                    </Default>
                )}
            </>
        )
    }
}

export default connect(null, null)(FormContainer);
