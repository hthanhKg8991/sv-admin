import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnGetV2, fnPostV2, fnPostForm, fnPostV3, fnPost, fnGet} from "api/index";

export const getListHeadhuntCampaign = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_LIST, params);
};
export const getListFullHeadhuntCampaign = async (params = {}) => {
    const res = await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_LIST, params);
    return res?.items || [];
};
export const getDetailHeadhuntCampaign = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_DETAIL, params);
};

export const createHeadhuntCampaign = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_CREATE, params);
};

export const updateHeadhuntCampaign = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_UPDATE, params);
};

export const deleteHeadhuntCampaign = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_DELETE, params);
};

export const toggleHeadhuntCampaign = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_TOGGLE, params);
};

// Campaign Detail
export const getListHeadhuntCampaignDetail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_DETAIL_LIST, params);
};

export const getDetailHeadhuntCampaignDetail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_DETAIL_DETAIL, params);
};

export const getDetailHeadhuntCampaignDetailFilter = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_DETAIL_DETAIL_FILTER, params);
};

export const createHeadhuntCampaignDetail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_DETAIL_CREATE, params);
};

export const updateHeadhuntCampaignDetail = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_DETAIL_UPDATE, params);
};

export const deleteHeadhuntCampaignDetail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_DETAIL_DELETE, params);
};

export const toggleHeadhuntCampaignDetail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_DETAIL_TOGGLE, params);
};

export const getListHeadhuntCustomer = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_LIST, params);
};
export const getListHeadhuntCustomerFull = async (params = {}) => {
    const res = await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_LIST, params);
    return res ? res.items : [];
};
export const getListFullHeadhuntCustomer = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_LIST_FULL, params);
};
export const getListHeadhuntCustomerHistoryInfo = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_HISTORY_INFO, params);
};

export const getListHeadhuntCustomerHistoryStaff = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_HISTORY_STAFF, params);
};

export const getListHeadhuntCustomerImportHistory = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_IMPORT_HISTORY_LIST, params);
};
export const importHeadhuntCustomerImportHistory = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_IMPORT_HISTORY_IMPORT, params);
};

export const getDetailHeadhuntCustomer = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_DETAIL, params);
};

export const createHeadhuntCustomer = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_CREATE, params);
};

export const updateHeadhuntCustomer = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_UPDATE, params);
};

export const deleteHeadhuntCustomer = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_DELETE, params);
};

export const detailByCodeHeadhuntCustomer = async (params = {}) => {
    return await fnGet(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_DETAIL_BY_CODE, params);
};

export const getListHeadhuntGroup = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_GROUP_LIST, params);
};

export const getListHeadhuntGroupItems = async (params = {}) => {
    const res = await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_GROUP_LIST, params);
    return res?.items || [];
};

export const getDetailHeadhuntGroup = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_GROUP_DETAIL, params);
};

export const createHeadhuntGroup = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_GROUP_CREATE, params);
};

export const updateHeadhuntGroup = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_GROUP_UPDATE, params);
};

export const deleteHeadhuntGroup = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_GROUP_DELETE, params);
};

export const toggleHeadhuntGroup = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_GROUP_TOGGLE, params);
};

export const getListHeadhuntGroupMember = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_GROUP_MEMBER_LIST, params);
};

export const getListHeadhuntGroupMemberAll = async (params = {}) => {
    params.per_page = 999;
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_GROUP_MEMBER_LIST, params);
};

export const getDetailHeadhuntGroupMember = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_GROUP_MEMBER_DETAIL, params);
};

export const createHeadhuntGroupMember = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_GROUP_MEMBER_CREATE, params);
};

export const updateHeadhuntGroupMember = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_GROUP_MEMBER_UPDATE, params);
};

export const deleteHeadhuntGroupMember = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_GROUP_MEMBER_DELETE, params);
};

export const getListHeadhuntApplicant = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_LIST, params);
};
export const getListFullHeadhuntApplicant = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_LIST_FULL, params);
};

export const createHeadhuntApplicant = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_CREATE, params);
};
export const failHeadhuntApplicant = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_FAIL, params);
};

