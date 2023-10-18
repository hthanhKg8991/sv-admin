import React, {Component} from "react";
import AddResultContact from "pages/HeadhuntPage/CandidateBankPage/Popup/Resume/ResultContact/AddResult";
import {CanRender, SpanCommon} from "components/Common/Ui";
import ROLES from "utils/ConstantActionCode";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import {getListCandidateBankResultHeadhunt} from "api/headhunt";
import {subscribe} from "utils/event";
import LoadingSmall from "../../../../../../components/Common/Ui/LoadingSmall";
import moment from "moment";
import * as Constant from "utils/Constant";
import classnames from 'classnames';
const idKey = "ListResultContactCandidateBank";

class ResultContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            loading: true,
        }
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
        this.asyncData = this._asyncData.bind(this);
    }

    async _asyncData() {
        const {id} = this.props;
        const data_list = await getListCandidateBankResultHeadhunt({candidate_bank_id: id});
        if (data_list) {
            this.setState({data_list, loading: false});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {id} = this.props;
        const {data_list, loading} = this.state;
        return (
            <div>
                <CanRender actionCode={ROLES.headhunt_candidate_bank_add_result}>
                    <AddResultContact idKey={idKey} id={id}/>
                </CanRender>
                {loading ? <LoadingSmall className="text-center"/> : (
                    <div className="col-sm-12 mb30">
                        <div className="body-table el-table">
                            <TableComponent allowDragScroll={false}>
                                <TableHeader tableType="TableHeader" width={100}>
                                    Date
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Kết quả liên hệ
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Note
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={100}>
                                    Người note
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key) => {
                                        return (
                                            <tr key={key}
                                                className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                <td>
                                                    <div
                                                        className="cell">{moment.unix(item.created_at).format("DD-MM-YYYY")}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"><SpanCommon value={item.result}
                                                                                      idKey={Constant.COMMON_DATA_KEY_headhunt_candidate_bank_result}
                                                                                      notStyle/></div>
                                                </td>
                                                <td>
                                                    <div className="cell">{item.note}</div>
                                                </td>
                                                <td>
                                                    <div className="cell">{item.created_by}</div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default ResultContact;
