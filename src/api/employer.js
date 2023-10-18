import {fnGetV2, fnGetV3, fnPostV2, fnPostV3} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import {fakePaginate, fnPostForm} from "api/index";
import {API_URL_GET_LIST_COMMIT_CV, API_URL_POST_CREATE_COMMIT_CV} from "utils/ConstantURL";

export const getList = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, params);
};

export const getListIsAssigned = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, {
        ...params,
        is_assigned: true
    });
};

export const getSearch = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_SEARCH, params);
};

export const add = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_ADD, params);
};

export const update = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_UPDATE,
        params);
};

export const changePassword = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_CHANGE_PASSWORD,
        params);
};

export const getDetail = async (id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_DETAIL_EMPLOYER,
        {id: id});
};

export const approve = async (employer_id) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_APPROVE,
        {id: employer_id});
};

export const reject = async (params) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_REJECT,
        params);
};

export const approveRevision = async (employer_id) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_REVISION_APPROVE,
        {id: employer_id});
};

export const rejectRevision = async (params) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_REVISION_REJECT,
        params);
};

export const getRevision = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION,
        {employer_id: employer_id});
};

export const verifyEmail = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_VERIFY_EMAIL,
        {id: employer_id});
};

export const resendVerifyEmail = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_RESEND_VERIFY_EMAIL,
        {id: employer_id});
};

export const getListRevision = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_REVISION_LIST,
        params);
};

export const getDetailRevision = async (id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_REVISION_LIST_DETAIL,
        {id: id});
};

export const getReasonLock = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_REASON_LOCK,
        {employer_id: employer_id});
};

export const getKeywordLock = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_LOCK,
        {employer_id: employer_id});
};

export const getReasonSuspect = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_REASON_SUSPECT,
        {employer_id: employer_id});
};

export const getKeywordSuspect = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_SUSPECT,
        {employer_id: employer_id});
};

export const getImage = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_IMAGE_LIST,
        {employer_id: employer_id});
};

export const getImageLog = async (params = null) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_IMAGE_LOG,
        params);
};

export const getEmployerHasImageActive = async (params = null) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_IMAGE_LIST_EMPLOYER,
        {...params, type_list: 1});
};

export const getEmployerHasImageInactive = async (params = null) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_IMAGE_LIST_EMPLOYER,
        {...params, type_list: 2});
};

export const createEmployerImageByStaff = async (params = null) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_IMAGE_VIEW_BY_STAFF,
        params);
};

export const updateImage = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_IMAGE_UPDATE,
        params);
};

export const exportEmployer = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_EXPORT, params);
};

export const changeCompanyKind = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_CHANGE_KIND,
        params);
};

export const changeFolder = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_CHANGE_FOLDER,
        params);
};

export const changeCustomer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_UPDATE_CUSTOMER,
        params);
};

export const changeSupport = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_UPDATE_SUPPORT_INFO,
        params);
};

export const getEmployerNote = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_NOTE_LIST, params);
};

export const addEmployerNote = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_NOTE_ADD, params);
};

export const getListRequirement = async (params = {}) => {
    let query = {...params};
    if (query.idQuery) {
        query.id = query.idQuery;
    }
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_LIST_REQUIREMENT,
        query);
};

export const getListRequirementJob = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_LIST_REQUIREMENT_JOB,
        params);
};

export const sendRequestJob = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_REQUIREMENT_JOB,
        params);
};

export const sendRequestApproveJob = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_JOB_APPROVE_REQ,
        params);
};

export const sendRequestRejectJob = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_JOB_REJECT_REQ,
        params);
};

export const sendRequestEmployer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_REQUIREMENT_EMPLOYER,
        params);
};

export const sendRequestApproveEmployer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_APPROVE_REQ,
        params);
};

export const sendRequestRejectEmployer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_POST_EMPLOYER_REJECT_REQ,
        params);
};

export const getDetailRequestJob = async (id) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_REQ_JOB, {id});
};

export const getDetailRequestEmployer = async (id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_GET_DETAIL_REQ_EMPLOYER,
        {id});
};

export const getDeleteRequestEmployer = async (id) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_REQ_EMPLOYER, {id});
};

export const getDeleteRequestJob = async (id) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_REQ_JOB, {id});
};

export const getAssignmentRequestList = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_ASSIGNMENT_REQUEST_LIST, params);
};

export const getAssignmentRequestDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_ASSIGNMENT_REQUEST_DETAIL, params);
};

