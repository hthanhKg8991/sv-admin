import React, { Component } from "react";
import { connect } from "react-redux";
import { publish, subscribe } from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Edit from "./Edit";
import { getDetailUppercaseKeyword } from 'api/system';
import LoadingSmall from 'components/Common/Ui/LoadingSmall';


const idKey = "RequestEdit";


class FormContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            loading: true,
            detail: null,
            id: _.get(queryParsed, 'id')
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({ loading: true }, () => {
                this.asyncData().then();
            });
        }, idKey));
    }

    async asyncData() {
        const { id } = this.state;
        this.setState({ detail: null });
        if (id > 0) {
            const res = await getDetailUppercaseKeyword({id});
            if (res) {
                this.setState({ detail: res, loading: false });
            }
        } else {
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        const { id } = this.state;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({ loading: false });
        }
    }

    render() {
        const { history } = this.props;
        const { id, detail, loading } = this.state;
        return (
            <Default
                title={`Chi tiết Từ khóa In Hoa`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {loading && <LoadingSmall className="form-loading"/>}
                <Edit idKey={idKey} id={id} history={history} detail={detail}/>
            </Default>
        )
    }
}

export default connect(null, null)(FormContainer);
