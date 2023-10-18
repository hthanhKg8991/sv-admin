import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "pages/HeadhuntPage/CampaignPage/Edit";
import DetailCampaign from "pages/HeadhuntPage/CampaignPage/Edit/Detail";
import {getDetailHeadhuntCampaign} from "api/headhunt";
import CampaignDetailList from "pages/HeadhuntPage/CampaignPage/Detail";

class FormContainer extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(this.props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        const id = _.get(queryParsed, 'id');
        this.state = {
            item: null,
            loading: true,
            id
        }
        this.asyncData = this._asyncData.bind(this);
        this.setID = this._setID.bind(this);
    }

    async _asyncData() {
        const {id} = this.state;
        if (id > 0) {
            const res = await getDetailHeadhuntCampaign({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        }
    }

    async _setID(id) {
        this.setState({id, loading: true});
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
        const {id, item, loading} = this.state;
        const idKey = "CampaignEdit";
        return loading ? null : (
            <>
                <Default
                    title={`${id > 0 ? "Chỉnh Sửa" : "Thêm"} Campaign`}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                    <div className="row">
                        <div className="col-md-12">
                            <Edit setID={this.setID} asyncData={this.asyncData} item={item} idKey={idKey} id={id}
                                  history={history}/>
                        </div>
                    </div>
                </Default>
                {item && (
                    <>
                        <DetailCampaign detail={item}/>
                        <CampaignDetailList history={history} id={item.id}/>
                    </>
                )}
            </>
        )
    }
}

export default connect(null, null)(FormContainer);
