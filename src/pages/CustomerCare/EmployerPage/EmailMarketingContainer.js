import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";
import EmailMarketing from "pages/CustomerCare/EmployerPage/EmailMarketing";
import Default from "components/Layout/Page/Default";
import {publish} from "utils/event";

class EmailMarketingContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            employerId: _.get(queryParsed, 'employer_id'),
        };
    }

    render() {
        const {history} = this.props;
        const {employerId} = this.state;
        const idKey = "EmailMarketing";

        return (
            <Default
                title={'Xác Nhận Đăng Ký Thông Báo Hồ Sơ Phù Hợp'}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <EmailMarketing idKey={idKey} employerId={employerId} history={history} />
            </Default>
        );
    }
}

export default connect(null, null)(EmailMarketingContainer);