export const createHeadhuntApplicantByEmployer = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_CREATE_BY_EMPLOYER, params);
};
export const createHeadhuntApplicantByListCandidate = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_CREATE_BY_LIST_CANDIDATE, params);
};
export const updateHeadhuntApplicant = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_UPDATE, params);
};

export const updateStatusHeadhuntApplicant = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_UPDATE_STATUS, params);
};

export const deleteHeadhuntApplicant = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_DELETE, params);
};
export const evaluateHeadhuntApplicant = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_EVALUATE, params);
};

export const getListHeadhuntApplicantLog = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_LOG_LIST, params);
};

export const getListJobHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_JOB_LIST, params);
};
export const getListHeadhuntCustomerContact = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_CONTACT_LIST, params);
};

export const getListHeadhuntCustomerContactHistory = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_CONTACT_HISTORY, params);
};

export const getDetailHeadhuntCustomerContact = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CUSTOMER_CONTACT_DETAIL, params);
};

export const createHeadhuntCustomerContact = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_CONTACT_CREATE, params);
};

export const updateHeadhuntCustomerContact = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_CONTACT_UPDATE, params);
};

export const deleteHeadhuntCustomerContact = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_CONTACT_DELETE, params);
};

export const toggleHeadhuntCustomerContact = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_CONTACT_TOGGLE, params);
};

export const getListHeadhuntCampaignGroupMember = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_GROUP_MEMBER_LIST, params);
};

export const getListFullHeadhuntCampaignGroupMember = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_GROUP_MEMBER_LIST_FULL, params);
};

export const getDetailHeadhuntCampaignGroupMember = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_GROUP_MEMBER_DETAIL, params);
};

export const createMultipleHeadhuntCampaignGroupMember = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_GROUP_MEMBER_CREATE_MULTIPLE, params);
};

export const getListHeadhuntEmployer = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_EMPLOYER_LIST, params);
};
export const getListFullHeadhuntEmployer = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_EMPLOYER_LIST_FULL, params);
};

export const createHeadhuntEmployer = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_EMPLOYER_CREATE, params);
};

export const deleteHeadhuntEmployer = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_EMPLOYER_DELETE, params);
};

export const viewResumeHeadhuntEmployer = async (params = {}) => {
    return await fnPost(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_EMPLOYER_VIEW_RESUME, params);
};

export const checkPointHeadhuntEmployer = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_EMPLOYER_CHECK_POINT, params);
};

export const assignHeadhuntCustomerStaff = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_STAFF_ASSIGN, params);
};

export const listFullHeadhuntCustomerStaff = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CUSTOMER_STAFF_LIST_FULL, params);
};

export const getListHeadhuntSalesOrder = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SALES_ORDER_LIST, params);
};
export const getListHeadhuntSalesOrderMyFetch = async (params = {}) => {
    const res = await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SALES_ORDER_LIST, params);
    return res ? res.items : [];
};

export const getDetailHeadhuntSalesOrder = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SALES_ORDER_DETAIL, params);
};

export const createSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_CREATE, params);
};
export const updateSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_UPDATE, params);
};
export const submitSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_SUBMIT, params);
};
export const confirmSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_CONFIRM, params);
};
export const rejectSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_REJECT, params);
};
export const approveSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_APPROVE, params);
};
export const deleteSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_DELETE, params);
};
export const duplicateSalesOrderHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_DUPLICATE, params);
};
export const printHeadhuntSalesOrder = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SALES_ORDER_PRINT, params);
};

export const getListHeadhuntSalesOrderItem = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SALES_ORDER_ITEM_LIST, params);
};

export const getListFullHeadhuntSalesOrderItem = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SALES_ORDER_ITEM_LIST_FULL, params);
};

export const getDetailHeadhuntSalesOrderItem = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SALES_ORDER_ITEM_DETAIL, params);
};

export const createSalesOrderHeadhuntItem = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_ITEM_CREATE, params);
};
export const updateSalesOrderHeadhuntItem = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_ITEM_UPDATE, params);
};
export const deleteSalesOrderHeadhuntItem = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SALES_ORDER_ITEM_DELETE, params);
};

export const getListSkuHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SKU_LIST_FULL, params);
};

