import React from "react";
import { getDetail, getRevision } from "api/job";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/CustomerCare/JobPage/Detail/Info";
import ServiceActivated from "pages/CustomerCare/JobPage/Detail/ServiceActivated";
import ResumeAppliedHistory from "pages/CustomerCare/JobPage/Detail/ResumeAppliedHistory";
import {subscribe} from "utils/event";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            job: null,
            revision: null,
            loading: true
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    async asyncData(){
        const {id} = this.state;
        const data = await getDetail(id);
        const revision = await getRevision(id);
        if(data){
            this.setState({
                job: data,
                revision:revision,
                loading: false
            });
        }
    }

    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {history, idKey} = this.props;
        const {loading, job, revision} = this.state;

        const items = [
            {
                title: "Thông tin chung",
                component: <Info job={job} history={history} revision={revision} idKey={idKey}/>
            },
            {
                title: "Lịch sử kích hoạt dịch vụ",
                component: <ServiceActivated job={job} history={history}/>
            },
            {
                title: "Hồ sơ đã ứng tuyển",
                component: <ResumeAppliedHistory job={job} history={history}/>
            }
        ];

        return (
            <React.Fragment>
                {loading
                    ? <LoadingSmall style={{textAlign: "center"}}/>
                    : <Tab items={items}/>
                }
            </React.Fragment>
        );
    }
}

export default Detail;
