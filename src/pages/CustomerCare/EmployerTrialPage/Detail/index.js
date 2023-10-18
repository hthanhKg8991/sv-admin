import React from "react";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/CustomerCare/EmployerTrialPage/Detail/Info";
import {subscribe} from "utils/event";
import {getDetailInformationCollect} from "api/employer";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            data: null,
            loading: true
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    async asyncData() {
        const {id} = this.state;
        const data = await getDetailInformationCollect(id);
        if (data) {
            this.setState({
                data: data,
                loading: false
            });
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {history, idKey} = this.props;
        const {loading, data} = this.state;

        const items = [
            {
                title: "Thông tin chung",
                component: <Info data={data} history={history} idKey={idKey}/>
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
