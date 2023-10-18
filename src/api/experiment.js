import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnGetV2, fnPostV2, fnPostForm} from "api/index";

export const getListExperiment = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_LIST, params);
};

export const getListExperimentItems = async (params = {}) => {
    const res = await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_LIST, params);
    return res?.items || [];
};

export const getDetailExperiment = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_DETAIL, params);
};

export const createExperiment = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_CREATE, params);
};

export const updateExperiment = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_UPDATE, params);
};

export const deleteExperiment = async (params = {}) => {
    return await fnPostV2(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_DELETE, params);
};

export const toggleExperiment = async (params = {}) => {
    return await fnPostV2(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_TOGGLE, params);
};

export const getListExperimentVariant = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_VARIANT_LIST, params);
};

export const getListExperimentVariantItems = async (params = {}) => {
    const res = await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_VARIANT_LIST, params);
    return res?.items || [];
};

export const getDetailExperimentVariant = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_VARIANT_DETAIL, params);
};

export const createExperimentVariant = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_VARIANT_CREATE, params);
};

export const updateExperimentVariant = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_VARIANT_UPDATE, params);
};

export const deleteExperimentVariant = async (params = {}) => {
    return await fnPostV2(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_VARIANT_DELETE, params);
};

export const toggleExperimentVariant = async (params = {}) => {
    return await fnPostV2(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_VARIANT_TOGGLE, params);
};

export const saveMultiExperimentVariant = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_VARIANT_SAVE_MULTI, params);
};

export const getListProject = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_PROJECT_LIST, params);
};

export const getListProjectItems = async (params = {}) => {
    const res = await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_PROJECT_LIST, params);
    return res?.items || [];
};

export const getDetailProject = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_PROJECT_DETAIL, params);
};

export const createProject = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_PROJECT_CREATE, params);
};

export const updateProject = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_PROJECT_UPDATE, params);
};

export const deleteProject = async (params = {}) => {
    return await fnPostV2(config.apiExperimentDomain, ConstantURL.API_URL_POST_PROJECT_DELETE, params);
};

export const getListExperimentTest = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_TEST_LIST, params);
};

export const getDetailExperimentTest = async (params = {}) => {
    return await fnGetV2(config.apiExperimentDomain, ConstantURL.API_URL_GET_EXPERIMENT_TEST_DETAIL, params);
};

export const createExperimentTest = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_TEST_CREATE, params);
};

export const updateExperimentTest = async (params = {}) => {
    return await fnPostForm(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_TEST_UPDATE, params);
};

export const deleteExperimentTest = async (params = {}) => {
    return await fnPostV2(config.apiExperimentDomain, ConstantURL.API_URL_POST_EXPERIMENT_TEST_DELETE, params);
};