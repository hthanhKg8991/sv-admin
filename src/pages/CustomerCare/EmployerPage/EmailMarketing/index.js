import React from "react";
import {getDetail, getEmployerMarketingList} from "api/employer";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/CustomerCare/EmployerPage/EmailMarketing/Info";
import {subscribe} from "utils/event";

class EmailMarketing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            employerId: props.employerId,
            loading: true,
            employerDetail: null,
            data: []
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    async asyncData() {
        const {employerId} = this.state;
        const data = await getEmployerMarketingList({employer_id: employerId});
        const employerDetail = await getDetail(employerId);
        if (data) {
            this.setState({
                data: data,
                employerDetail: employerDetail,
                loading: false
            });
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {history, idKey} = this.props;
        const {loading, data, employerDetail} = this.state;

        const items = [
            {
                title: "Thông tin chung",
                component: <Info items={data} history={history} employerDetail={employerDetail} idKey={idKey}/>
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

export default EmailMarketing;
