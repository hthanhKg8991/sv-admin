import React from "react";
import { getTeamList } from 'api/auth';


class EmployerTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        };
    }

    async asyncData() {
        const { id } = this.props;
        
        if (id) {
            const res = await getTeamList();
            if(res){
                const item = res?.find(item => item?.id === id)
                this.setState({
                    name: item?.name,
                })
            }
        }
    }

    componentDidMount() {
        this.asyncData();
    }


    render() {
        const { name } = this.state;
        return (
            <span>{name || "Chưa cập nhật"}</span>
        )
    }
}

export default EmployerTeam;
