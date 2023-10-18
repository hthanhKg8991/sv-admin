import {fnGetV2, fnPostV2, fnPostForm} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

export const getResumeAppliedList = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_RESUME_APPLIED_LIST, params);
};

export const getResumeAppliedAll = async (params = {}) => {
    const ignoreChannel = true;
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_RESUME_APPLIED_LIST, params, 0, ignoreChannel);
};

export const getHistoryViewResume = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_VIEW_RESUME, params);
};

export const resendMailApplied = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_RESUME_APPLIED_RESEND_MAIL, params);
};

export const getEmployerStatisticBenefitTrial = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_EMPLOYER_STATISTIC_BENEFIT_TRIAL, params);
};
export const getNotification = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_NOTIFICATION_LIST, params);
};
export const viewNotification = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_NOTIFICATION_VIEW, params);
};
export const deleteNotification = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_NOTIFICATION_DELETE, params);
};

export const createAccountServiceCampaign = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_CAMPAIGN_CREATE, params);
};
export const changeStatusAccountServiceCampaign = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_CAMPAIGN_CHANGE_STATUS, params);
};
export const getAccountServiceCampaignList = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_ACCOUNT_SERVICE_CAMPAIGN_LIST, params);
};
export const updateAccountServiceCampaign = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_GET_ACCOUNT_SERVICE_CAMPAIGN_UPDATE, params);
}
export const getListApplicant = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_LIST_APPLICANT, params);
};
export const changeStatusApplicant = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_CHANGE_STATUS_APPLICANT, params);
};
export const getListTemplateMail = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_TEMPLATE_MAIL, params);
};
export const createTemplateMail = async (params = {}) => {
    return await fnPostForm(config.apiMixDomain, ConstantURL.API_URL_POST_CREATE_TEMPLATE_MAIL, params);
};
export const updateTemplateMail = async (params = {}) => {
    return await fnPostForm(config.apiMixDomain, ConstantURL.API_URL_POST_UPDATE_TEMPLATE_MAIL, params);
};
export const toggleTemplateMail = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_TOOGLE_TEMPLATE_MAIL, params);
};
export const deleteTemplateMail = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_DELETE_TEMPLATE_MAIL, params);
};
export const sendMailAccountService = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_EMAIL_SEND, params);
};
export const sendMailHistoryAccountService = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_EMAIL_SENT_HISTORY, params);
};
export const getListAdvisoryRegister = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_LIST_ADVISORY_REGISTER, params);
}
export const getAdvisoryRegisterDetail = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_ADVISORY_REGISTER_DETAILS, params);
}
export const getAccountServiceSearchResumeCampaignList = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_LIST, params);
};
export const createAccountServiceSearchResumeCampaign = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_CREATE, params);
};
export const updateAccountServiceSearchResumeCampaign = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_UPDATE, params);
};
export const changeStatusAccountServiceSearchResumeCampaign = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_CHANGE_STATUS, params);
};

export const createAccountServiceSearchFilterResumeHistory = async (params = {}) => {
    const ignoreChannel = true;
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_FILTER_RESUME_HISTORY_CREATE, params, 0, ignoreChannel);
};

export const getFilterAccountService = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_ACCOUNT_SERVICE_CUSTOM_FILTER_LIST, params);
};

export const createFilterAccountService = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_CUSTOM_FILTER_ADD, params);
};

export const deleteFilterAccountService = async (params = {}) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_ACCOUNT_SERVICE_CUSTOM_FILTER_DELETE, params);
}
export const getDetailAccountServiceSearchResumeCampaign = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_DETAIL, params);
};

export const getHistorySentResumeAccountServiceSearchResumeCampaign = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_HISTORY_SEND_RESUME, params);
};

export const getListSentResumeAccountServiceSearchResumeFilter = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_ACCOUNT_SERVICE_SEARCH_RESUME_FILTER_LIST, params);
};


export const getResumeHistory = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_RESUME_HISTORY_LIST, params);
};

export const getResumeHistoryDetail = async (params) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_RESUME_HISTORY_DETAIL, params);
};

export const approveResumeQuickApplied = async (resume_history_id) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_RESUME_HISTORY_APPROVE, {id: resume_history_id});
};

export const rejectResumeQuickApplied = async (data) => {
    return await fnPostV2(config.apiMixDomain, ConstantURL.API_URL_POST_RESUME_HISTORY_REJECT, data);
};

export const getSkillSuggest = async (params = {}) => {
    return await fnGetV2(config.apiMixDomain, ConstantURL.API_URL_GET_SKILL_SUGGEST, params);
};

