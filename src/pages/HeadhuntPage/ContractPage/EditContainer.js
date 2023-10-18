import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "./Edit";
import ContractRequestItems from "pages/HeadhuntPage/ContractPage/Package/Items";
import {getDetailHeadhuntContract} from "api/headhunt";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {subscribe} from "utils/event";

const idKey = "ContractUpdate";

class FormContainer extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
        this.state = {
            id: _.get(queryParsed, 'id'),
            detail: null,
            loading: false
        };
        this.setID = this._setID.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }

    _setID(id) {
        this.setState({id});
    }

    async _asyncData() {
        this.setState({loading: true});
        const {id} = this.state;
        if (id > 0) {
            const res = await getDetailHeadhuntContract({id});
            if (res) {
                this.setState({detail: res, loading: false});
            }
        }
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this.asyncData();
        }
    }

    render() {
        const {history} = this.props;
        const {id, detail, loading} = this.state;

        return (
            <>
                {loading ? <LoadingSmall className="form-loading"/> : (
                    <Default
                        title={detail ? <div>
                            <span>{`Chỉnh sửa hợp đồng - ${detail.id} -`}</span>
                            <SpanCommon
                                idKey={Constant.COMMON_DATA_KEY_headhunt_contract_status} notStyle
                                value={detail.status}/>
                        </div> : "Thêm hợp đồng"}
                        titleActions={(
                            <button type="button" className="bt-refresh el-button" onClick={this.asyncData}>
                                <i className="fa fa-refresh"/>
                            </button>
                        )}>
                        <Edit setID={this.setID} item={detail} asyncData={this.asyncData} idKey={idKey} id={id}
                              history={history}/>
                    </Default>
                )}
                {id > 0 && (
                    <Default
                        title="Yêu cầu tuyển dụng">
                        <ContractRequestItems id={id} asyncData={this.asyncData} detail={detail}/>
                    </Default>
                )}
            </>

        )
    }
}

export default connect(null, null)(FormContainer);
