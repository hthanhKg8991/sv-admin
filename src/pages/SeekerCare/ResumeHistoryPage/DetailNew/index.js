import React from "react";
import {seekerDetail} from "api/seeker";
import {getResumeDetailV2} from "api/resume";
import {getResumeRevision} from "api/resume";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/SeekerCare/ResumeHistoryPage/DetailNew/Info";
import {subscribe} from "utils/event";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            seeker: null,
            revision: null,
            resume: null,
            resumeHistory: null,
            loading: true,
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
        const dataResume = await getResumeDetailV2({id: id, list: true, includes: "job_info,employer_info,resume_info,seeker_info,job_applied"});
        const dataRevision = await getResumeRevision(dataResume?.id);
        const dataSeeker = await seekerDetail(dataResume?.seeker_id);
        const _resume = dataResume;
        this.setState({
            seeker: dataSeeker,
            resume: _resume,
            resumeHistory: dataResume,
            revision: dataRevision,
            loading: false
        });
    }

    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {history, idKey} = this.props;
        const {loading, seeker, resume, revision, resumeHistory} = this.state;
        const items = [
            {
                title: "Thông tin chung",
                component: <Info revision={revision} resumeHistory={resumeHistory} resume={resume} seeker={seeker} history={history} idKey={idKey}/>
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
