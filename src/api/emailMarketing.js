import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import { fnGetV2, fnPostV2, fnPostForm } from "api/index";

export const getListGroupCampaign = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_GROUP_CAMPAIGN_LIST, params);
};

export const getListGroupCampaignItems = async (params = {}) => {
  const res = await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_GROUP_CAMPAIGN_LIST, params);
  return res?.items || [];
};

export const createGroupCampaign = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_CAMPAIGN_CREATE, params);
};

export const updateGroupCampaign = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_CAMPAIGN_UPDATE, params);
};

export const deleteGroupCampaign = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_CAMPAIGN_DELETE, params);
};

export const toggleGroupCampaign = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_CAMPAIGN_TOGGLE, params);
};

export const getListCampaign = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_CAMPAIGN_LIST, params);
};

export const getListDropboxCampaign = async (params = {}) => {
  const res = await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_CAMPAIGN_LIST, params);
  return res?.items || [];
};

export const getDetailCampaign = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_CAMPAIGN_DETAIL, params);
};

export const createCampaign = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_CAMPAIGN_CREATE, params);
};

export const updateCampaign = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_CAMPAIGN_UPDATE, params);
};

export const deleteCampaign = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_CAMPAIGN_DELETE, params);
};

export const toggleCampaign = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_CAMPAIGN_TOGGLE, params);
};
export const getListCampaignDetail = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_CAMPAIGN_DETAIL_LIST, params);
};

export const getListTemplateMail = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_MAIL_TEMPLATE_LIST, params);
};

export const getListTemplateMailItems = async (params = {}) => {
  const res = await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_MAIL_TEMPLATE_LIST, params);
  return res?.items || [];
};

export const getDetailTemplateMail = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_MAIL_TEMPLATE_DETAIL, params);
};

export const createTemplateMail = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_MAIL_TEMPLATE_CREATE, params);
};

export const updateTemplateMail = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_MAIL_TEMPLATE_UPDATE, params);
};

export const deleteTemplateMail = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_MAIL_TEMPLATE_DELETE, params);
};

export const toggleTemplateMail = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_MAIL_TEMPLATE_TOGGLE, params);
};

export const getListListContact = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_LIST_CONTACT_LIST, params);
};

export const getListListContactFull = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_LIST_CONTACT_LIST_FULL, params);
};

export const getDetailListContact = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_LIST_CONTACT_DETAIL, params);
};

export const createListContact = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_CREATE, params);
};

export const updateListContact = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_UPDATE, params);
};

export const deleteListContact = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_DELETE, params);
};

export const createMultipleListContact = async (params = {}) => {
  return await fnPostForm(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_CREATE_MULTIPLE,
    params
  );
};

export const toggleListContact = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_TOGGLE, params);
};

export const getListListContactDetail = async (params = {}) => {
  return await fnGetV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_GET_EMAIL_MARKETING_LIST_CONTACT_DETAIL_LIST, params);
};

export const getDetailListContactDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_GET_EMAIL_MARKETING_LIST_CONTACT_DETAIL_DETAIL,
    params
  );
};

export const createListContactDetail = async (params = {}) => {
  return await fnPostForm(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_DETAIL_CREATE,
    params
  );
};

export const updateListContactDetail = async (params = {}) => {
  return await fnPostForm(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_DETAIL_UPDATE,
    params
  );
};

export const deleteListContactDetail = async (params = {}) => {
  return await fnPostV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_DETAIL_DELETE,
    params
  );
};

export const toggleListContactDetail = async (params = {}) => {
  return await fnPostV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_LIST_CONTACT_DETAIL_TOGGLE,
    params
  );
};

export const sendEmailMarketingCampaign = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_CAMPAIGN_SEND_MAIL, params);
};

export const createByImportEmailMarketing = async (params = {}) => {
  return await fnPostV2(config.apiEmailMarketingDomain, ConstantURL.API_URL_POST_EMAIL_MARKETING_CREATE_BY_IMPORT, params);
};

export const getListFullCampaignGroupPermission = async (params = {}) => {
  return await fnGetV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_GET_EMAIL_MARKETING_GROUP_CAMPAIGN_PERMISSION_LIST_FULL,
    params
  );
};

export const createCampaignGroupPermission = async (params = {}) => {
  return await fnPostForm(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_CAMPAIGN_PERMISSION_CREATE,
    params
  );
};

export const deleteCampaignGroupPermission = async (params = {}) => {
  return await fnPostV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_CAMPAIGN_PERMISSION_DELETE,
    params
  );
};

export const getListFullEmailConfig = async (params = {}) => {
  return await fnGetV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_GET_EMAIL_MARKETING_GROUP_EMAIL_CONFIG_LIST_FULL,
    params
  );
};

export const createEmailConfig = async (params = {}) => {
  return await fnPostForm(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_EMAIL_CONFIG_CREATE,
    params
  );
};

export const deleteEmailConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_GROUP_EMAIL_CONFIG_DELETE,
    params
  );
};

export const sendEmailTransactionMarketingCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiEmailMarketingDomain,
    ConstantURL.API_URL_POST_EMAIL_MARKETING_CAMPAIGN_SEND_MAIL_TRANSACTION,
    params
  );
};

export const createSegment = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_EMAIL_MARKETING_POST_SEGMENT_CREATE, params);
};

export const checkConditions = async (params = {}) => {
  return await fnPostForm(config.apiEmailMarketingDomain, ConstantURL.API_URL_EMAIL_MARKETING_POST_CHECK_CONDITIONS, params);
};