export const getListFullSkuHeadhunt = async (params = {}) => {
    const res = await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SKU_LIST_FULL, params);
    return res ? res.items : [];
};
export const getDetailSkuHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SKU_DETAIL, params);
};
export const createSkuHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SKU_CREATE, params);
};
export const updateSkuHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SKU_UPDATE, params);
};
export const deleteSkuHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SKU_DELETE, params);
};
export const approveSkuHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_APPENDIX_APPROVE, params);
};
export const getListHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACCEPTANCE_RECORD_LIST, params);
};

export const getListFullHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACCEPTANCE_RECORD_LIST_FULL, params);
};

export const getDetailHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACCEPTANCE_RECORD_DETAIL, params);
};

export const createHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_CREATE, params);
};
export const updateHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_UPDATE, params);
};
export const deleteHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_DELETE, params);
};
export const submitHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_SUBMIT, params);
};
export const confirmHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_CONFIRM, params);
};
export const approveHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_APPROVE, params);
};
export const rejectHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_REJECT, params);
};
export const printHeadhuntAcceptanceRecord = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACCEPTANCE_RECORD_PRINT, params);
};

export const getListHeadhuntAcceptanceRecordDetail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACCEPTANCE_RECORD_DETAIL_LIST, params);
};

export const getListFullHeadhuntAcceptanceRecordDetail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACCEPTANCE_RECORD_DETAIL_LIST_FULL, params);
};

export const getDetailHeadhuntAcceptanceRecordDetail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACCEPTANCE_RECORD_DETAIL_DETAIL, params);
};

export const createHeadhuntAcceptanceRecordDetail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_DETAIL_CREATE, params);
};
export const updateHeadhuntAcceptanceRecordDetail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_DETAIL_UPDATE, params);
};
export const deleteHeadhuntAcceptanceRecordDetail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_ACCEPTANCE_RECORD_DETAIL_DELETE, params);
};

export const getListHeadhuntContract = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_LIST, params);
};
export const getListFullHeadhuntContract = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_LIST_FULL, params);
};
export const getDetailHeadhuntContract = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_DETAIL, params);
};
export const createHeadhuntContract = async (params = {}) => {
    return await fnPost(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_CREATE, params);
};
export const updateHeadhuntContract = async (params = {}) => {
    return await fnPost(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_UPDATE, params);
};
export const deleteHeadhuntContract = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_DELETE, params);
};
export const approveHeadhuntContract = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_APPROVE, params);
};
export const submitHeadhuntContract = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_SUBMIT, params);
};
export const confirmHeadhuntContract = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_CONFIRM, params);
};
export const rejectHeadhuntContract = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_REJECT, params);
};
export const printHeadhuntContract = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_PRINT, params);
};

export const getListHeadhuntContractAppendix = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_APPENDIX_LIST, params);
};
export const getListFullHeadhuntContractAppendix = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_APPENDIX_LIST_FULL, params);
};
export const getDetailHeadhuntContractAppendix = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_APPENDIX_DETAIL, params);
};
export const createHeadhuntContractAppendix = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_APPENDIX_CREATE, params);
};
export const updateHeadhuntContractAppendix = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_APPENDIX_UPDATE, params);
};
export const deleteHeadhuntContractAppendix = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_APPENDIX_DELETE, params);
};
export const approveHeadhuntContractAppendix = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_APPENDIX_APPROVE, params);
};

export const getListHeadhuntApplicantStatus = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_STATUS_LIST, params);
};
export const getListFullHeadhuntApplicantStatus = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_STATUS_LIST_FULL, params);
};
export const getDetailHeadhuntApplicantStatus = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_STATUS_DETAIL, params);
};
export const createHeadhuntApplicantStatus = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_STATUS_CREATE, params);
};
export const updateHeadhuntApplicantStatus = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_STATUS_UPDATE, params);
};
export const deleteHeadhuntApplicantStatus = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_STATUS_DELETE, params);
};

