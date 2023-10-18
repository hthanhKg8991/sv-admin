import React from "react";
import {getDetailConfig} from "api/system";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/System/ConfigPage/Detail/Info";
import {subscribe} from "utils/event";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
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
        const item = await getDetailConfig({id});
        this.setState({
            item: item,
            loading: false
        });
    }

    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {history} = this.props;
        const {loading, item} = this.state;
        const items = [
            {
                title: "Thông tin chung",
                component: <Info item={item} history={history}/>
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
