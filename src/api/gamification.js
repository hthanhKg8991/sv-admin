import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnGetV2, fnPostForm, fnPostV2} from "api/index";

export const getListGamificationChallengesCategory = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_CHALLENGES_CATEGORY_LIST, params);
};

export const getListFullGamificationChallengesCategory = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_CHALLENGES_CATEGORY_LIST_FULL, params);
};

export const getDetailGamificationChallengesCategory = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_CHALLENGES_CATEGORY_DETAIL, params);
};

export const createGamificationChallengesCategory = async (params = {}) => {
    return await fnPostForm(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_CATEGORY_CREATE, params);
};

export const updateGamificationChallengesCategory = async (params = {}) => {
    return await fnPostForm(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_CATEGORY_UPDATE, params);
};

export const deleteGamificationChallengesCategory = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_CATEGORY_DELETE, params);
};
export const submitGamificationChallengesCategory = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_CATEGORY_SUBMIT, params);
};

export const toggleGamificationChallengesCategory = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_CATEGORY_TOGGLE, params);
};

export const getListGamificationChallenges = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_CHALLENGES_LIST, params);
};

export const getDetailGamificationChallenges = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_CHALLENGES_DETAIL, params);
};

export const createGamificationChallenges = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_CREATE, params);
};

export const updateGamificationChallenges = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_UPDATE, params);
};

export const submitGamificationChallenges = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_SUBMIT, params);
};

export const toggleGamificationChallenges = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_TOGGLE, params);
};

export const deleteGamificationChallenges = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_CHALLENGES_DELETE, params);
};

export const getListGamificationEvent = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_EVENT_LIST, params);
};

export const getListFullGamificationEvent = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_EVENT_LIST_FULL, params);
};

export const getDetailGamificationEvent = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_EVENT_DETAIL, params);
};

export const createGamificationEvent = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_EVENT_CREATE, params);
};

export const updateGamificationEvent = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_EVENT_UPDATE, params);
};

export const submitGamificationEvent = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_EVENT_SUBMIT, params);
};

export const toggleGamificationEvent = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_EVENT_TOGGLE, params);
};

export const deleteGamificationEvent = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_EVENT_DELETE, params);
};

export const getListGamificationReward = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_REWARD_LIST, params);
};
export const getListFullGamificationReward = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_REWARD_LIST_FULL, params);
};
export const getDetailGamificationReward = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_REWARD_DETAIL, params);
};

export const createGamificationReward = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CREATE, params);
};

export const updateGamificationReward = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_UPDATE, params);
};

export const submitGamificationReward = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_SUBMIT, params);
};

export const toggleGamificationReward = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_TOGGLE, params);
};

export const deleteGamificationReward = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_DELETE, params);
};

export const getListGamificationPoint = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_POINT_LIST, params);
};

export const getListFullGamificationPoint = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_POINT_LIST_FULL, params);
};

export const getDetailGamificationPoint = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_POINT_DETAIL, params);
};

export const createGamificationPoint = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_POINT_CREATE, params);
};

export const updateGamificationPoint = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_POINT_UPDATE, params);
};

export const submitGamificationPoint = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_POINT_SUBMIT, params);
};

export const toggleGamificationPoint = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_POINT_TOGGLE, params);
};

export const deleteGamificationPoint = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_POINT_DELETE, params);
};

export const getListGamificationRewardCondition = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_REWARD_CONDITION_LIST, params);
};

export const getDetailGamificationRewardCondition = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_REWARD_CONDITION_DETAIL, params);
};

export const createGamificationRewardCondition = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONDITION_CREATE, params);
};

export const updateGamificationRewardCondition = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONDITION_UPDATE, params);
};

export const submitGamificationRewardCondition = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONDITION_SUBMIT, params);
};

export const toggleGamificationRewardCondition = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONDITION_TOGGLE, params);
};

export const deleteGamificationRewardCondition = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONDITION_DELETE, params);
};

export const getListGamificationRewardConfig = async (params = {}) => {
    return await fnGetV2(config.apiGamificationDomain, ConstantURL.API_URL_GET_GAMIFICATION_REWARD_CONFIG_LIST, params);
};

export const createGamificationRewardConfig = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONFIG_CREATE, params);
};

export const updateGamificationRewardConfig = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONFIG_UPDATE, params);
};

export const submitGamificationRewardConfig = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONFIG_SUBMIT, params);
};

export const toggleGamificationRewardConfig = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONFIG_TOGGLE, params);
};

export const deleteGamificationRewardConfig = async (params = {}) => {
    return await fnPostV2(config.apiGamificationDomain, ConstantURL.API_URL_POST_GAMIFICATION_REWARD_CONFIG_DELETE, params);
};