import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnGetV2, fnPostV2, fnPostForm} from "api/index";

export const getListGroupCampaign = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_GROUP_CAMPAIGN_LIST, params);
};

export const getListGroupCampaignItems = async (params = {}) => {
    const res = await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_GROUP_CAMPAIGN_LIST, params);
    return res?.items || [];
};

export const createGroupCampaign = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_GROUP_CAMPAIGN_CREATE, params);
};

export const updateGroupCampaign = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_GROUP_CAMPAIGN_UPDATE, params);
};

export const deleteGroupCampaign = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_GROUP_CAMPAIGN_DELETE, params);
};

export const activeGroupCampaign = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_GROUP_CAMPAIGN_ACTIVE, params);
};

export const getListCampaign = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_CAMPAIGN_LIST, params);
};

export const getListDropboxCampaign = async (params = {}) => {
    const res = await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_CAMPAIGN_LIST, params);
    return res?.items || [];
};


export const getDetailCampaign = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_CAMPAIGN_DETAIL, params);
};

export const createCampaign = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_CAMPAIGN_CREATE, params);
};

export const updateCampaign = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_CAMPAIGN_UPDATE, params);
};

export const deleteCampaign = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_CAMPAIGN_DELETE, params);
};

export const toggleCampaign = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_CAMPAIGN_TOGGLE, params);
};
export const getListCampaignDetail= async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_CAMPAIGN_DETAIL_LIST, params);
};
export const getStatusZaloCampaignDetail= async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_CAMPAIGN_DETAIL_GET_STATUS_MESSAGE, params);
};
export const getListTemplate = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_TEMPLATE_LIST, params);
};

export const getListTemplateItems = async (params = {}) => {
    const res = await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_TEMPLATE_LIST, params);
    return res?.items || [];
};

export const getDetailTemplate = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_TEMPLATE_DETAIL, params);
};

export const syncTemplate = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_TEMPLATE_SYNC, params);
};

export const updateTemplate = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_TEMPLATE_UPDATE, params);
};

export const deleteTemplate = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_TEMPLATE_DELETE, params);
};

export const toggleTemplate = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_TEMPLATE_TOGGLE, params);
};

export const getListListContact = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_LIST_CONTACT_LIST, params);
};

export const getListListContactFull = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_LIST_CONTACT_LIST_FULL, params);
};

export const getDetailListContact = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_LIST_CONTACT_DETAIL, params);
};

export const createListContact = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_CREATE, params);
};

export const updateListContact = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_UPDATE, params);
};

export const deleteListContact = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_DELETE, params);
};

export const createMultipleListContact = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_CREATE_MULTIPLE, params);
};

export const activeListContact = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_ACTIVE, params);
};

export const getListListContactDetail = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_LIST_CONTACT_DETAIL_LIST, params);
};

export const getDetailListContactDetail = async (params = {}) => {
    return await fnGetV2(config.apiZaloDomain, ConstantURL.API_URL_GET_ZALO_ZNS_LIST_CONTACT_DETAIL_DETAIL, params);
};

export const createListContactDetail = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_DETAIL_CREATE, params);
};

export const updateListContactDetail = async (params = {}) => {
    return await fnPostForm(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_DETAIL_UPDATE, params);
};

export const deleteListContactDetail = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_DETAIL_DELETE, params);
};

export const toggleListContactDetail = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_LIST_CONTACT_DETAIL_TOGGLE, params);
};

export const sendEmail = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_CAMPAIGN_SEND_MAIL, params);
};

export const createByImport = async (params = {}) => {
    return await fnPostV2(config.apiZaloDomain, ConstantURL.API_URL_POST_ZALO_ZNS_CREATE_BY_IMPORT, params);
};
