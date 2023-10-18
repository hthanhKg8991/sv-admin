import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import { seekerDetailHideContact, seekerRevisionDetailHideContact } from "api/seeker";
import DetailHideContact from "pages/SeekerCare/SeekerPage/DetailHideContact/Detail";

class DetailContainer extends Component {
  constructor(props) {
    super(props);

    const searchParam = _.get(props, ['location', 'search']);
    const queryParsed = queryString.parse(searchParam);

    this.state = {
      id: _.get(queryParsed, 'id')
    };
  }

  async asyncData() {
    const { id } = this.state;

    this.setState({
      loading: true
    });

    const seeker = await seekerDetailHideContact({ id: id });
    const revision = await seekerRevisionDetailHideContact(id);

    this.setState({
      loading: false
    })
    if (seeker) {
      this.setState({
        seeker: seeker
      });
    }
    if (revision) {
      this.setState({
        revision: revision
      });
    }
  }

  componentDidMount() {
    this.asyncData();

  }

  render() {
    const { history } = this.props;
    const { seeker, revision, loading } = this.state;

    return (
      <Default
        title={'Chi Tiết Người Tìm Việc'}
        titleActions={(
          <button type="button" className="bt-refresh el-button" onClick={() => {
            this.asyncData()
          }}>
            <i className="fa fa-refresh" />
          </button>
        )}>{
          loading ? <LoadingSmall style={{ textAlign: "center" }} /> :
            seeker && <DetailHideContact revision={revision} seeker={seeker} history={history}></DetailHideContact>

        }
      </Default>
    )
  }
}

export default connect(null, null)(DetailContainer);
