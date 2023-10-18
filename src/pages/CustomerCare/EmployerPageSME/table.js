import {Link} from 'react-router-dom';
import * as Constant from 'utils/Constant';
import queryString from 'query-string';
import SpanCommon from 'components/Common/Ui/SpanCommon';
import React from 'react';
import * as utils from "utils/utils";

export function renderColumns(props) {
    const paramsQuery = {...props.query, ...{action: 'detail'}};

    return [
        {
            title: "Nhà tuyển dụng",
            width: 140,
            onClick: () => {},
            cell: row => (
                <Link
                    to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({...paramsQuery, ...{id: row.id}})}`}>
                    <span>{row.id} - {row.name}</span>
                </Link>
            )
        },
        {
            title: "Loại tài khoản",
            width: 130,
            cell: row => (
                <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                            value={row.premium_status}/>
            )
        },
        {
            title: "Nhãn",
            width: 130,
            cell: row => (
                <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                            value={row?.company_kind || row.company_size}/>
            )
        },
        {
            title: "Tổng tiền",
            width: 130,
            cell: row => {
                return <>{utils.formatNumber(row?.total_revenue, 0, ".", "đ")}</>;
            }
        },
        {
            title: "CSKH",
            width: 130,
            accessor: "assigned_staff_username"
        }
    ]
}
