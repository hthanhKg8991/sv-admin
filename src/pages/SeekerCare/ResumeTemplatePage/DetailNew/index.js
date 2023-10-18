import React from "react";
import {resumeTemplateDetail} from "api/seeker";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/SeekerCare/ResumeTemplatePage/DetailNew/Info";
import {subscribe} from "utils/event";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            resume: null,
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

        const data = await resumeTemplateDetail(id);
        if(data){
            this.setState({
                resume: data,
                loading: false
            });
        }
    }

    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {history} = this.props;
        const {loading, resume} = this.state;
        const items = [
            {
                title: "Thông tin chung",
                component: <Info resume={resume} history={history}/>
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
