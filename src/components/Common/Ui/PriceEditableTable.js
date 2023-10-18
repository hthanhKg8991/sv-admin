import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import InputTable from "components/Common/InputValue/InputTable";
import classnames from 'classnames';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import _ from "lodash";
import LoadingTable from "components/Common/Ui/LoadingTable";
import {subscribe} from "utils/event";

class PriceEditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            input_list: {},
            columns: props.columns
        };
        this.onDBClick = this._onDBClick.bind(this);
        this.onSaveItem = this._onSaveItem.bind(this);
        this.addRow = this._addRow.bind(this);
        this.deleteRow = this._deleteRow.bind(this)
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }
    _onDBClick(id, key) {
        const {canAction} = this.props
        if(canAction) {
            let input_list = Object.assign({}, this.state.input_list);
            input_list[id + key] = true;
            this.setState({input_list: input_list});
        }
    }

    async _onSaveItem(item, input_list){
        const {updateApi,uiAction} = this.props;
        uiAction.showLoading();
        const {columns} = this.state;
        
        const args = {
            id: item.id
        }

        columns.map((column) => {
            const keyToFind = item.id + column.accessor + '_value'
            if(Object.prototype.hasOwnProperty.call(input_list, keyToFind)) {
                args[column.accessor] = input_list[keyToFind];
            }
        });
        uiAction.showLoading();
        const res = await updateApi(args);
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            const input_list_clone = Object.assign({}, this.state.input_list);
            columns.map((column) => {
                input_list_clone[args.id + column.accessor] = false;
                input_list_clone[args.id + column.accessor + '_error'] = false;
            });
            
            this.setState({input_list: input_list_clone});
            this.asyncData()
        }
        uiAction.hideLoading();
    }

    async asyncData(params = {}) {
        const {defaultQuery, fetchApi, query, onFetchSuccess, itemsPerPage} = this.props;
        const perPage = _.get(params, 'perPage', this.state.perPage || itemsPerPage);
        const filter = _.get(params, 'filter', this.state.filter);
        const page = _.get(params, 'page', query?.page || 1);  // Ưu tiên page từ query nếu không truyền tham số
        const paramFull = {
            ...defaultQuery,
            filter: filter,
            per_page: perPage,
            page: page,
        };

        delete paramFull['action'];
        delete paramFull['id'];

        const data = await fetchApi(paramFull);
        
        if (data) {
            const dataRes = Array.isArray(data) ? data : _.get(data, ['items'], [])

            this.setState({
                loading: false,
                data_list: dataRes,
                perPage: perPage,
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

    componentDidMount(){
        const {query, fetchApi, data} = this.props;

        if (fetchApi) {
            this.asyncData({filter: query});
        } else {
            this.setState({
                loading: false,
                data_list: data
            });
        }
    }

    _renderTableHeader() {
        const {columns} = this.state;
        const {isDeletable, canAction = true} = this.props;

        return ((isDeletable && canAction) ? [...columns,{title:"Thao tác",width:20}] : columns).map(column => (
            <TableHeader key={column.title} tableType="TableHeader" width={column.width}>
                {column.title}
            </TableHeader>
        ));
    }

    _renderRow(item, key) {
        const {columns, indexExpandRow} = this.state;
        const {expandRow, direction = "center", isOpenExpand, isDeletable, canAction = true} = this.props;
        
        return (
            <React.Fragment key={key}>
                <tr className={classnames("el-table-row",
                    (key % 2 !== 0 ? "tr-background" : null),
                    {pointer: !!expandRow},
                    {active: key === indexExpandRow},
                    {"row-bg-green": isOpenExpand}
                )}>
                    {
                        columns.map((column, i) => {
                            const {input_list} = this.state
                            const index = `${i}${item?.id}`
                            const id = _.get(item, ["id"], null)

                            const valueGetted = _.get(item, [column.accessor], null)
                            const valueInput = input_list[id + `${column.accessor}_value`] ? input_list[id + `${column.accessor}_value`] : valueGetted;

                            return (
                                <td key={index} 
                                    className='td-input' 
                                    onDoubleClick={()=>{this.onDBClick(id, column.accessor)}}
                                >
                                    <div className={`cell text-${direction}`} title={valueGetted}>
                                        {!input_list[id + column.accessor] ? (
                                            <span>{valueGetted}</span>
                                        ) : (
                                            <InputTable 
                                                className="w100 input-number" isNumber 
                                                suffix={` ${column.prefix}`}
                                                error={input_list[id + `${column.accessor}_error`]}
                                                value={valueInput ? valueInput : '0'}
                                                onChange={(value) => {
                                                    input_list[id + `${column.accessor}_value`] = value;
                                                    item[column.accessor] = value;
                                                    this.setState({input_list: input_list});
                                                }}
                                                onEnter={() => {
                                                    this.onSaveItem(item, input_list);
                                                }}
                                            />
                                        )}
                                    </div>
                                </td>
                            );
                        })
                    }
                    {(isDeletable && canAction) ? <td className='td-input' >
                        <div className="text-underline pointer text-center ">
                            <span style={{fontSize:"12px"}} className="text-danger" onClick={()=>this.deleteRow(item)}>Xóa</span>
                        </div>
                    </td> : null}
                </tr>
            </React.Fragment>
        );
    }

    _renderTableBody() {
        const {data_list} = this.state;

        return (
            <TableBody tableType="TableBody">
                {data_list.map((item, key) => (this._renderRow(item, key)))}
            </TableBody>
        );
    }

    async _addRow() {
        const {uiAction,customIdParam, id, createApi} = this.props;

        const args = {}

        if(customIdParam){
            args[customIdParam] = id;
        }else{
            args.id = id;
        }

        const res = await createApi(args);

        if(res){
            uiAction.putToastSuccess("Thao tác thành công!");
            this.asyncData()
        }
    }

    async _deleteRow(item) {
        const {uiAction, deleteApi} = this.props;

        const args = {id: item?.id}

        const res = await deleteApi(args);

        if(res){
            uiAction.putToastSuccess("Thao tác thành công!");
            this.asyncData()
        }
    }

    _renderTable() {
        const {columns, data_list} = this.state;
        
        return (
            <React.Fragment>
                <TableComponent allowDragScroll={false}>
                    {this._renderTableHeader()}
                    {!_.isEmpty(data_list)
                        ? this._renderTableBody()
                        : (
                            <TableBody tableType="TableBody">
                                <tr>
                                    <td colSpan={columns.length} className="text-center">Không có dữ
                                        liệu
                                    </td>
                                </tr>
                            </TableBody>
                        )
                    }
                </TableComponent>
            </React.Fragment>
        )
    }

    render () {

        const {canAction = true} = this.props

        return (
            <div className="mt5 mb5">
                {this.state.loading ? <LoadingTable />
                : <div className="body-table el-table">
                    <TableComponent allowDragScroll={false}>
                        {this._renderTableHeader()}
                        {this._renderTableBody()}
                    </TableComponent>
                    {canAction && <button 
                        style={{float:"right"}}
                        type="button" 
                        className="el-button el-button-primary mt10 el-button-small"
                        onClick={this.addRow}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                    </button>}
                </div>}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PriceEditableTable);