export const createAssignmentRequest = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_ASSIGNMENT_REQUEST_CREATE, params);
};

export const approveAssignmentRequest = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_ASSIGNMENT_REQUEST_APPROVED, params);
};

export const rejectAssignmentRequest = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_ASSIGNMENT_REQUEST_REJECT, params);
};

export const deleteAssignmentRequest = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_ASSIGNMENT_REQUEST_DELETE, params);
};

export const getEmployerNotDisturbList = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_NOT_DISTURB, params);
};

export const createEmployerNotDisturb = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_CREATE_EMPLOYER_NOT_DISTURB, params);
};

export const deleteEmployerNotDisturb = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_EMPLOYER_NOT_DISTURB, params);
};

export const importEmployerNotDisturb = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_IMPORT_EMPLOYER_NOT_DISTURB, params);
};

export const interrogationEmployerNotDisturb = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_INTERROGATION_EMPLOYER_NOT_DISTURB, params);
};

export const employerCheckEmail = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_CHECK_EMAIL, params);
};

export const employerEmailCustomer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_SEARCH_EMAIL_CUSTOMER, params);
};

export const getEmployerNotAllowedContact = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_NOT_ALLOWED_CONTACT, params);
};

export const getEmployerNotAllowedContactKeyword = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_NOT_ALLOWED_CONTACT_KEYWORD, params);
};

export const getJobDaily = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_DAILY_JOB, params);
};

export const getJobDailyDetail = async (params = {}) => {
    return await fnGetV3(config.apiEmployerDomain, ConstantURL.API_URL_GET_DAILY_JOB_DETAIL, params);
};

export const saveLogsDailyViewed = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DAILY_JOB, params);
};

export const getEmployerMarketingList = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_MARKETING_LIST, params);
};

export const getEmployerMarketingDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_MARKETING_DETAIL, params);
};

export const verifyEmployerMarketing = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_MARKETING_VERIFY, params);
};

export const getReasonLockAndUnblock = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_REASON_LOCK_AND_UNBLOCK, params);
};

export const getEmployerFilter = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, {
        ...params,
        type: Constant.EMPLOYER_TYPE,
        assigned_type: Constant.EMPLOYER_ASSIGNED_TYPE_FILTER
    });
};

export const getEmployerSearchEmailFullReq = async (params = {}) => {
    return await fnGetV3(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_SEARCH_EMAIL, params);
};

export const getEmployerComplainList = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_COMPLAIN, params);
};

export const getEmployerComplainDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER_COMPLAIN, params);
};

export const changeStatusEmployerComplain = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CHANGE_STATUS_EMPLOYER_COMPLAIN, params);
};

export const getEmployerBlacklistKeywordLock = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_LOCK, params);
};

export const addBlacklistKeywordLock = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_ADD_BLACKLIST_KEYWORD_LOCK, params);
};

export const getListDivideStaff = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_DIVIDE, params);
};

export const createDivideStaffNew = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CREATE_DIVIDE_NEW, params);
};

export const createDivideStaffOld = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CREATE_DIVIDE_OLD, params);
};

export const deleteDivideStaff = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_DIVIDE, params);
};

export const deleteAllDivideStaff = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_ALL_DIVIDE, params);
};

export const resetDivideStaff = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_RESET_DIVIDE_OLD, params);
};

export const getListTag = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_TAG_LIST, params);
};

export const detailTag = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_TAG_DETAIL, params);
};

export const createTag = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_TAG_CREATE, params);
};

export const updateTag = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_TAG_UPDATE, params);
};

export const importTag = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_TAG_IMPORT, params);
};

export const deleteTag = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_TAG_DELETE, params);
};

export const getEmployerNotPotential = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, {
        ...params,
        type: Constant.EMPLOYER_TYPE,
        assigned_type: Constant.EMPLOYER_ASSIGNED_TYPE_NOT_POPENTIAL
    });
};

export const deleteAssignStaff = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_ASSIGN_STAFF, params);
};

export const deleteRoomVerify = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_ROOM_VERIFY, params);
};

export const deleteRoomNewCustomer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_ROOM_NEW_CUSTOMER, params);
};

export const deleteRoomStaff = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_DELETE_ROOM_ASSIGN_STAFF, params);
};

export const getListShareRoom = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_ROOM_LIST, params);
};

export const getListShareRoomItems = async (params = {}) => {
    const {items = []} = await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_ROOM_LIST, params);
    return items;
};

export const getDetailShareRoom = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_ROOM_DETAIL, params);
};

export const createShareRoom = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_CREATE, params);
};

