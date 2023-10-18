import {fnGetV2, fnPostV2, fnPostV3} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnPostForm} from "api/index";

export const getListKPIConfig = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_KPI_CONFIG_LIST, params);
};

export const getDetailKPIConfig = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_KPI_CONFIG_DETAIL, params);
};

export const createKPIConfig = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_KPI_CONFIG_CREATE, params);
};

export const updateKPIConfig = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_KPI_CONFIG_UPDATE, params);
};

export const deleteKPIConfig = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_KPI_CONFIG_DELETE, params);
};

export const getListKpiStaff = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_KPI_STAFF_LIST, params);
};

export const exportKpiStaff = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_KPI_STAFF_EXPORT, params);
};

export const updateKpiStaff = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_KPI_STAFF_UPDATE, params);
};

export const getListCommission = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_COMMISSION_LIST, params);
};

export const getListCommissionReport = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_COMMISSION_REPORT_LIST, params);
};

export const getListBonus = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_BONUS_LIST, params);
};

export const getListKpiResult = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_KPI_RESULT_LIST, params);
};

export const getListConfigKpi = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_KPI_LIST, params);
};

export const getListConfigKpiItems = async (params = {}) => {
    const res = await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_KPI_LIST, params);
    return res?.items || [];
};

export const getDetailConfigKpi = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_KPI_DETAIL, params);
};

export const createConfigKpi = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_CREATE, params);
};

export const updateConfigKpi = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_UPDATE, params);
};

export const deleteConfigKpi = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_DELETE, params);
};

export const copyConfigKpi = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_COPY, params);
};

export const getListConfigGroup = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_GROUP_LIST, params);
};

export const getDetailConfigGroup = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_GROUP_DETAIL, params);
};

export const createConfigGroup = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_GROUP_CREATE, params);
};

export const updateConfigGroup = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_GROUP_UPDATE, params);
};

export const deleteConfigGroup = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_GROUP_DELETE, params);
};

export const getListConfigStaff = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_STAFF_LIST, params);
};

export const getDetailConfigStaff = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_STAFF_DETAIL, params);
};

export const createConfigStaff = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_STAFF_CREATE, params);
};

export const updateConfigStaff = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_STAFF_UPDATE, params);
};

export const deleteConfigStaff = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_STAFF_DELETE, params);
};

export const getListConfigKPIStaff = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_KPI_STAFF_LIST, params);
};

export const getDetailConfigKPIStaff = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_KPI_STAFF_DETAIL, params);
};

export const createConfigKPIStaff = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_STAFF_CREATE, params);
};

export const updateConfigKPIStaff = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_STAFF_UPDATE, params);
};

export const deleteConfigKPIStaff = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_STAFF_DELETE, params);
};

export const createConfigKPIStaffByConfig = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_STAFF_CREATE_BY_CONFIG, params);
};

export const getListConfigKPIType = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_CONFIG_KPI_TYPE_LIST, params);
};

export const createConfigKPIType = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_TYPE_CREATE, params);
};

export const updateConfigKPIType = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_TYPE_UPDATE, params);
};

export const deleteConfigKPIType = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_CONFIG_KPI_TYPE_DELETE, params);
};

export const getListCommissionFormula = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_COMMISSION_FORMULA_LIST, params);
};

export const getListCommissionBonus = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_COMMISSION_BONUS_LIST, params);
};

export const getListCommissionRate = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_COMMISSION_RATE_LIST, params);
};

export const createCommissionRate = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_COMMISSION_RATE_CREATE, params);
};

export const updateCommissionRate = async (params = {}) => {
    return await fnPostForm(config.apiCommissionDomain, ConstantURL.API_URL_POST_COMMISSION_RATE_UPDATE, params);
};

export const deleteCommissionRate = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_COMMISSION_RATE_DELETE, params);
};

export const getListDataNetSale = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_DATA_NET_SALE_LIST, params);
};

export const exportListDataNetSale = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_DATA_NET_SALE_EXPORT, params);
};

export const getListDataRevenue = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_DATA_REVENUE_LIST, params);
};

export const exportDataRevenue = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_DATA_REVENUE_EXPORT, params);
};

export const getListDataCash = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_DATA_CASH_LIST, params);
};

export const exportDataCash = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_DATA_CASH_EXPORT, params);
};

export const calculateCommissionKpiStaff = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_KPI_STAFF_CALCULATE_COMMISSION, params);
};

export const getListCommisionRateConfig = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_COMMISSION_RATE_CONFIG_LIST, params);
};

export const exportReportKpiCommission = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_REPORT_KPI_COMMISSION_EXPORT, params);
};

export const exportReportCommssion = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_REPORT_COMMISSION_EXPORT, params);
};

export const exportReportBonus = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_REPORT_BONUS_EXPORT, params);
};

export const importKpiStaff = async (params = {}) => {
    return await fnPostV3(config.apiCommissionDomain, ConstantURL.API_URL_IMPORT_KPI_STAFF, params);
};

export const deleteConfigStaffV2 = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_DELETE_CONFIG_STAFF_V2, params);
};

export const deleteConfigKPI = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_DELETE_CONFIG_KPI, params);
};
export const runKPICron = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_RUN_KPI_CRON, params);
}
export const importDataCashV2 = async (params = {}) => {
    return await fnPostV2(config.apiCommissionDomain, ConstantURL.API_URL_POST_IMPORT_DATA_CASH_V2, params);
};

export const getListOdooSalesCommission = async (params = {}) => {
    return await fnGetV2(config.apiCommissionDomain, ConstantURL.API_URL_GET_ODOO_SALES_COMMISSION_LIST, params);
};