export const getListFullHeadhuntSkuApplicantStatus = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SKU_APPLICANT_STATUS_LIST_FULL, params);
};
export const getDetailHeadhuntSkuApplicantStatus = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_SKU_APPLICANT_STATUS_DETAIL, params);
};
export const createHeadhuntSkuApplicantStatus = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SKU_APPLICANT_STATUS_CREATE, params);
};
export const deleteHeadhuntSkuApplicantStatus = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_SKU_APPLICANT_STATUS_DELETE, params);
};
export const listHeadhuntApplicantStatusListCampaign = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_STATUS_LIST_CAMPAIGN_LIST, params);
};
export const listHeadhuntApplicantStatusReason = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_STATUS_REASON_LIST, params);
};
export const getListTemplateMail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_MAIL_TEMPLATE_LIST, params);
};

export const getListFullTemplateMail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_MAIL_TEMPLATE_LIST_FULL, params);
};

export const createTemplateMail = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_MAIL_TEMPLATE_CREATE, params);
};

export const updateTemplateMail = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_MAIL_TEMPLATE_UPDATE, params);
};

export const deleteTemplateMail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_MAIL_TEMPLATE_DELETE, params);
};

export const toggleTemplateMail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_MAIL_TEMPLATE_TOGGLE, params);
};

export const getListRecruitmentRequest = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_RECRUITMENT_REQUEST_LIST, params);
};

export const getDetailRecruitmentRequest = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_RECRUITMENT_REQUEST_DETAIL, params);
};

export const createRecruitmentRequest = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_RECRUITMENT_REQUEST_CREATE, params);
};

export const updateRecruitmentRequest = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_RECRUITMENT_REQUEST_UPDATE, params);
};

export const deleteRecruitmentRequest = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_RECRUITMENT_REQUEST_DELETE, params);
};
export const approveRecruitmentRequest = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_RECRUITMENT_REQUEST_APPROVE, params);
};

export const getListFullRecruitmentRequestDetail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_RECRUITMENT_REQUEST_DETAIL_LIST_FULL, params);
};

export const getDetailRecruitmentRequestDetail = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_RECRUITMENT_REQUEST_DETAIL_DETAIL, params);
};

export const createRecruitmentRequestDetail = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_RECRUITMENT_REQUEST_DETAIL_CREATE, params);
};

export const updateRecruitmentRequestDetail = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_RECRUITMENT_REQUEST_DETAIL_UPDATE, params);
};

export const deleteRecruitmentRequestDetail = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_RECRUITMENT_REQUEST_DETAIL_DELETE, params);
};

export const getListFullCampaignApplicantStatus = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_APPLICANT_STATUS_LIST_FULL, params);
};
export const saveByCampaignApplicantStatus = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_APPLICANT_STATUS_SAVE_BY_CAMPAIGN, params);
};
export const getDetailHeadhuntApplicant = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_DETAIL, params);
};
export const updateHeadhuntApplicantInfo = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_INFO_UPDATE, params);
}


export const getListFullApplicantInfoAction = async (params = {}) => {
    const res = await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_INFO_ACTION_LIST, params);
    return res?.items || [];
};

export const createApplicantInfoAction = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_INFO_ACTION_CREATE, params);
};

export const updateApplicantInfoAction = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_INFO_ACTION_UPDATE, params);
};

export const deleteApplicantInfoAction = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_INFO_ACTION_DELETE, params);
};

export const getFileCvApplicant = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_FILE_CV, params);
};
export const getFileCvHideApplicant = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_FILE_CV_HIDE, params);
};
export const getListFullHeadhuntAction = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_ACTION_LIST_FULL, params);
};
export const sendEmailTransactionMarketingCampaignHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_SEND_MAIL_TRANSACTION, params);
};
export const getListCampaignDailyReportHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CAMPAIGN_DAILY_REPORT, params);
};
export const getRecruitmentRequestReportHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_RECRUITMENT_REQUEST_REPORT, params);
};
export const getListCandidateHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_CANDIDATE_LIST, params);
};
export const getCandidateDetailHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_CANDIDATE_DETAIL, params);
};
export const staffSeenCandidateHeadhunt = async (params = {}) => {
    return await fnPost(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_STAFF_SEEN_CANDIDATE, params);
};
export const syncResumeCandidateHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_SYNC_RESUME_CANDIDATE, params);
};
export const getListFullIndustryHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_INDUSTRY_LIST_FULL, params);
};
export const getListApplicantGroupHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_GROUP_LIST, params);
};
export const createHeadhuntCandidate = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_CREATE, params);
};
export const updateHeadhuntCandidate = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_UPDATE, params);
};
export const deleteHeadhuntCandidate = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_DELETE, params);
};
export const getListHistoryCandidateCvFileHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CANDIDATE_CV_FILE_HISTORY_LIST, params);
};
export const getListTagHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_TAG_LIST, params);
};
export const getListFullTagHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_TAG_LIST_FULL, params);
};
export const createTagHeadhunt = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_TAG_CREATE, params);
};
export const updateTagHeadhunt = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_TAG_UPDATE, params);
};
export const deleteTagHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_TAG_DELETE, params);
};

