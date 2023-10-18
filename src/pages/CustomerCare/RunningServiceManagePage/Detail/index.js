import React from "react";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import ListJobPremium from "./ListJobPremium";
import ListEmployerPremium from "./ListEmployerPremium";
import {subscribe} from "utils/event";
import _ from "lodash";
import queryString from "query-string";

class Index extends React.Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        this.state = {
            loading: false,
            tabActive: _.get(queryParsed, 'tabActive'),
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    async asyncData(){
        this.setState({
            loading: false
        });
    }

    render() {
        const {history} = this.props;
        const {loading,tabActive} = this.state;
        const items = [
            {
                title: "DANH SÁCH TIN TUYỂN DỤNG TRẢ PHÍ",
                component: <ListJobPremium history={history} tabActive={tabActive} />
            },
            {
                title: "DANH SÁCH NHÀ TUYỂN DỤNG TRẢ PHÍ",
                component: <ListEmployerPremium history={history} tabActive={tabActive}/>
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

export default Index;
