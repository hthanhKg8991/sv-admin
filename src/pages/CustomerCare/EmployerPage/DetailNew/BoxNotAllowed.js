import React from "react";
import { getEmployerNotAllowedContactKeyword } from 'api/employer';

class BoxNotAllowed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: []
        };
    }

    async asyncData() {
        const { employer } = this.props;
        const { id } = employer;
        if (id) {
            const keywords = await getEmployerNotAllowedContactKeyword({employer_id: id});
            if(keywords) {
                this.setState({keywords: keywords});
            }
        }


    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const { keywords } = this.state;
        return (
            keywords?.length > 0 ?
                <div className="col-sm-12 col-xs-12 mt20">
                    <div className="alert alert-danger" role="alert">
                        NTD này thuộc danh sách cấm liên lạc với thông tin
                        <b> [{keywords}]</b>.
                        Nhân viên chăm sóc lưu ý trước khi liên hệ khách hàng.
                    </div>
                </div>
                :
                null
        )
    }
}

export default BoxNotAllowed;
