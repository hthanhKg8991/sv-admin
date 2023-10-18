import React, {Component} from "react";
import {connect} from "react-redux";
import { publish, subscribe } from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Edit from "pages/QualityControlEmployer/RequirementApprovePage/EditJob";
import HistoryChangeTitle
    from 'pages/QualityControlEmployer/RequirementApprovePage/Detail/HistoryChangeTitle';
import { getDetail } from 'api/job';
import { getDetail as getEmployerDetail }  from 'api/employer';
import * as Constant from 'utils/Constant';

const idKey = "RequestJob";

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
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));

    }


    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getDetail(id);
            if(res) {
                const resEmployer = await getEmployerDetail(res.employer_id);
                if(resEmployer){
                    res.job_id = res.id;
                    res.employer_name = resEmployer.name;
                    res.employer_address = resEmployer.address;
                    res.email = resEmployer.email;
                    res.name = res.job_contact_info.contact_name;
                    res.type = Constant.REASON_APPROVE_CHANGE_TITLE;
                }
                this.setState({detail: res,  loading: false});
            }
        } else {
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const {history} = this.props;
        const {id,detail} = this.state;
        return (
            <Default
                title={`Gửi yêu cầu`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Edit idKey={idKey} id={id} history={history} detail={detail}/>
                {detail && (
                    <HistoryChangeTitle history={history} job_id={detail?.id} idKey={idKey}/>
                )}
            </Default>
        )
    }
}

export default connect(null, null)(FormContainer);