export const updateShareRoom = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_UPDATE, params);
};

export const deleteShareRoom = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_DELETE, params);
};

export const getListShareRoomDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_ROOM_DETAIL_LIST, params);
};

export const createShareRoomDetail = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_DETAIL_CREATE, params);
};

export const deleteShareRoomDetail = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_DETAIL_DELETE, params);
};

export const getListShareRoomRule = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_ROOM_RULE_LIST, params);
};

export const getDetailShareRoomRule = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_ROOM_RULE_DETAIL, params);
};

export const createShareRoomRule = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_RULE_CREATE, params);
};

export const updateShareRoomRule = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_RULE_UPDATE, params);
};

export const deleteShareRoomRule = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_ROOM_RULE_DELETE, params);
};

export const getListShareBasket = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_BASKET_LIST, params);
};

export const getListShareBasketItems = async (params = {}) => {
    const res = await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_BASKET_LIST, params);
    return res?.items || [];
};

export const getDetailShareBasket = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_BASKET_DETAIL, params);
};

export const createShareBasket = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_BASKET_CREATE, params);
};

export const updateShareBasket = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_BASKET_UPDATE, params);
};

export const deleteShareBasket = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_BASKET_DELETE, params);
};

export const getListShareBasketDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_BASKET_DETAIL_LIST, params);
};

export const updateAllShareBasketDetail = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_BASKET_DETAIL_UPDATE_ALL, params);
};

export const getListShareBasketRule = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_BASKET_RULE_LIST, params);
};

export const getDetailShareBasketRule = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CONFIG_EMPLOYER_SHARE_BASKET_RULE_DETAIL, params);
};

export const createShareBasketRule = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_BASKET_RULE_CREATE, params);
};

export const updateShareBasketRule = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_BASKET_RULE_UPDATE, params);
};

export const deleteShareBasketRule = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CONFIG_EMPLOYER_SHARE_BASKET_RULE_DELETE, params);
};

export const getListCustomer = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_CUSTOMER_LIST, params);
};

export const getListCustomerSuggest = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_CUSTOMER_SUGGEST_LIST, params);
};

export const getListCustomerItems = async (params = {}) => {
    const res = await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_CUSTOMER_LIST, {
        ...params,
        per_page: 1000
    });
    return res?.items || [];
};

export const getDetailCustomer = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_CUSTOMER_DETAIL, params);
};

export const createCustomer = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_CUSTOMER_CREATE, params);
};

export const updateCustomer = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_CUSTOMER_UPDATE, params);
};

export const deleteCustomer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_CUSTOMER_DELETE, params);
};

export const getEmployerAccuracyLog = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_ACCURACY_LOG_LIST, params);
};

export const getListJob = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, params);
};

export const getListJobItems = async (params = {}) => {
    const res = await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, params);
    return res?.items || [];
};

export const getListRequestEmployer = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_REQUEST_GET_EMPLOYER_LIST, params);
};

export const getRequestEmployerDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_REQUEST_GET_EMPLOYER_DETAIL, params);
};

export const createRequestEmployer = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_REQUEST_GET_EMPLOYER_CREATE, params);
};

export const updateRequestEmployer = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_REQUEST_GET_EMPLOYER_UPDATE, params);
};

export const deleteRequestEmployer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_REQUEST_GET_EMPLOYER_DELETE, params);
};

export const getHistoryRequestEmployer = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_REQUEST_GET_EMPLOYER_HISTORY, params);
};

export const getListMultiRequestAssignmentEmployer = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_MULTI_REQUEST_ASSIGNMENT_EMPLOYER_LIST, params);
};

export const getMultiRequestAssignmentDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_MULTI_REQUEST_ASSIGNMENT_EMPLOYER_DETAIL, params);
};

export const createMultiRequestAssignmentEmployer = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_MULTI_REQUEST_ASSIGNMENT_EMPLOYER_CREATE, params);
};

export const updateMultiRequestAssignmentEmployer = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_MULTI_REQUEST_ASSIGNMENT_EMPLOYER_UPDATE, params);
};

export const deleteMultiRequestAssignmentEmployer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_MULTI_REQUEST_ASSIGNMENT_EMPLOYER_DELETE, params);
};

export const getListEmployerInternal = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_INTERNAL_LIST, params);
};

export const createEmployerInternal = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_INTERNAL_CREATE, params);
};

export const deleteEmployerInternal = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_INTERNAL_DELETE, params);
};


