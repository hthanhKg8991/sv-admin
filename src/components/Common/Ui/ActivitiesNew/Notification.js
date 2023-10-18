import React from 'react'
import moment from 'moment-timezone';
import {translateMomentFromNow} from "utils/utils";
// import 'moment/locale/vi'  // without this line it didn't wok
moment.tz.setDefault("Asia/Ho_Chi_Minh");
export default class Notification extends React.Component {
    render() {
        const {dataNotify, onView, onDelete} = this.props;
        if (dataNotify.length > 0) {
            return dataNotify.map((value, idx) => {
                if (value.link) {
                    return (

                            <div key={idx}
                                className={`d-flex align-items-center item-notification ${value.status === 1 ? "bg-notification" : ""}`}>
                                <div className="width80 text-center ">
                                    <i className="fa fa-eye" aria-hidden="true" onClick={()=>{if(value.status === 1) {onView(value.id)}} } />
                                </div>
                                <div className="w100">
                                    <a href={value.link} target="_blank" rel="noopener noreferrer">
                                        <div>
                                            {value.title}
                                        </div>
                                        <div>
                                            {value.content}
                                        </div>
                                        <div>
                                            {translateMomentFromNow(moment.unix(value.created_at).startOf('minute').fromNow())}
                                        </div>
                                    </a>
                                </div>
                                <div className="width40">
                                    <i className="fa fa-trash-o" aria-hidden="true" onClick={()=> onDelete(value.id)}/>
                                </div>
                            </div>
                    );
                } else {
                    return (
                        <React.Fragment key={idx}>
                            <div className={`d-flex align-items-center item-notification ${value.status === 1 ? "bg-notification" : ""}`}>
                                <div className="width80 text-center">
                                    <i className="fa fa-eye" aria-hidden="true" onClick={()=>{if(value.status === 1) {onView(value.id)}} } />
                                </div>
                                <div className="w100">
                                    <div>
                                        {value.title}
                                    </div>
                                    <div>
                                        {value.content}
                                    </div>
                                    <div>
                                        {translateMomentFromNow(moment.unix(value.created_at).startOf('minute').fromNow())}
                                    </div>
                                </div>
                                <div className="width40">
                                    <i className="fa fa-trash-o" aria-hidden="true" onClick={()=> onDelete(value.id)}/>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }
            })
        } else {
            return null;
        }
    }
}