export const getListFullContractFormHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_FORM_LIST_FULL, params);
};

export const getListFullContractRequestHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_REQUEST_LIST_FULL, params);
};

export const getDetailContractRequestHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_REQUEST_DETAIL, params);
};

export const createContractRequestHeadhunt = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_REQUEST_CREATE, params);
};

export const updateContractRequestHeadhunt = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_REQUEST_UPDATE, params);
};

export const deleteContractRequestHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CONTRACT_REQUEST_DELETE, params);
};

export const createByContractCampaignHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CAMPAIGN_CREATE_BY_CONTRACT, params);
};

export const assignTagCandidateHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_ASSIGN_TAG, params);
};

export const deleteTagCandidateHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_DELETE_TAG, params);
};
export const guaranteeApplicantHeadhunt = async (params = {}) => {
    return await fnPost(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_GUARANTEE, params);
};
export const searchApplicantHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_SEARCH, params);
};
export const changeStatusPipelineByCampaignHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CHANGE_PIPELINE_STATUS_BY_CAMPAIGN, params);
};
export const getListStaffItemsHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_STAFF_LIST_FULL, params);
};
export const listApplicantAcceptanceHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_ACCEPTANCE_LIST, params);
};
export const createApplicantAcceptanceHeadhunt = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_ACCEPTANCE_CREATE, params);
};
export const deleteApplicantAcceptanceHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_ACCEPTANCE_DELETE, params);
};
export const updateRecruiterApplicantHeadhunt = async (params = {}) => {
    return await fnPostV3(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_APPLICANT_UPDATE_RECRUITER, params);
};

export const listHierarchicalHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_APPLICANT_STATUS_LIST_HIERARCHICAL, params);
};
export const dailyReportContractRequestHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CONTRACT_REQUEST_DAILY_REPORT, params);
};

export const getListJobRequest = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_JOB_REQUEST_LIST, params);
};

export const createJobRequest = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_JOB_REQUEST_CREATE, params);
};

export const updateJobRequest = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_JOB_REQUEST_UPDATE, params);
};

export const deleteJobRequest = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_JOB_REQUEST_DELETE, params);
};

export const getListCandidateBankHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CANDIDATE_BANK_LIST, params);
};
export const getDetailCandidateBankHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CANDIDATE_BANK_DETAIL, params);
};
export const createMultiCandidateBankHeadhunt = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_BANK_CREATE_MULTI, params);
};

export const deleteCandidateBankHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_BANK_DELETE, params);
};
export const addCampaignCandidateBankHeadhunt = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_BANK_ADD_CAMPAIGN, params);
};
export const viewContactCandidateBankHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_BANK_VIEW_CONTACT, params);
};
export const evaluateCandidateBankHeadhunt = async (params = {}) => {
    return await fnPostV2(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_BANK_EVALUATE, params);
};
export const assignRecruiterCandidateBankHeadhunt = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_BANK_ASSIGN_RECRUITER, params);
};

export const getListCandidateBankResultHeadhunt = async (params = {}) => {
    return await fnGetV2(config.apiHeadHuntDomain, ConstantURL.API_URL_GET_HEADHUNT_CANDIDATE_BANK_RESULT_LIST, params);
};

export const createCandidateBankResultHeadhunt = async (params = {}) => {
    return await fnPostForm(config.apiHeadHuntDomain, ConstantURL.API_URL_POST_HEADHUNT_CANDIDATE_BANK_RESULT_CREATE, params);
};
