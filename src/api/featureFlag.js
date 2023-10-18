import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnGetV2, fnPostV2, fnPostForm} from "api/index";

export const getListFeatureFlag = async (params = {}) => {
    return await fnGetV2(config.apiFeatureFlag, ConstantURL.API_URL_GET_FEATURE_FLAG_LIST, params);
};

export const getDetailFeatureFlag = async (params = {}) => {
    return await fnGetV2(config.apiFeatureFlag, ConstantURL.API_URL_GET_FEATURE_FLAG_DETAIL, params);
};

export const createFeatureFlag = async (params = {}) => {
    return await fnPostForm(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_CREATE, params);
};

export const updateFeatureFlag = async (params = {}) => {
    return await fnPostForm(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_UPDATE, params);
};

export const deleteFeatureFlag = async (params = {}) => {
    return await fnPostV2(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_DELETE, params);
};

export const toggleFeatureFlag = async (params = {}) => {
    return await fnPostV2(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_TOGGLE, params);
};

export const getListFeatureFlagUser = async (params = {}) => {
    return await fnGetV2(config.apiFeatureFlag, ConstantURL.API_URL_GET_FEATURE_FLAG_USER_LIST, params);
};

export const getDetailFeatureFlagUser = async (params = {}) => {
    return await fnGetV2(config.apiFeatureFlag, ConstantURL.API_URL_GET_FEATURE_FLAG_USER_DETAIL, params);
};

export const createFeatureFlagUser = async (params = {}) => {
    return await fnPostForm(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_USER_CREATE, params);
};

export const updateFeatureFlagUser = async (params = {}) => {
    return await fnPostForm(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_USER_UPDATE, params);
};

export const deleteFeatureFlagUser = async (params = {}) => {
    return await fnPostV2(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_USER_DELETE, params);
};

export const toggleFeatureFlagUser = async (params = {}) => {
    return await fnPostV2(config.apiFeatureFlag, ConstantURL.API_URL_POST_FEATURE_FLAG_USER_TOGGLE, params);
};