import React from "react";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import SpanSystem from "components/Common/Ui/SpanSystem";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.formatData = this._formatData.bind(this);
    }

    _formatData(key, value) {
        switch (key) {
            case 'status':
                return <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_status}
                                   value={value}
                                   notStyle/>
            case 'type_code':
                return <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_type_code}
                                   value={value}
                                   notStyle/>
            case 'type':
                return <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_type}
                                   value={value}
                                   notStyle/>
            case 'fraud_status':
                return  <SpanCommon idKey={Constant.COMMON_DATA_KEY_fraud_status}
                                    value={value}
                                    notStyle/>
            case 'company_kind':
                return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                   value={value}
                                   notStyle/>
            case 'province_id':
                {
                    if(Number(value) === 0){
                        return null;
                    }
                   return <SpanSystem value={value} type={"province"} notStyle/>
                }
            case 'fields_activity':
                return <>
                    {
                        Array.isArray(value)
                            ?
                            value?.map((v, i) => (
                                <span key={i} className="mr5">
                                       {this.props.vsics.find(_=> _.id === v)?.name}
                                </span>
                            ))
                            : null
                    }
                </>
            default :
                return value
        }
    }

    render() {
        const {object} = this.props;
        return (
            <TableComponent DragScroll={false}>
                <TableHeader tableType="TableHeader">
                    Trường thay đổi
                </TableHeader>
                <TableHeader tableType="TableHeader">
                    Thông tin cũ
                </TableHeader>
                <TableHeader tableType="TableHeader">
                    Thông tin mới
                </TableHeader>
                <TableBody tableType="TableBody">
                    {object?.compare?.map((item, idx) => (
                        <tr key={idx}>
                            <td className="px-1">
                                {item.name}
                            </td>
                            <td className="px-1">
                                {this.formatData(item.key, item.value.old)}
                            </td>
                            <td className="px-1">
                                {this.formatData(item.key, item.value.new)}
                            </td>
                        </tr>
                    ))}

                </TableBody>
            </TableComponent>
        );
    }
}

export default Detail;