export const getListInformationCollect = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_INFORMATION_COLLECT_LIST, params);
};

export const getDetailInformationCollect = async (id) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_INFORMATION_COLLECT_DETAIL, {id});
};

export const getListEmployerTrial = async (params) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_TRIAL, params);
};
export const updateVipEmployer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_UPDATE_VIP, params);
};

export const getListEmployerHistoryClass = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_CLASS_HISTORY_LIST, params);
};
export const assignCustomer = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_ACTIVE_COMPANY, params);
};
export const activeCustomer = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_ACTIVE_CUSTOMER, params);
};

export const getListJDTemplate = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_JD_TEMPLATE_LIST, params);
};

export const getDetailJDTemplate = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_JD_TEMPLATE_DETAIL, params);
};

export const createJDTemplate = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_JD_TEMPLATE_CREATE, params);
};

export const updateJDTemplate = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_JD_TEMPLATE_UPDATE, params);
};

export const deleteJDTemplate = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_JD_TEMPLATE_DELETE, params);
};

export const toggleJDTemplate = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_JD_TEMPLATE_TOGGLE, params);
};

export const createEmployerCheckmate = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_CHECKMATE_CREATE, params);
};

export const getBannerCover = async (employer_id) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_BANNER_COVER_LIST,
        {employer_id: employer_id});
};

export const updateBannerCover = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_BANNER_COVER_UPDATE,
        params);
};

export const getBannerCoverLog = async (params = null) => {
    return await fnGetV2(config.apiEmployerDomain,
        ConstantURL.API_URL_EMPLOYER_BANNER_COVER_LOG,
        params);
};


export const listCustomerHistoryLog = async (params = {}) => {
    const res = await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_CUSTOMER_HISTORY_LOG, params);
    return fakePaginate(res || []);
};

export const getListEmployerFreemium = async (params) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_FREEMIUM, params);
};

export const createEmployerFreemium = async (params) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_FREEMIUM_NEW, params);
};

export const approveEmployerFreemium = async (params) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_FREEMIUM_APPROVE, params);
};

export const removeEmployerFreemium = async (params) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_FREEMIUM_REMOVE, params);
};

export const getEmployerFreemiumHistory = async (params) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_FREEMIUM_HISTORY, params);
};

export const getListEmployerFreemiumPro = async (params) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_FREEMIUM_PRO, params);
};

export const getDetailEmployerFreemiumPro = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER_FREEMIUM_PRO, params);
};

export const changeStatusEmployerFreemiumPro = async (params) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_FREEMIUM_PRO_CHANGE_STATUS, params);
};

export const checkSalesOrderApproveByTax = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_SALES_ORDER_APPROVE, params);
};

export const getAccountService = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_LIST_ACCOUNT_SERVICE_STAFF, params);
};

export const getEmployerNetsale = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYERS_NET_SALE, params);
};

export const sendMailWarningDrop = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_SEND_MAIL_WARNING_DROP, params);
};

export const createCommitCV = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_CREATE_COMMIT_CV, params);
};

export const listCommitCV = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_COMMIT_CV, params);
};

export const unAssignCustomer = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_UNASSIGN_CUSTOMER, params);
};

export const moveSpecialCase = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_CUSTOMER_MOVE_SPECIAL_CASE, params);
};

export const dischargeSpecialCase = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_CUSTOMER_DISCHARGE_SPECIAL_CASE, params);
};

export const dischargeVerify = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_CUSTOMER_DISCHARGE_VERIFY, params);
};

export const customerStaffAssignmentUpdate = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_CUSTOMER_STAFF_ASSIGNMENT_UPDATE, params);
};

export const assignStaffCustomer = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_POST_CUSTOMER_STAFF_ASSIGN_CUSTOMER, params);
};

export const listCustomerAssignmentHistory = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_CUSTOMER_ASSIGNMENT_HISTORY_LIST, params);
};

export const listEpmployerCustomerAssignmentHistory = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_ASSIGNMENT_CUSTOMER_HISTORY, params);
};

export const getListJobSuggestContent = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB_SUGGEST_CONTENT, params);
};

export const getJobSuggestContentDetail = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_JOB_SUGGEST_CONTENT_DETAIL, params);
};

export const reSendOtpViewResumePoint = async (params = {}) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_RE_SEND_OTP_VIEW_RESUME_POINT, params);
}

export const changeStatusOtp = async (params = {}) => {
    return await fnPostV3(config.apiEmployerDomain, ConstantURL.API_URL_CHANGE_STATUS_OTP, params);
};