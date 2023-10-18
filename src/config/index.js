import AdminStorage from "utils/storage";

const isDevMode = process.env.NODE_ENV;
const apiEmployerDomain =
  isDevMode && AdminStorage.getItem("api_employer")
    ? AdminStorage.getItem("api_employer")
    : process.env.REACT_APP_SV_EMPLOYER_URL;
const apiSystemDomain =
  isDevMode && AdminStorage.getItem("api_system")
    ? AdminStorage.getItem("api_system")
    : process.env.REACT_APP_SV_SYSTEM_URL;
const apiAuthDomain =
  isDevMode && AdminStorage.getItem("api_auth")
    ? AdminStorage.getItem("api_auth")
    : process.env.REACT_APP_SV_AUTH_URL;
const apiBookingDomain =
  isDevMode && AdminStorage.getItem("api_booking")
    ? AdminStorage.getItem("api_booking")
    : process.env.REACT_APP_SV_BOOKING_URL;
const apiSalesOrderDomain =
  isDevMode && AdminStorage.getItem("api_sales_order")
    ? AdminStorage.getItem("api_sales_order")
    : process.env.REACT_APP_SV_SALES_ORDER_URL;
const apiSalesOrderV2Domain =
  isDevMode && AdminStorage.getItem("api_sales_order_v2")
    ? AdminStorage.getItem("api_sales_order_v2")
    : process.env.REACT_APP_SV_SALES_ORDER_V2_URL;
const apiPlanDomain =
  isDevMode && AdminStorage.getItem("api_plan")
    ? AdminStorage.getItem("api_plan")
    : process.env.REACT_APP_SV_PLAN_URL;
const apiStatisticDomain =
  isDevMode && AdminStorage.getItem("api_statistic")
    ? AdminStorage.getItem("api_statistic")
    : process.env.REACT_APP_SV_STATISTIC_URL;
const apiCallDomain =
  isDevMode && AdminStorage.getItem("api_call")
    ? AdminStorage.getItem("api_call")
    : process.env.REACT_APP_SV_CALL_URL;
const apiCdnDomain =
  isDevMode && AdminStorage.getItem("api_cdn")
    ? AdminStorage.getItem("api_cdn")
    : process.env.REACT_APP_SV_CDN_URL;
const apiSeekerDomain =
  isDevMode && AdminStorage.getItem("api_seeker")
    ? AdminStorage.getItem("api_seeker")
    : process.env.REACT_APP_SV_SEEKER_URL;
const apiResumeDomain =
  isDevMode && AdminStorage.getItem("api_seeker")
    ? AdminStorage.getItem("api_seeker")
    : process.env.REACT_APP_SV_SEEKER_URL;
const apiPrintDomain =
  isDevMode && AdminStorage.getItem("api_print")
    ? AdminStorage.getItem("api_print")
    : process.env.REACT_APP_SV_PRINT_URL;
const apiArticleDomain =
  isDevMode && AdminStorage.getItem("api_article")
    ? AdminStorage.getItem("api_article")
    : process.env.REACT_APP_SV_ARTICLE_URL;
const apiMixDomain =
  isDevMode && AdminStorage.getItem("api_mix")
    ? AdminStorage.getItem("api_mix")
    : process.env.REACT_APP_SV_MIX_URL;
const apiCommissionDomain =
  isDevMode && AdminStorage.getItem("api_commission")
    ? AdminStorage.getItem("api_commission")
    : process.env.REACT_APP_SV_COMMISSION_URL;
const apiStatementDomain =
  isDevMode && AdminStorage.getItem("api_statement")
    ? AdminStorage.getItem("api_statement")
    : process.env.REACT_APP_SV_STATEMENT_URL;
const apiExperimentDomain =
  isDevMode && AdminStorage.getItem("api_experiment")
    ? AdminStorage.getItem("api_experiment")
    : process.env.REACT_APP_SV_EXPERIMENT_URL;
const apiAudienceDomain =
  isDevMode && AdminStorage.getItem("api_audience")
    ? AdminStorage.getItem("api_audience")
    : process.env.REACT_APP_SV_AUDIENCE_URL;
const apiFeatureFlag =
  isDevMode && AdminStorage.getItem("api_feature_flag")
    ? AdminStorage.getItem("api_feature_flag")
    : process.env.REACT_APP_SV_FEATURE_FLAG_URL;
const apiSurveyDomain =
  isDevMode && AdminStorage.getItem("api_survey")
    ? AdminStorage.getItem("api_survey")
    : process.env.REACT_APP_SV_SURVEY_URL;
const apiHeadHuntDomain =
  isDevMode && AdminStorage.getItem("api_headhunt")
    ? AdminStorage.getItem("api_headhunt")
    : process.env.REACT_APP_SV_HEADHUNT_URL;
const apiEmailMarketingDomain =
  isDevMode && AdminStorage.getItem("api_email_marketing")
    ? AdminStorage.getItem("api_email_marketing")
    : process.env.REACT_APP_SV_EMAIL_MARKETING_URL;
const apiGamificationDomain =
  isDevMode && AdminStorage.getItem("api_gamification")
    ? AdminStorage.getItem("api_gamification")
    : process.env.REACT_APP_SV_GAMIFICATION_URL;
const apiZaloDomain =
  isDevMode && AdminStorage.getItem("api_gamification")
    ? AdminStorage.getItem("api_gamification")
    : process.env.REACT_APP_SV_ZALO_URL;

const config = {
  apiEmployerDomain,
  apiSystemDomain,
  apiAuthDomain,
  apiBookingDomain,
  apiSalesOrderDomain,
  apiSalesOrderV2Domain,
  apiPlanDomain,
  apiStatisticDomain,
  apiCallDomain,
  apiCdnDomain,
  apiSeekerDomain,
  apiResumeDomain,
  apiPrintDomain,
  apiArticleDomain,
  apiSearchDomain: process.env.REACT_APP_SV_CRAWL_URL,
  apiMixDomain,
  apiCommissionDomain,
  apiStatementDomain,
  apiExperimentDomain,
  apiAudienceDomain,
  apiFeatureFlag,
  apiSurveyDomain,
  apiHeadHuntDomain,
  apiEmailMarketingDomain,
  apiGamificationDomain,
  apiZaloDomain,
  callCenterDomain: process.env.REACT_APP_SV_CALL_CENTER_URL,
  urlCdnFile: process.env.REACT_APP_SV_CDN_URL,
  urlCdnExcel: process.env.REACT_APP_SV_PRINT_URL,
};
export default config;
