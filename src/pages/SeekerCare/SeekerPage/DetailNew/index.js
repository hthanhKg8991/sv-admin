import React from "react";
import {seekerDetailv2} from "api/seeker";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/SeekerCare/SeekerPage/DetailNew/Info";
import HistoryReport from "pages/SeekerCare/SeekerPage/DetailNew/HistoryReport";
import {subscribe} from "utils/event";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            seeker: null,
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

        const data = await seekerDetailv2({id: id, includes: "staff_view_resume_info"});
        if(data){
            this.setState({
                seeker: data,
                loading: false
            });
        }
    }

    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {history, idKey} = this.props;
        const {loading, seeker} = this.state;
        const items = [
            {
                title: "Thông tin chung",
                component: <Info idKey={idKey} seeker={seeker} history={history}/>
            },
            {
                title: "Lịch sử báo xấu",
                component: <HistoryReport idKey={idKey} seeker={seeker} history={history}/>
            },
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
