import React, {Component} from "react";
import Board from 'react-trello'
import {connect} from "react-redux";
import LoadingTable from "components/Common/Ui/LoadingTable";
import _ from "lodash";
import {compare} from "utils/utils";
import PopupGroupForm from "./PopupDetail";
import {bindActionCreators} from "redux";
import {createPopup, putToastError, putToastSuccess} from "actions/uiAction";
import {subscribe} from "utils/event";
import CardCustom from "./Card";
import PopupChangeStatusRecruitmentPipeline
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupChangeStatusRecruitmentPipeline";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import PopupRecruitmentPipelineForm
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupRecruitmentPipelineForm";
import PopupHistory from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupHistory";
import PopupSendMailSeeker from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupSendMailSeeker";
import PopupSendMailCustomer from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupSendMailCustomer";
import PopupHistoryInterview from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupInterviewHistory";
import CustomLaneHeader from "pages/HeadhuntPage/RecruitmentPipelinePage/Kanban/Header";
import Pagination2 from "components/Common/Ui/Table/Pagination2";


class Index extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: {
                lanes: props.lanes
            },
            perPage: props.perPage || 100,
            filter: null,
        }
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
        this.subscribers.push(subscribe('.refreshComponent', (msg) => {
            this.setState({reload: true}, () => {
                this.setState({reload: false})
            });
        }, props.idKey + 'reload'));
        this.onChangeLand = this._onChangeLand.bind(this);
        this.onClickDetail = this._onClickDetail.bind(this);
        this.onChangeStatus = this._onChangeStatus.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onClickHistory = this._onClickHistory.bind(this);
        this.onClickSendMailSeeker = this._onClickSendMailSeeker.bind(this);
        this.onClickSendMailCustomer = this._onClickSendMailCustomer.bind(this);
        this.onAddHistoryInterview = this._onAddHistoryInterview.bind(this);
        this.onChangePerPage = this._onChangePerPage.bind(this);
        this.onChangePage = this._onChangePage.bind(this);
    }

    async _onChangeLand(fromLaneId, toLaneId, value) {
        if (fromLaneId === toLaneId) {
            return;
        }
        const {actions, idKey, lanes} = this.props;
        const object = {id: value};
        actions.createPopup(PopupChangeStatusRecruitmentPipeline, 'Chuyển trạng thái', {
            status: toLaneId,
            idKey,
            object,
            lanes
        });
        // publish(".refresh", {}, idKey);
    }

    _onChangeStatus(object) {
        const {actions,idKey,lanes} = this.props;
        actions.createPopup(PopupChangeStatusRecruitmentPipeline, 'Chuyển trạng thái', {idKey, object, lanes});
    }

    _onEdit(object) {
        const {actions,idKey} = this.props;
        actions.createPopup(PopupRecruitmentPipelineForm, 'Chỉnh sửa ứng viên', {idKey, object});
    }


    // async _onDelete(cardId, laneId) {
    //     const {actions, idKey} = this.props;
    //     const res = await deleteHeadhuntApplicant({id: cardId});
    //     if (res) {
    //         actions.putToastSuccess('Xóa thành công!');
    //     }
    //     // publish(".refresh", {}, idKey);
    //
    // }

    _onClickDetail(id, object) {
        const {actions, idKey} = this.props;
        actions.createPopup(PopupGroupForm, 'Chi tiết ứng viên', {id, idKey, object});
    }

    _onClickHistory(object) {
        const {actions, idKey} = this.props;
        actions.createPopup(PopupHistory, 'Lịch sử thay đổi', {idKey, object});
    }

    _onClickSendMailSeeker(object) {
        const {actions, idKey} = this.props;
        actions.createPopup(PopupSendMailSeeker, 'Gửi email ứng viên', {idKey, object});
    }
    _onClickSendMailCustomer(object) {
        const {actions, idKey} = this.props;
        actions.createPopup(PopupSendMailCustomer, 'Gửi CV cho Khách hàng', {idKey, object});
    }

    _onAddHistoryInterview(object) {
        const {actions,idKey} = this.props;
        actions.createPopup(PopupHistoryInterview, 'Thêm action', {idKey, applicant_info_id: object.applicant_info_id, applicant_id: object.id});
    }

    async asyncData(params = {}) {
        if (this._isMounted) {
            const {defaultQuery, fetchApi, query, onFetchSuccess } = this.props;
            const perPage = _.get(params, 'perPage', this.state.perPage);
            const filter = _.get(params, 'filter', this.state.filter);
            const page = _.get(params, 'page', query?.page || 1);  // Ưu tiên page từ query nếu không truyền tham số
            const paramFull = {
                ...defaultQuery,
                ...filter,
                per_page: perPage,
                page: page,
            };
            delete paramFull['action'];
            delete paramFull['id'];
            const data = await fetchApi(paramFull);
            if (data) {
                const sourceCommon = utils.convertArrayValueCommonDataFull(this.props.common.items, Constant.COMMON_DATA_KEY_headhunt_applicant_source);
                // Map data theo status
                const dataFetch = _.get(data, ['items'], []).map(m => {
                    const source = sourceCommon.find(s => s.value === m.data_source);
                    const tag = [{
                        bgcolor: source?.background_color,
                        color: source?.text_color,
                        title: `Nguồn ${source?.name}`,
                    }]
                    return {
                        ...m,
                        metadata: m,
                        title: `${m.id} - ${m.applicant_info_info?.name}`,
                        description: `${m.seeker_id} - ${m.seeker_name}`,
                        id: String(m.id),
                        laneId: String(m.status),
                        tags: source ? tag : null
                    }
                });
                // Lấy config status ra rồi map vào.
                const dataGroup = this.props.lanes.map(x => {
                    const itemGroup = dataFetch.filter(i => i.status === x.id)
                    return {
                        ...x,
                        label: String(itemGroup?.length),
                        cards: itemGroup,
                    }
                });
                this.setState({
                    loading: false,
                    perPage: perPage,
                    filter: filter,
                    data: {lanes: dataGroup},
                    pagination: {
                        pageCurrent: parseInt(_.get(data, ['current'], 0)),
                        totalPage: _.get(data, ['total_pages'], 0),
                        totalItem: _.get(data, ['total_items'], 0)
                    }
                });

                //Gọi lại khi fetch thành công
                if (onFetchSuccess) {
                    onFetchSuccess(data);
                }
            }
        }
    }

    _onChangePerPage(perPage) {
        this.setState({loading: true}, () => {
            this.asyncData({perPage: perPage,page:1});
        });
    }

    _onChangePage(page) {
        this.setState({loading: true}, () => {
            this.asyncData({page: page});
        });
    }
    componentDidMount() {
        this._isMounted = true;
        const {query, fetchApi} = this.props;
        if (fetchApi) {
            this.asyncData({filter: query});
        }
    }

    componentWillReceiveProps(newProps) {
        const {idKey} = this.props;
        const filterIdKey = 'Filter' + idKey;
        if (_.has(newProps, filterIdKey) && compare(this.props[filterIdKey],
            newProps[filterIdKey])) {
            let params = _.get(newProps, filterIdKey);
            this.setState({loading: true}, () => {
                this.asyncData({filter: params});
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const {data, loading, reload, pagination, perPage} = this.state;
        const CustomBoar = {
            Card: (props) => <CardCustom {...props}
                                         onEdit={this.onEdit}
                                         onClickSendMailSeeker={this.onClickSendMailSeeker}
                                         onClickSendMailCustomer={this.onClickSendMailCustomer}
                                         onAddHistoryInterview={this.onAddHistoryInterview}
                                         onClickHistory={this.onClickHistory}
                                         stateChecked={this.props.stateChecked}
                                         changeStatus={this.onChangeStatus} />,
            LaneHeader: (props) => <CustomLaneHeader {...this.props} {...props} />
        };
        if (reload) {
            return <div/>
        }
        return (
            <div>
                {loading && <LoadingTable/>}
                <Board
                    components={CustomBoar}
                    onCardDelete={this.onDelete}
                    onCardClick={this.onClickDetail}
                    onCardMoveAcrossLanes={this.onChangeLand}
                    style={{backgroundColor: 'white', height: "71vh"}}
                    data={data}/>
                <Pagination2 {...pagination} perPage={perPage}
                             onChange={this.onChangePage}
                             onChangePerPage={this.onChangePerPage}/>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const {idKey} = ownProps;

    return {
        ['Filter' + idKey]: state.filter[idKey],
        common: state.sys.common,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createPopup,
            putToastSuccess, putToastError,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
