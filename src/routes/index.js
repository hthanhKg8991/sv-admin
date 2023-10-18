import React from 'react';
import Loadable from 'react-loadable';
import * as Constant from "utils/Constant";
import {Route, Switch} from "react-router-dom";
import LoadingPage from "components/Common/Ui/LoadingPage";
import moment from "moment";

const MyLoadable = (opts) => Loadable(Object.assign({
    loading: LoadingPage,
}, opts));

const LayoutMain = MyLoadable({
    loader: () => import('components/Layout/LayoutMain'),
    modules: ['LayoutMain']
});
const LayoutAuth = MyLoadable({
    loader: () => import('components/Layout/LayoutAuth'),
    modules: ['LayoutAuth']
});

const HomePage = MyLoadable({
    loader: () => import('pages/HomePage'),
    modules: ['HomePage']
});

const LoginOauthPage = MyLoadable({
    loader: () => import('pages/LoginPage'),
    modules: ['LoginPage']
});

// const LoginOauthPage = MyLoadable({
//     loader: () => import('pages/LoginOauthPage'),
//     modules: ['LoginOauthPage']
// });

const ChangePasswordPage = MyLoadable({
    loader: () => import('pages/ChangePasswordPage'),
    modules: ['ChangePasswordPage']
});

const OtpPage = MyLoadable({
    loader: () => import('pages/OtpPage'),
    modules: ['OtpPage']
});

const ErrorPage = MyLoadable({
    loader: () => import('pages/ErrorPage'),
    modules: ['ErrorPage']
});

//CustomerCare
const EmployerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerPage'),
    modules: ['EmployerPage']
});

const CustomerInformationLookup = MyLoadable({
    loader: () => import('pages/CustomerCare/CustomerInformationLookup'),
    modules: ['CustomerInformationLookup']
});

const CommitCV = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerPage'),
    modules: ['EmployerPage']
});

const EmployerPageSME = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerPageSME'),
    modules: ['EmployerPageSME']
});

const StatisticRemovedEmployerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/StatisticRemovedEmployerPage'),
    modules: ['StatisticRemovedEmployerPage']
});
const StatisticEmployerByStaffPage = MyLoadable({
    loader: () => import('pages/CustomerCare/StatisticEmployerByStaffPage'),
    modules: ['StatisticEmployerByStaffPage']
});
const StatisticEmployerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/StatisticEmployerPage'),
    modules: ['StatisticEmployerPage']
});
const PlanTrackingPage = MyLoadable({
    loader: () => import('pages/CustomerCare/PlanTrackingPage'),
    modules: ['PlanTrackingPage']
});
const PlanMonthPage = MyLoadable({
    loader: () => import('pages/CustomerCare/PlanMonthPage'),
    modules: ['PlanMonthPage']
});
const PlanWeekPage = MyLoadable({
    loader: () => import('pages/CustomerCare/PlanWeekPage'),
    modules: ['PlanWeekPage']
});
const PlanDailyRevenuePage = MyLoadable({
    loader: () => import('pages/CustomerCare/PlanDailyRevenuePage'),
    modules: ['PlanDailyRevenuePage']
});
const PlanTomorrowPage = MyLoadable({
    loader: () => import('pages/CustomerCare/PlanTomorrowPage'),
    modules: ['PlanTomorrowPage']
});
const BookingBoxPage = MyLoadable({
    loader: () => import('pages/CustomerCare/BookingBoxPage'),
    modules: ['BookingBoxPage']
});
const BookingJobPage = MyLoadable({
    loader: () => import('pages/CustomerCare/BookingJobPage'),
    modules: ['BookingJobPage']
});
const BookingBannerBoxPage = MyLoadable({
    loader: () => import('pages/CustomerCare/BookingBannerBoxPage'),
    modules: ['BookingBannerBoxPage']
});
const BookingBannerJobPage = MyLoadable({
    loader: () => import('pages/CustomerCare/BookingBannerJobPage'),
    modules: ['BookingBannerJobPage']
});
const BookingPage = MyLoadable({
    loader: () => import('pages/CustomerCare/BookingPage'),
    modules: ['BookingPage']
});

const BookingBannerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/BookingBannerPage'),
    modules: ['BookingBannerPage']
});

const JobPage = MyLoadable({
    loader: () => import('pages/CustomerCare/JobPage'),
    modules: ['JobPage']
});

const JobFreemiumPage = MyLoadable({
    loader: () => import('pages/CustomerCare/JobFreemiumPage'),
    modules: ['JobFreemiumPage']
});

const SalesOrderPricePage = MyLoadable({
    loader: () => import('pages/CustomerCare/SalesOrderPricePage'),
    modules: ['SalesOrderPricePage']
});
const SalesOrderPriceEditPage = MyLoadable({
    loader: () => import('pages/CustomerCare/SalesOrderPriceEditPage'),
    modules: ['SalesOrderPriceEditPage']
});
const SalesOrderPage = MyLoadable({
    loader: () => import('pages/CustomerCare/SalesOrderPage'),
    modules: ['SalesOrderPage']
});
const SalesOrderEditPage = MyLoadable({
    loader: () => import('pages/CustomerCare/SalesOrderEditPage'),
    modules: ['SalesOrderEditPage']
});
const SearchSalesOrderPage = MyLoadable({
    loader: () => import('pages/CustomerCare/SearchSalesOrderPage'),
    modules: ['SearchSalesOrderPage']
});
const SalesOrderRequestPage = MyLoadable({
    loader: () => import('pages/CustomerCare/SalesOrderRequestPage'),
    modules: ['SalesOrderRequestPage']
});
const AssignmentRequestPage = MyLoadable({
    loader: () => import('pages/CustomerCare/AssignmentRequestPage'),
    modules: ['AssignmentRequestPage']
});
const RunningServiceManagePage = MyLoadable({
    loader: () => import('pages/CustomerCare/RunningServiceManagePage'),
    modules: ['RunningServiceManagePage']
});
const EmployerNotDisturb = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerNotDisturbPage'),
    modules: ['EmployerNotDisturbPage']
});
const EmployerNotDisturbSearch = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerNotDisturbSearchPage'),
    modules: ['EmployerNotDisturbSearchPage']
});
const EmployerNotNotAllowed = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerNotAllowedPage'),
    modules: ['EmployerNotNotAllowedPage']
});
const EmployerImagePendingPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerImagePendingPage'),
    modules: ['EmployerImagePendingPage']
});
const EmployerImageDayPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerImageDayPage'),
    modules: ['EmployerImageDayPage']
});

const JobDailyPage = MyLoadable({
    loader: () => import('pages/CustomerCare/JobDailyPage'),
    modules: ['JobDailyPage']
});

const EmployerFilterPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerFilterPage'),
    modules: ['EmployerFilterPage']
});

const HistoryRefreshJobPage = MyLoadable({
    loader: () => import('pages/CustomerCare/HistoryRefreshJobPage'),
    modules: ['HistoryRefreshJobPage']
});

const GuaranteeJobPage = MyLoadable({
    loader: () => import('pages/CustomerCare/GuaranteeJobPage'),
    modules: ['GuaranteeJobPage']
});

const ResumeReportPage = MyLoadable({
    loader: () => import('pages/CustomerCare/ResumeReportPage'),
    modules: ['ResumeReportPage']
});
const EmployerNotPotentialPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerNotPotentialPage'),
    modules: ['EmployerNotPotentialPage']
});
const CustomerEmployerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/CustomerPage'),
    modules: ['CustomerEmployerPage']
});
const EmployerResignPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerResignPage'),
    modules: ['EmployerResignPage']
});
const SearchCheckEmailPage = MyLoadable({
    loader: () => import('pages/CustomerCare/SearchCheckEmailPage'),
    modules: ['SearchCheckEmailPage']
});
const HistoryServiceManagerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/HistoryServiceManagerPage'),
    modules: ['HistoryServiceManagerPage']
});
const HistoryServiceVtnPage = MyLoadable({
    loader: () => import('pages/CustomerCare/HistoryServiceVtnPage'),
    modules: ['HistoryServiceVtnPage']
});
const SearchEmailCustomerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/SearchEmailCustomerPage'),
    modules: ['SearchEmailCustomerPage']
});
const ConfigServiceGiftPage = MyLoadable({
    loader: () => import('pages/CustomerCare/ConfigServiceGiftPage'),
    modules: ['ConfigServiceGiftPage']
});
const ToolTransferEmployerAssignmentPage = MyLoadable({
    loader: () => import('pages/CustomerCare/ToolTransferEmployerAssignmentPage'),
    modules: ['ToolTransferEmployerAssignmentPage']
});
const ToolTransferStepGetEmployerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/ToolTransferStepGetEmployerPage'),
    modules: ['ToolTransferStepGetEmployerPage']
});
const ToolTransferStepProcessPage = MyLoadable({
    loader: () => import('pages/CustomerCare/ToolTransferStepProcessPage'),
    modules: ['ToolTransferStepProcessPage']
});
const PointGiftPage = MyLoadable({
    loader: () => import('pages/CustomerCare/PointGiftPage'),
    modules: ['PointGiftPage']
});
const EmployerTrialPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerTrialPage'),
    modules: ['EmployerTrialPage']
});
const EmployerFreemiumPage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/CustomerCare/EmployerFreemiumPage'),
    modules: ['EmployerFreemiumPage']
});
const EmployerInternalPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerInternalPage'),
    modules: ['EmployerInternalPage']
});

const EmployerClassPage = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerClassPage'),
    modules: ['EmployerClassPage']
});

const QuotationRequestPage = MyLoadable({
    loader: () => import('pages/CustomerCare/QuotationRequestPage'),
    modules: ['QuotationRequestPage']
});

const JDTemplatePage = MyLoadable({
    loader: () => import('pages/CustomerCare/JDTemplatePage'),
    modules: ['JDTemplatePage']
});

const BannerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/BannerPage'),
    modules: ['BannerPage']
});

const LangPage = MyLoadable({
    loader: () => import('pages/CustomerCare/DataLangPage'),
    modules: ['LangPage']
});

const EmployerWithPromotionCode = MyLoadable({
    loader: () => import('pages/CustomerCare/EmployerWithPromotionCode'),
    modules: ['EmployerWithPromotionCode']
});

const SalesOrderByFieldPage = MyLoadable({
    loader: () => import('pages/Checkmate/SalesOrderByFieldPage'),
    modules: ['SalesOrderByFieldPage']
});

const FieldPriceListPage = MyLoadable({
    loader: () => import('pages/Checkmate/FieldPriceListPage'),
    modules: ['FieldPriceListPage']
});

const FieldPrintTemplatePage = MyLoadable({
    loader: () => import('pages/Checkmate/FieldPrintTemplatePage'),
    modules: ['FieldPrintTemplatePage']
});

const EmployerCheckmatePage = MyLoadable({
    loader: () => import('pages/Checkmate/EmployerCheckmatePage'),
    modules: ['EmployerCheckmatePage']
});

const CallHistoryCheckmatePage = MyLoadable({
    loader: () => import('pages/Checkmate/CallHistoryPage'),
    modules: ['CallHistoryCheckmatePage']
});

const SalesOrderSchedulePage = MyLoadable({
    loader: () => import('pages/Checkmate/SalesOrderSchedulePage'),
    modules: ['SalesOrderSchedulePage']
});

const FieldRegistrationPage = MyLoadable({
    loader: () => import('pages/Checkmate/FieldRegistrationPage'),
    modules: ['FieldRegistrationPage']
});

const FieldQuotationRequestPage = MyLoadable({
    loader: () => import('pages/CustomerCare/FieldQuotationRequestPage'),
    modules: ['FieldQuotationRequestPage']
});

const FieldPromotionProgramsPage = MyLoadable({
    loader: () => import('pages/Checkmate/FieldPromotionProgramsPage'),
    modules: ['FieldPromotionProgramsPage']
});

const ExchangeSalesOrderPage = MyLoadable({
    loader: () => import('pages/CustomerCare/ExchangeSalesOrderPage'),
    modules: ['ExchangeSalesOrderPage']
});

const CreditEmployerPage = MyLoadable({
    loader: () => import('pages/CustomerCare/CreditEmployerPage'),
    modules: ['CreditEmployerPage']
});

//QA
const CallHistoryPage = MyLoadable({
    loader: () => import('pages/QA/CallHistoryPage'),
    modules: ['CallHistoryPage']
});
const CallMobileHistoryPage = MyLoadable({
    loader: () => import('pages/QA/CallMobileHistoryPage'),
    modules: ['CallMobileHistoryPage']
});
const CallStatisticPage = MyLoadable({
    loader: () => import('pages/QA/CallStatisticPage'),
    modules: ['CallStatisticPage']
});
const CallMobileStatisticPage = MyLoadable({
    loader: () => import('pages/QA/CallMobileStatisticPage'),
    modules: ['CallMobileStatisticPage']
});
const CallEvaluatePage = MyLoadable({
    loader: () => import('pages/QA/CallEvaluatePage'),
    modules: ['CallEvaluatePage']
});
const CallViolationPage = MyLoadable({
    loader: () => import('pages/QA/CallViolationPage'),
    modules: ['CallViolationPage']
});
const CallMasterScoringPage = MyLoadable({
    loader: () => import('pages/QA/CallMasterScoringPage'),
    modules: ['CallMasterScoringPage']
});
const TimeFramePage = MyLoadable({
    loader: () => import('pages/QA/TimeFramePage'),
    modules: ['TimeFramePage']
});
const CallLineStatisticPage = MyLoadable({
    loader: () => import('pages/QA/CallLineStatisticPage'),
    modules: ['CallLineStatisticPage']
});

//Seeker Care
const SeekerPage = MyLoadable({
    loader: () => import('pages/SeekerCare/SeekerPage'),
    modules: ['SeekerPage']
});
const SeekerDetailHideContactPage = MyLoadable({
    loader: () => import('pages/SeekerCare/SeekerPage/DetailHideContact'),
    modules: ['SeekerDetailHideContactPage']
});

const ResumePage = MyLoadable({
    loader: () => import('pages/SeekerCare/ResumePage'),
    modules: ['ResumePage']
});

const ResumeHistoryPage = MyLoadable({
    loader: () => import('pages/SeekerCare/ResumeHistoryPage'),
    modules: ['ResumeHistoryPage']
});

const StatisticSeekerPage = MyLoadable({
    loader: () => import('pages/SeekerCare/StatisticSeekerPage'),
    modules: ['StatisticSeekerPage']
});
const StatisticResumePage = MyLoadable({
    loader: () => import('pages/SeekerCare/StatisticResumePage'),
    modules: ['StatisticResumePage']
});
const ResumeStepByStepPage = MyLoadable({
    loader: () => import('pages/SeekerCare/ResumeStepByStepPage'),
    modules: ['ResumeStepByStepPage']
});
const ResumeAttachPage = MyLoadable({
    loader: () => import('pages/SeekerCare/ResumeAttachPage'),
    modules: ['ResumeAttachPage']
});
const ResumeTemplatePage = MyLoadable({
    loader: () => import('pages/SeekerCare/ResumeTemplatePage'),
    modules: ['ResumeTemplatePage']
});

const ResumeDailyPage = MyLoadable({
    loader: () => import('pages/SeekerCare/ResumeDailyPage'),
    modules: ['ResumeDailyPage']
});

const SeekerServicePage = MyLoadable({
    loader: () => import('pages/SeekerCare/SeekerServicePage'),
    modules: ['SeekerServicePage']
});

//QC
const JobSupportPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/JobSupportPage'),
    modules: ['JobSupportPage']
});
const JobSupportLoggingPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/JobSupportLoggingPage'),
    modules: ['JobSupportLoggingPage']
});
const JobSupportTrackingPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/JobSupportTrackingPage'),
    modules: ['JobSupportTrackingPage']
});
const JobSupportPreviewPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/JobSupportPreviewPage'),
    modules: ['JobSupportPreviewPage']
});
const NotificationWebsitePage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/NotificationWebsitePage'),
    modules: ['NotificationWebsitePage']
});
const DivideEmployerPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/DivideEmployerPage'),
    modules: ['DivideEmployerPage']
});
const CustomerServicePage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/CustomerServicePage'),
    modules: ['CustomerServicePage']
});
const RoomPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/RoomPage'),
    modules: ['RoomPage']
});
const BlockKeywordPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/BlockKeywordPage'),
    modules: ['BlockKeywordPage']
});
const HotlineWebsitePage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/HotlineWebsitePage'),
    modules: ['HotlineWebsitePage']
});
const EmployerPointResumeGuarantee = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/EmployerPointResumeGuarantee'),
    modules: ['EmployerPointResumeGuarantee']
});
const RunningBannerPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/RunningBannerPage'),
    modules: ['RunningBannerPage']
});
const ApproveAssignmentRequestPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/ApproveAssignmentRequestPage'),
    modules: ['AssignmentRequestPage']
});
const HistoryApproveAssignmentRequestPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/HistoryApproveAssignmentRequestPage'),
    modules: ['HistoryAssignmentRequestPage']
});
const RequirementApprovePage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/RequirementApprovePage'),
    modules: ['RequirementApprove']
});
const FilterJobPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/FilterJobPage'),
    modules: ['FilterJobPage']
});
const ComplainPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/ComplainPage'),
    modules: ['ComplainPage']
});

const DivideNewPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/DivideNewPage'),
    modules: ['DivideNewPage']
});

const DivideOldPage = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/DivideOldPage'),
    modules: ['DivideOldPage']
});

const CustomerSuggest = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/CustomerSuggest'),
    modules: ['CustomerSuggest']
});

const RegisterAdvisory = MyLoadable({
    loader: () => import('pages/QualityControlEmployer/RegisterAdvisory'),
    modules: ['RegisterAdvisory']
});

//System
const TemplateMailPage = MyLoadable({
    loader: () => import('pages/System/TemplateMailPage'),
    modules: ['TemplateMailPage']
});
const CommonDataPage = MyLoadable({
    loader: () => import('pages/System/CommonDataPage'),
    modules: ['CommonDataPage']
});
const DocumentGuidePage = MyLoadable({
    loader: () => import('pages/System/DocumentGuidePage'),
    modules: ['DocumentGuidePage']
});
const GateJobFieldPage = MyLoadable({
    loader: () => import('pages/System/GateJobFieldPage'),
    modules: ['GateJobFieldPage']
});
const InfoContractPage = MyLoadable({
    loader: () => import('pages/System/InfoContractPage'),
    modules: ['InfoContractPage']
});
const UppercaseKeywordPage = MyLoadable({
    loader: () => import('pages/System/UppercaseKeywordPage'),
    modules: ['UppercaseKeywordPage']
});
const ForbiddenKeywordPage = MyLoadable({
    loader: () => import('pages/System/ForbiddenKeywordPage'),
    modules: ['ForbiddenKeywordPage']
});
const ConfigPage = MyLoadable({
    loader: () => import('pages/System/ConfigPage'),
    modules: ['ConfigPage']
});
const StatisticPage = MyLoadable({
    loader: () => import('pages/System/StatisticPage'),
    modules: ['StatisticPage']
});
const ShareRoomListPage = MyLoadable({
    loader: () => import('pages/System/ShareRoomListPage'),
    modules: ['ShareRoomListPage']
});
const ShareRoomRulePage = MyLoadable({
    loader: () => import('pages/System/ShareRoomRulePage'),
    modules: ['ShareRoomRulePage']
});
const ShareBasketListPage = MyLoadable({
    loader: () => import('pages/System/ShareBasketListPage'),
    modules: ['ShareBasketListPage']
});
const ShareBasketRulePage = MyLoadable({
    loader: () => import('pages/System/ShareBasketRulePage'),
    modules: ['ShareBasketRulePage']
});
const ShareBasketDetailListPage = MyLoadable({
    loader: () => import('pages/System/ShareBasketDetailListPage'),
    modules: ['ShareBasketDetailListPage']
});
const UploadPage = MyLoadable({
    loader: () => import('pages/System/UploadPage'),
    modules: ['UploadPage']
});
const PaymentRequestPage = MyLoadable({
    loader: () => import('pages/System/PaymentRequestPage'),
    modules: ['PaymentRequestPage']
});

//Auth
const StaffPage = MyLoadable({
    loader: () => import('pages/Auth/StaffPage'),
    modules: ['StaffPage']
});
const DivisionPage = MyLoadable({
    loader: () => import('pages/Auth/DivisionPage'),
    modules: ['DivisionPage']
});
const PermissionPage = MyLoadable({
    loader: () => import('pages/Auth/PermissionPage'),
    modules: ['PermissionPage']
});
const ActionPage = MyLoadable({
    loader: () => import('pages/Auth/ActionPage'),
    modules: ['ActionPage']
});

//Accountant
const CustomerPage = MyLoadable({
    loader: () => import('pages/Accountant/CustomerPage'),
    modules: ['CustomerPage']
});
const SalesOrderApprovePage = MyLoadable({
    loader: () => import('pages/Accountant/SalesOrderApprovePage'),
    modules: ['CustomerPage']
});
const SalesOrderApproveDropPage = MyLoadable({
    loader: () => import('pages/Accountant/SalesOrderApproveDropPage'),
    modules: ['SalesOrderApproveDropPage']
});
const SalesOrderServiceApprovePage = MyLoadable({
    loader: () => import('pages/Accountant/SalesOrderServiceApprovePage'),
    modules: ['SalesOrderServiceApprovePage']
});
const ApproveRequestChangeRequestInvoicesPage = MyLoadable({
    loader: () => import('pages/Accountant/ApproveRequestChangeRequestInvoicesPage'),
    modules: ['ApproveRequestChangeRequestInvoicesPage']
});
const PriceRecontractPage = MyLoadable({
    loader: () => import('pages/Accountant/PriceRecontractPage'),
    modules: ['PriceRecontractPage']
});
const PriceListPage = MyLoadable({
    loader: () => import('pages/Accountant/PriceListPage'),
    modules: ['PriceListPage']
});
const AccBookingPage = MyLoadable({
    loader: () => import('pages/Accountant/AccBookingPage'),
    modules: ['AccBookingPage']
});
const SalesOrderRegisCancelApprovePage = MyLoadable({
    loader: () => import('pages/Accountant/SalesOrderRegisCancelApprovePage'),
    modules: ['SalesOrderRegisCancelApprovePage']
});
const CampaignPage = MyLoadable({
    loader: () => import('pages/Accountant/CampaignPage'),
    modules: ['CampaignPage']
});
const PromotionProgramsPage = MyLoadable({
    loader: () => import('pages/Accountant/PromotionProgramsPage'),
    modules: ['PromotionProgramsPage']
});
const ProductGroupPage = MyLoadable({
    loader: () => import('pages/Accountant/ProductGroupPage'),
    modules: ['ProductGroupPage']
});
const BundlesPackagePage = MyLoadable({
    loader: () => import('pages/Accountant/BundlesPackagePage'),
    modules: ['BundlesPackagePage']
});
const ComboPackagePage = MyLoadable({
    loader: () => import('pages/Accountant/ComboPackagePage'),
    modules: ['ComboPackagePage']
});
const ComboPostingPackagePage = MyLoadable({
    loader: () => import('pages/Accountant/ComboPostingPackagePage'),
    modules: ['ComboPostingPackagePage']
});
const SubscriptionPackagePage = MyLoadable({
    loader: () => import('pages/Accountant/SubscriptionPackagePage'),
    modules: ['SubscriptionPackagePage']
});
const OfferIncreasingConfigPage = MyLoadable({
    loader: () => import('pages/Accountant/OfferIncreasingConfigPage'),
    modules: ['OfferIncreasingConfigPage']
});
const ConfigGiftServicePackagePage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/Accountant/ConfigGiftServicePackagePage'),
    modules: ['ConfigGiftServicePackagePage']
});
const GroupCampaignPage = MyLoadable({
    loader: () => import('pages/Accountant/GroupCampaignPage'),
    modules: ['GroupCampaignPage']
});
const SalesOrderConvertPage = MyLoadable({
    loader: () => import('pages/Accountant/SalesOrderConvertPage'),
    modules: ['SalesOrderConvertPage']
});
//Article
const ArticlePostPage = MyLoadable({
    loader: () => import('pages/Article/ArticlePostPage'),
    modules: ['ArticlePostPage']
});
const ArticleQuestionPage = MyLoadable({
    loader: () => import('pages/Article/ArticleQuestionPage'),
    modules: ['ArticleQuestionPage']
});
const TagPage = MyLoadable({
    loader: () => import('pages/SEO/TagPage'),
    modules: ['TagPage']
});
const SeoMetaPage = MyLoadable({
    loader: () => import('pages/SEO/SeoMetaPage'),
    modules: ['SeoMetaPage']
});

//Revenue
const RevenueDailyPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueDailyPage'),
    modules: ['RevenueDailyPage']
});
const RevenueConfigPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueConfigPage'),
    modules: ['RevenueConfigPage']
});
const RevenueOfStaffPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueOfStaffPage'),
    modules: ['RevenueOfStaffPage']
});
const RevenueListFollowPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueListFollowPage'),
    modules: ['RevenueListFollowPage']
});
const RevenueCommissionPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueCommissionPage'),
    modules: ['RevenueCommissionPage']
});
const RevenueCommissionReportPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueCommissionReportPage'),
    modules: ['RevenueCommissionReportPage']
});
const RevenueBonusPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueBonusPage'),
    modules: ['RevenueBonusPage']
});
const RevenueResultKPIPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueResultKPIPage'),
    modules: ['RevenueResultKPIPage']
});
const RevenueConfigKPIMonthPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueConfigKPIMonthPage'),
    modules: ['RevenueConfigKPIMonthPage']
});
const RevenueConfigStaffPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueConfigStaffPage'),
    modules: ['RevenueConfigStaffPage']
});
const RevenueConfigGroupPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueConfigGroupPage'),
    modules: ['RevenueConfigGroupPage']
});
const RevenueConfigKPIStaffPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueConfigKPIStaffPage'),
    modules: ['RevenueConfigKPIStaffPage']
});
const RevenueReportKPIStaffPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueReportKPIStaffPage'),
    modules: ['RevenueReportKPIStaffPage']
});
const RevenueReportKPIStaffNewPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueReportKPIStaffNewPage'),
    modules: ['RevenueReportKPIStaffNewPage']
});
const RevenueReportRevenueStaffPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueReportRevenueStaffPage'),
    modules: ['RevenueReportRevenueStaffPage']
});
const RevenueReportBonusStaffPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueReportBonusStaffPage'),
    modules: ['RevenueReportBonusStaffPage']
});
const RevenueDataPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueDataPage'),
    modules: ['RevenueDataPage']
});
const RevenueNetSaleDataPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueNetSaleDataPage'),
    modules: ['RevenueNetSaleDataPage']
});
const RevenueCashDataPage = MyLoadable({
    loader: () => import('pages/Revenue/RevenueCashDataPage'),
    modules: ['RevenueCashDataPage']
});
const RevenueReview = MyLoadable({
    loader: () => import('pages/Revenue/RevenueReview'),
    modules: ['RevenueReview']
});

// Payment
const PaymentPage = MyLoadable({
    loader: () => import('pages/Payment/PaymentPage'),
    modules: ['PaymentPage']
});
const StatementPage = MyLoadable({
    loader: () => import('pages/Payment/StatementPage'),
    modules: ['StatementPage']
});
const TransactionPage = MyLoadable({
    loader: () => import('pages/Payment/TransactionPage'),
    modules: ['TransactionPage']
});

const OpportunityPage = MyLoadable({
    loader: () => import('pages/CustomerCare/OpportunityPage'),
    modules: ['OpportunityPage']
});

const BankPage = MyLoadable({
    loader: () => import('pages/Payment/BankPage'),
    modules: ['BankPage']
});
const ExperimentPage = MyLoadable({
    loader: () => import('pages/Experiment/ExperimentPage'),
    modules: ['ExperimentPage']
});
const ProjectPage = MyLoadable({
    loader: () => import('pages/Experiment/ProjectPage'),
    modules: ['ProjectPage']
});
const SegmentPage = MyLoadable({
    loader: () => import('pages/Experiment/SegmentPage'),
    modules: ['SegmentPage']
});
const FeatureFlagPage = MyLoadable({
    loader: () => import('pages/Experiment/FeatureFlagPage'),
    modules: ['FeatureFlagPage']
});

// // Survey
//TODO: Tạm off cho bớt nặng

const SurveyJsPage = MyLoadable({
    loader: () => import('pages/Survey/SurveyJsPage'),
    modules: ['SurveyJsPage']
});
const GroupSurveyPage = MyLoadable({
    loader: () => import('pages/Survey/GroupSurveyPage'),
    modules: ['GroupSurveyPage']
});

// Headhunt
const HeadHuntCustomerPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/CustomerPage'),
    modules: ['HeadHuntCustomerPage']
});
const HeadHuntGroupPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/GroupPage'),
    modules: ['HeadHuntGroupPage']
});
const HeadHuntCampaignPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/CampaignPage'),
    modules: ['HeadHuntCampaignPage']
});
const HeadHuntResumePage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/ResumePage'),
    modules: ['HeadHuntResumePage']
});
const HeadHuntJobPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/JobPage'),
    modules: ['HeadHuntJobPage']
});
const HeadHuntRecruitmentPipelinePage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/RecruitmentPipelinePage'),
    modules: ['HeadHuntRecruitmentPipelinePage']
});
const HeadHuntEmployerPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/EmployerPage'),
    modules: ['HeadHuntEmployerPage']
});
const HeadHuntSalesOrderPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/SalesOrderPage'),
    modules: ['HeadHuntSalesOrderPage']
});
const HeadHuntSalesOrderEditPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/SalesOrderEditPage'),
    modules: ['HeadHuntSalesOrderEditPage']
});
const HeadHuntContractPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/ContractPage'),
    modules: ['HeadHuntContractPage']
});
const HeadHuntSkuPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/SkuPage'),
    modules: ['HeadHuntSkuPage']
});

const HeadHuntApplicantStatusPage = MyLoadable({
    loader: () => import('pages/HeadhuntPage/ApplicantStatusPage'),
    modules: ['HeadHuntApplicantStatusPage']
});
const HeadHuntAcceptanceRecordPage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/AcceptanceRecordPage'),
    modules: ['HeadHuntAcceptanceRecordPage']
});
const HeadHuntEmailTemplatePage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/TemplateMailPage'),
    modules: ['HeadHuntEmailTemplatePage']
});
const HeadHuntRecruitmentRequestPage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/RecruitmentRequestPage'),
    modules: ['HeadHuntRecruitmentRequestPage']
});
const HeadHuntStatisticSalesOrderPage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/StatisticSalesOrderPage'),
    modules: ['HeadHuntStatisticSalesOrderPage']
});
const HeadHuntSearchCandidatePage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/SearchCandidatePage'),
    modules: ['HeadHuntSearchCandidatePage']
});
const HeadHuntApplicantAcceptancePage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/ApplicantAcceptancePage'),
    modules: ['HeadHuntApplicantAcceptancePage']
});
const HeadHuntReportRecruitPage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/ReportRecruitPage'),
    modules: ['HeadHuntReportRecruitPage']
});
const HeadHuntSourceJobRequestPage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/SourceJobRequestPage'),
    modules: ['HeadHuntSourceJobRequestPage']
});
const HeadHuntCandidateBankPage = MyLoadable({
    loader: () => import(/* webpackChunkName: "components/[request]" */'pages/HeadhuntPage/CandidateBankPage'),
    modules: ['HeadHuntCandidateBankPage']
});
// SOv2
const SalesOrderV2Page = MyLoadable({
    loader: () => import('pages/SalesOrder/SalesOrderPage'),
    modules: ['SalesOrderV2Page']
});
const SalesOrderEditV2Page = MyLoadable({
    loader: () => import('pages/SalesOrder/SalesOrderEditPage'),
    modules: ['SalesOrderEditV2Page']
});
const CategoryPage = MyLoadable({
    loader: () => import('pages/SalesOrder/CategoryPage'),
    modules: ['CategoryPage']
});
const SkuPage = MyLoadable({
    loader: () => import('pages/SalesOrder/SkuPage'),
    modules: ['SkuPage']
});
const ProductPackagePage = MyLoadable({
    loader: () => import('pages/SalesOrder/ProductPackagePage'),
    modules: ['ProductPackagePage']
});
const PriceListNewPage = MyLoadable({
    loader: () => import('pages/SalesOrder/PriceListPage'),
    modules: ['PriceListPage']
});
const PriceListDetailNewPage = MyLoadable({
    loader: () => import('pages/SalesOrder/PriceListDetailPage'),
    modules: ['PriceListDetailPage']
});
const PromotionProgramPage = MyLoadable({
    loader: () => import('pages/SalesOrder/PromotionProgramPage'),
    modules: ['PromotionProgramPage']
});
const EmployerResignV2Page = MyLoadable({
    loader: () => import('pages/SalesOrder/EmployerResignPage'),
    modules: ['EmployerResignPage']
});
const ExchangeSalesOrderPageV2 = MyLoadable({
    loader: () => import('pages/SalesOrder/ExchangeSalesOrderPage'),
    modules: ['ExchangeSalesOrderPageV2']
});
// Email Marketing
const EmailMarketingGroupCampaignPage = MyLoadable({
    loader: () => import('pages/EmailMarketing/GroupCampaignPage'),
    modules: ['EmailMarketingGroupCampaignPage']
});
const EmailMarketingCampaignPage = MyLoadable({
    loader: () => import('pages/EmailMarketing/CampaignPage'),
    modules: ['EmailMarketingCampaignPage']
});
const EmailMarketingTemplateMailPage = MyLoadable({
    loader: () => import('pages/EmailMarketing/TemplateMailPage'),
    modules: ['EmailMarketingTemplateMailPage']
});
const EmailMarketingListContactPage = MyLoadable({
    loader: () => import('pages/EmailMarketing/ListContactPage'),
    modules: ['EmailMarketingListContactPage']
});

//Account Service
const AccountServiceGroupCustomerCarePage = MyLoadable({
    loader: () => import('pages/AccountService/GroupCustomerCarePage'),
    modules: ['AccountServiceGroupCustomerCarePage']
});
const AccountServiceCampaignPage = MyLoadable({
    loader: () => import('pages/AccountService/CampaignPage'),
    modules: ['AccountServiceCampaignPage']
});

const AccountServiceApplicantPage = MyLoadable({
    loader: () => import('pages/AccountService/ApplicantPage'),
    modules: ['AccountServiceApplicantPage']
});

const AccountServiceEmailTemplatePage = MyLoadable({
    loader: () => import('pages/AccountService/EmailTemplatePage'),
    modules: ['AccountServiceEmailTemplatePage']
});

const AccountServiceSearchResumeCampaignPage = MyLoadable({
    loader: () => import('pages/AccountService/SearchResumeCampaign'),
    modules: ['AccountServiceEmailTemplatePage']
});

const AccountServiceSearchResumePage = MyLoadable({
    loader: () => import('pages/AccountService/SearchResume'),
    modules: ['AccountServiceSearchResumePage']
});

// Gamification
const GamificationChallengesCategoryPage = MyLoadable({
    loader: () => import('pages/Gamification/ChallengesCategoryPage'),
    modules: ['GamificationChallengesCategoryPage']
});
const GamificationChallengesPage = MyLoadable({
    loader: () => import('pages/Gamification/ChallengesPage'),
    modules: ['GamificationChallengesPage']
});
const GamificationEventPage = MyLoadable({
    loader: () => import('pages/Gamification/EventPage'),
    modules: ['GamificationEventPage']
});
const GamificationRewardPage = MyLoadable({
    loader: () => import('pages/Gamification/RewardPage'),
    modules: ['GamificationRewardPage']
});
const GamificationPointPage = MyLoadable({
    loader: () => import('pages/Gamification/PointPage'),
    modules: ['GamificationPointPage']
});
const GamificationRewardConditionPage = MyLoadable({
    loader: () => import('pages/Gamification/RewardConditionPage'),
    modules: ['GamificationRewardConditionPage']
});
const GamificationRewardConfigPage = MyLoadable({
    loader: () => import('pages/Gamification/RewardConfigPage'),
    modules: ['GamificationRewardConfigPage']
});

// Zalo ZNS
const ZaloZNSGroupCampaignPage = MyLoadable({
    loader: () => import('pages/ZaloZNS/GroupCampaignPage'),
    modules: ['ZaloZNSGroupCampaignPage']
});
const ZaloZNSCampaignPage = MyLoadable({
    loader: () => import('pages/ZaloZNS/CampaignPage'),
    modules: ['ZaloZNSCampaignPage']
});
const ZaloZNSTemplatePage = MyLoadable({
    loader: () => import('pages/ZaloZNS/TemplatePage'),
    modules: ['ZaloZNSTemplatePage']
});
const ZaloZNSListContactPage = MyLoadable({
    loader: () => import('pages/ZaloZNS/ListContactPage'),
    modules: ['ZaloZNSListContactPage']
});

// Hotline
const HotlineListContactPage = MyLoadable({
    loader: () => import('pages/Hotline/ListContactHotlinePage'),
    modules: ['HotlineListContactPage']
});

//Commit CV
const CommitCVPage = MyLoadable({
    loader: () => import('pages/SalesOrder/CommitCVPage'),
    modules: ['CommitCVPage']
});

const ScanCvPage = MyLoadable({
    loader: () => import('pages/ScanCvPage/Add'),
    modules: ['ScanCvPage']
});

const ScanCvListPage = MyLoadable({
    loader: () => import('pages/ScanCvPage/ListCvScan'),
    modules: ['ScanCvListPage']
});

const withLayout = (LayoutComp, ComponentComp, props, componentProps) =>
    <LayoutComp {...props}><ComponentComp {...{...props, ...componentProps}} /></LayoutComp>;

export default () => (
    <Switch>
        <Route exact path={Constant.BASE_URL} render={(props) => withLayout(LayoutMain, HomePage, props)}/>
        <Route path={Constant.BASE_URL_SIGNIN} render={(props) => withLayout(LayoutAuth, LoginOauthPage, props)}/>
        <Route path={Constant.BASE_URL_CHANGE_PASS}
               render={(props) => withLayout(LayoutAuth, ChangePasswordPage, props)}/>
        <Route path={Constant.BASE_URL_OTP} render={(props) => withLayout(LayoutAuth, OtpPage, props)}/>
        <Route path={Constant.BASE_URL_ERROR} render={(props) => withLayout(LayoutMain, ErrorPage, props)}/>
        {/*customer care */}
        <Route path={Constant.BASE_URL_EMPLOYER} render={(props) => withLayout(LayoutMain, EmployerPage, {
            ...props,
            defaultQuery: {status_not: Constant.STATUS_DELETED}
        })}/>
        <Route path={Constant.BASE_URL_SEARCH_INFORMATION_LOOKUP} render={(props) => withLayout(LayoutMain, CustomerInformationLookup, props)}/>
        <Route path={Constant.BASE_URL_COMMIT_CV}
               render={(props) => withLayout(LayoutMain, CommitCVPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_SME_30} render={(props) => withLayout(LayoutMain, EmployerPageSME,
            {
                ...props,
                defaultQuery: {status_not: Constant.STATUS_DELETED},
            }
        )}/>
        <Route path={Constant.BASE_URL_ARCHIVED_EMPLOYER} render={(props) => withLayout(LayoutMain, EmployerPage, {
            ...props,
            is_archived: true,
            defaultQuery: {status: Constant.STATUS_DELETED}
        }, {key: Constant.BASE_URL_ARCHIVED_EMPLOYER})}/>
        <Route path={Constant.BASE_URL_SEARCH_EMPLOYER} render={(props) => withLayout(LayoutMain, EmployerPage, {
            ...props,
            is_search_employer: true,
            defaultQuery: {ignore_assigned_staff: 1}
        }, {key: Constant.BASE_URL_ARCHIVED_EMPLOYER})}/>
        <Route path={Constant.BASE_URL_EMPLOYER_FILTER}
               render={(props) => withLayout(LayoutMain, EmployerFilterPage, props)}/>
        <Route path={Constant.BASE_URL_JOB} render={(props) => withLayout(LayoutMain, JobPage, {
            ...props,
            defaultQuery: {status_not: Constant.STATUS_DELETED}
        })}/>
        <Route path={Constant.BASE_URL_JOB_FREEMIUM} render={(props) => withLayout(LayoutMain, JobFreemiumPage, {
            ...props,
            defaultQuery: {status_not: Constant.STATUS_DELETED}
        })}/>
        <Route path={Constant.BASE_URL_ARCHIVED_JOB} render={(props) => withLayout(LayoutMain, JobPage, {
            ...props,
            is_archived: true,
            defaultQuery: {job_status: Constant.STATUS_DELETED}
        }, {key: Constant.BASE_URL_ARCHIVED_JOB})}/>
        <Route path={Constant.BASE_URL_CALL_HISTORY}
               render={(props) => withLayout(LayoutMain, CallHistoryPage, props)}/>
        <Route path={Constant.BASE_URL_CALL_MOBILE_HISTORY}
               render={(props) => withLayout(LayoutMain, CallMobileHistoryPage, props)}/>
        <Route path={Constant.BASE_URL_CALL_STATISTIC}
               render={(props) => withLayout(LayoutMain, CallStatisticPage, props)}/>
        <Route path={Constant.BASE_URL_CALL_MOBILE_STATISTIC}
               render={(props) => withLayout(LayoutMain, CallMobileStatisticPage, props)}/>
        <Route path={Constant.BASE_URL_CALL_EVALUATE}
               render={(props) => withLayout(LayoutMain, CallEvaluatePage, props)}/>
        <Route path={Constant.BASE_URL_STATISTIC_REMOVED_EMPLOYER}
               render={(props) => withLayout(LayoutMain, StatisticRemovedEmployerPage, props)}/>
        <Route path={Constant.BASE_URL_STATISTIC_EMPLOYER_BY_STAFF}
               render={(props) => withLayout(LayoutMain, StatisticEmployerByStaffPage, props)}/>
        <Route path={Constant.BASE_URL_STATISTIC_EMPLOYER}
               render={(props) => withLayout(LayoutMain, StatisticEmployerPage, props)}/>
        <Route path={Constant.BASE_URL_PLANNING_TRACKING}
               render={(props) => withLayout(LayoutMain, PlanTrackingPage, props)}/>
        <Route path={Constant.BASE_URL_PLANNING_MONTH}
               render={(props) => withLayout(LayoutMain, PlanMonthPage, props)}/>
        <Route path={Constant.BASE_URL_PLANNING_WEEK} render={(props) => withLayout(LayoutMain, PlanWeekPage, props)}/>
        <Route path={Constant.BASE_URL_PLANNING_DAILY_REVENUE}
               render={(props) => withLayout(LayoutMain, PlanDailyRevenuePage, props)}/>
        <Route path={Constant.BASE_URL_PLANNING_TOMORROW}
               render={(props) => withLayout(LayoutMain, PlanTomorrowPage, props)}/>
        <Route exact path={Constant.BASE_URL_BOOKING} render={(props) => withLayout(LayoutMain, BookingPage, props)}/>
        <Route path={Constant.BASE_URL_BOOKING_BOX} render={(props) => withLayout(LayoutMain, BookingBoxPage, props)}/>
        <Route path={Constant.BASE_URL_BOOKING_JOB} render={(props) => withLayout(LayoutMain, BookingJobPage, props)}/>
        <Route exact path={Constant.BASE_URL_SALES_SERVICE_PRICE}
               render={(props) => withLayout(LayoutMain, SalesOrderPricePage, props)}/>
        <Route path={Constant.BASE_URL_ADD_SALES_SERVICE_PRICE}
               render={(props) => withLayout(LayoutMain, SalesOrderPriceEditPage, props)}/>
        <Route path={Constant.BASE_URL_EDIT_SALES_SERVICE_PRICE}
               render={(props) => withLayout(LayoutMain, SalesOrderPriceEditPage, props)}/>
        <Route exact path={Constant.BASE_URL_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, SalesOrderPage, props)}/>
        <Route path={Constant.BASE_URL_ADD_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, SalesOrderEditPage, props)}/>
        <Route path={Constant.BASE_URL_EDIT_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, SalesOrderEditPage, props)}/>
        <Route exact path={Constant.BASE_URL_SEARCH_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, SearchSalesOrderPage, props)}/>
        <Route path={Constant.BASE_URL_EDIT_SALES_ORDER_REQUEST}
               render={(props) => withLayout(LayoutMain, SalesOrderRequestPage, props)}/>
        <Route path={Constant.BASE_URL_ASSIGNMENT_REQUEST}
               render={(props) => withLayout(LayoutMain, AssignmentRequestPage, props)}/>
        <Route path={Constant.BASE_URL_HISTORY_APPROVE_ASSIGNMENT_REQUEST}
               render={(props) => withLayout(LayoutMain, HistoryApproveAssignmentRequestPage, props)}/>
        <Route path={Constant.BASE_URL_RUNNING_SERVICE_MANAGE}
               render={(props) => withLayout(LayoutMain, RunningServiceManagePage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_IMAGE_PENDING}
               render={(props) => withLayout(LayoutMain, EmployerImagePendingPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_IMAGE_DAY}
               render={(props) => withLayout(LayoutMain, EmployerImageDayPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_NOT_DISTURB}
               render={(props) => withLayout(LayoutMain, EmployerNotDisturb, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_NOT_DISTURB_SEARCH}
               render={(props) => withLayout(LayoutMain, EmployerNotDisturbSearch, props)}/>
        <Route path={Constant.BASE_URL_JOB_DAILY} render={(props) => withLayout(LayoutMain, JobDailyPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_NOT_ALLOWED}
               render={(props) => withLayout(LayoutMain, EmployerNotNotAllowed, props)}/>
        <Route path={Constant.BASE_URL_JOB_REFRESH_HISTORY}
               render={(props) => withLayout(LayoutMain, HistoryRefreshJobPage, props)}/>
        <Route path={Constant.BASE_URL_GUARANTEE_JOB}
               render={(props) => withLayout(LayoutMain, GuaranteeJobPage, props)}/>
        <Route path={Constant.BASE_URL_GUARANTEE_REPORT}
               render={(props) => withLayout(LayoutMain, ResumeReportPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_NOT_POTENTIAL}
               render={(props) => withLayout(LayoutMain, EmployerNotPotentialPage, props)}/>
        <Route path={Constant.BASE_URL_CUSTOMER}
               render={(props) => withLayout(LayoutMain, CustomerEmployerPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_RESIGN}
               render={(props) => withLayout(LayoutMain, EmployerResignPage, props)}/>
        <Route path={Constant.BASE_URL_SEARCH_CHECK_EMAIL}
               render={(props) => withLayout(LayoutMain, SearchCheckEmailPage, props)}/>
        <Route path={Constant.BASE_URL_HISTORY_SERVICE_MANAGER}
               render={(props) => withLayout(LayoutMain, HistoryServiceManagerPage, props)}/>
        <Route path={Constant.BASE_URL_HISTORY_SERVICE_VTN}
               render={(props) => withLayout(LayoutMain, HistoryServiceVtnPage, props)}/>
        <Route path={Constant.BASE_URL_SEARCH_EMAIL_CUSTOMER}
               render={(props) => withLayout(LayoutMain, SearchEmailCustomerPage, props)}/>
        <Route path={Constant.BASE_URL_CONFIG_SERVICE_GIFT}
               render={(props) => withLayout(LayoutMain, ConfigServiceGiftPage, props)}/>
        <Route path={Constant.BASE_URL_TOOL_TRANSFER_EMPLOYER_ASSIGNMENT}
               render={(props) => withLayout(LayoutMain, ToolTransferEmployerAssignmentPage, props)}/>
        <Route path={Constant.BASE_URL_TOOL_TRANSFER_GET_EMPLOYER}
               render={(props) => withLayout(LayoutMain, ToolTransferStepGetEmployerPage, props)}/>
        <Route path={Constant.BASE_URL_TOOL_TRANSFER_PROCESS}
               render={(props) => withLayout(LayoutMain, ToolTransferStepProcessPage, props)}/>
        <Route path={Constant.BASE_URL_POINT_GIFT_MANAGE}
               render={(props) => withLayout(LayoutMain, PointGiftPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_INTERNAL}
               render={(props) => withLayout(LayoutMain, EmployerInternalPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_TRIAL}
               render={(props) => withLayout(LayoutMain, EmployerTrialPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_FREEMIUM}
               render={(props) => withLayout(LayoutMain, EmployerFreemiumPage, props)}/>
        <Route path={Constant.BASE_URL_QUOTATION_REQUEST}
               render={(props) => withLayout(LayoutMain, QuotationRequestPage, props)}/>
        <Route path={Constant.BASE_URL_FIELD_QUOTATION_REQUEST}
               render={(props) => withLayout(LayoutMain, FieldQuotationRequestPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_CLASSIFICATION}
               render={(props) => withLayout(LayoutMain, EmployerClassPage, props)}/>
        <Route path={Constant.BASE_URL_JD_TEMPLATE}
               render={(props) => withLayout(LayoutMain, JDTemplatePage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_WITH_PROMOTION_CODE}
                render={(props) => withLayout(LayoutMain, EmployerWithPromotionCode, props)}/>
        <Route path={Constant.BASE_URL_BANNER_PAGE}
        render={(props) => withLayout(LayoutMain, BannerPage, props)}/>
        <Route path={Constant.BASE_URL_LANG_PAGE}
               render={(props) => withLayout(LayoutMain, LangPage, props)}/>

        {/*Seeker care*/}
        <Route exact path={Constant.BASE_URL_SEEKER_CARE_SEEKER}
               render={(props) => withLayout(LayoutMain, SeekerPage, props)}/>
        <Route exact path={Constant.BASE_URL_SEEKER_CARE_SEEKER_DETAIL_HIDE_CONTACT}
               render={(props) => withLayout(LayoutMain, SeekerDetailHideContactPage, props)}/>
        <Route path={Constant.BASE_URL_RESUME_DELETE} render={(props) => withLayout(LayoutMain, ResumePage, {
            ...props,
            is_archived: true,
            defaultQuery: {status: Constant.STATUS_DELETED}
        }, {key: Constant.BASE_URL_SEEKER_DELETE})}/>
        <Route path={Constant.BASE_URL_SEEKER_DELETE} render={(props) => withLayout(LayoutMain, SeekerPage, {
            ...props,
            is_archived: true,
            defaultQuery: {status: Constant.STATUS_DELETED}
        }, {key: Constant.BASE_URL_RESUME_DELETE})}/>
        <Route path={Constant.BASE_URL_SEEKER_CARE_STATISTIC_SEEKER}
               render={(props) => withLayout(LayoutMain, StatisticSeekerPage, props)}/>
        <Route path={Constant.BASE_URL_SEEKER_RESUME} render={(props) => withLayout(LayoutMain, ResumePage, props)}/>
        <Route path={Constant.BASE_URL_SEEKER_RESUME_APPLIED_HISTORY} render={(props) => withLayout(LayoutMain, ResumeHistoryPage, props)}/>
        <Route path={Constant.BASE_URL_SEEKER_CARE_STATISTIC_RESUME}
               render={(props) => withLayout(LayoutMain, StatisticResumePage, props)}/>
        <Route path={Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP}
               render={(props) => withLayout(LayoutMain, ResumeStepByStepPage, props)}/>
        <Route path={Constant.BASE_URL_SEEKER_RESUME_ATTACH}
               render={(props) => withLayout(LayoutMain, ResumeAttachPage, props)}/>
        <Route path={Constant.BASE_URL_RESUME_TEMPLATE}
               render={(props) => withLayout(LayoutMain, ResumeTemplatePage, props)}/>
        <Route path={Constant.BASE_URL_RESUME_DAILY}
               render={(props) => withLayout(LayoutMain, ResumeDailyPage, props)}/>
        <Route path={Constant.BASE_URL_SEEKER_SERVICE}
               render={(props) => withLayout(LayoutMain, SeekerServicePage, props)}/>
        {/*QA*/}
        <Route path={Constant.BASE_URL_QA_CALL_HISTORY}
               render={(props) => withLayout(LayoutMain, CallHistoryPage, props)}/>
        <Route path={Constant.BASE_URL_QA_STATISTIC_CALL}
               render={(props) => withLayout(LayoutMain, CallStatisticPage, {...props, is_qa: true})}/>
        <Route path={Constant.BASE_URL_QA_VIOLATION}
               render={(props) => withLayout(LayoutMain, CallViolationPage, props)}/>
        <Route path={Constant.BASE_URL_QA_MASTER_SCRORING}
               render={(props) => withLayout(LayoutMain, CallMasterScoringPage, props)}/>
        <Route path={Constant.BASE_URL_QA_TIME_FRAME} render={(props) => withLayout(LayoutMain, TimeFramePage, props)}/>
        <Route path={Constant.BASE_URL_QA_CALL_LINE_STATISTIC}
               render={(props) => withLayout(LayoutMain, CallLineStatisticPage, {
                   ...props,
                   defaultQuery: {"date[from]": moment().unix(), "date[to]": moment().unix()}
               })}/>
        <Route path={Constant.BASE_URL_HISTORY_APPROVE_ASSIGNMENT_REQUEST}
               render={(props) => withLayout(LayoutMain, HistoryApproveAssignmentRequestPage, props)}/>
        {/*QC*/}
        <Route exact path={Constant.BASE_URL_QC_JOB_SUPPORT}
               render={(props) => withLayout(LayoutMain, JobSupportPage, props)}/>
        <Route path={Constant.BASE_URL_QC_JOB_SUPPORT_LOGGING}
               render={(props) => withLayout(LayoutMain, JobSupportLoggingPage, props)}/>
        <Route path={Constant.BASE_URL_QC_JOB_SUPPORT_TRACKING}
               render={(props) => withLayout(LayoutMain, JobSupportTrackingPage, props)}/>
        <Route path={Constant.BASE_URL_QC_JOB_SUPPORT_PREVIEW}
               render={(props) => withLayout(LayoutMain, JobSupportPreviewPage, props)}/>
        <Route path={Constant.BASE_URL_QC_NOTIFY_WEB}
               render={(props) => withLayout(LayoutMain, NotificationWebsitePage, props)}/>
        <Route path={Constant.BASE_URL_QC_DIVIDE_EMPLOYER}
               render={(props) => withLayout(LayoutMain, DivideEmployerPage, props)}/>
        <Route path={Constant.BASE_URL_QC_EMPLOYER} render={(props) => withLayout(LayoutMain, EmployerPage, props)}/>
        <Route path={Constant.BASE_URL_QC_CUSTOMER_SERVICE}
               render={(props) => withLayout(LayoutMain, CustomerServicePage, props)}/>
        <Route path={Constant.BASE_URL_QC_CUSTOMER_ROOM} render={(props) => withLayout(LayoutMain, RoomPage, props)}/>
        <Route path={Constant.BASE_URL_QC_VIOLATION}
               render={(props) => withLayout(LayoutMain, CallViolationPage, props)}/>
        <Route path={Constant.BASE_URL_QC_KEYWORD} render={(props) => withLayout(LayoutMain, BlockKeywordPage, props)}/>
        <Route path={Constant.BASE_URL_AUTH_HOTLINE_WEBSITE}
               render={(props) => withLayout(LayoutMain, HotlineWebsitePage, props)}/>
        <Route path={Constant.BASE_URL_POINT_GUARANTEE}
               render={(props) => withLayout(LayoutMain, EmployerPointResumeGuarantee, props)}/>
        <Route path={Constant.BASE_URL_RUNNING_BANNER}
               render={(props) => withLayout(LayoutMain, RunningBannerPage, props)}/>
        <Route path={Constant.BASE_URL_REQUIREMENT_APPROVE}
               render={(props) => withLayout(LayoutMain, RequirementApprovePage, props)}/>
        <Route path={Constant.BASE_URL_APPROVE_ASSIGNMENT_REQUEST}
               render={(props) => withLayout(LayoutMain, ApproveAssignmentRequestPage, props)}/>
        <Route path={Constant.BASE_URL_QC_FILTER_JOB} render={(props) => withLayout(LayoutMain, FilterJobPage, {
            ...props,
            defaultQuery: {status: Constant.STATUS_ACTIVED}
        })}/>
        <Route path={Constant.BASE_URL_QC_COMPLAIN} render={(props) => withLayout(LayoutMain, ComplainPage, props)}/>
        <Route path={Constant.BASE_URL_DIVIDE_NEW_ACCOUNT} render={(props) => withLayout(LayoutMain, DivideNewPage, {
            ...props,
            defaultQuery: {throwout_type: Constant.TYPE_DIVIDE_NEW}
        })}/>
        <Route path={Constant.BASE_URL_DIVIDE_OLD_ACCOUNT} render={(props) => withLayout(LayoutMain, DivideOldPage, {
            ...props,
            defaultQuery: {throwout_type: Constant.TYPE_DIVIDE_OLD, type: Constant.TYPE_DIVIDE_OLD}
        })}/>
        <Route path={Constant.BASE_URL_CUSTOMER_SUGGEST}
               render={(props) => withLayout(LayoutMain, CustomerSuggest, props)}/>
        <Route path={Constant.BASE_URL_EXCHANGE_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, ExchangeSalesOrderPage, props)}/>
        <Route path={Constant.BASE_URL_CREDIT_EMPLOYER}
               render={(props) => withLayout(LayoutMain, CreditEmployerPage, props)}/>
        <Route path={Constant.BASE_URL_REGISTER_ADVISORY}
               render={(props) => withLayout(LayoutMain, RegisterAdvisory, props)}/>

        {/*system*/}
        <Route path={Constant.BASE_URL_SYSTEM_TEMPLATE_MAIL}
               render={(props) => withLayout(LayoutMain, TemplateMailPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_COMMON_DATA}
               render={(props) => withLayout(LayoutMain, CommonDataPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_UPLOAD}
               render={(props) => withLayout(LayoutMain, UploadPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_DOCUMENT_GUIDE}
               render={(props) => withLayout(LayoutMain, DocumentGuidePage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_GATE_JOB_FIELD}
               render={(props) => withLayout(LayoutMain, GateJobFieldPage, props)}/>
        <Route path={Constant.BASE_URL_INFO_CONTRACT}
               render={(props) => withLayout(LayoutMain, InfoContractPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_UPPERCASE_KEYWORD}
               render={(props) => withLayout(LayoutMain, UppercaseKeywordPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_FORBIDDEN_KEYWORD}
            render={(props) => withLayout(LayoutMain, ForbiddenKeywordPage, props)} />
        <Route path={Constant.BASE_URL_SYSTEM_CONFIG} render={(props) => withLayout(LayoutMain, ConfigPage, props)}/>
        <Route path={Constant.BASE_URL_STATTISTIC_SYSTEM}
               render={(props) => withLayout(LayoutMain, StatisticPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_CONFIG_LIST_SHARE_ROOM}
               render={(props) => withLayout(LayoutMain, ShareRoomListPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_CONFIG_RULE_SHARE_ROOM}
               render={(props) => withLayout(LayoutMain, ShareRoomRulePage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_CONFIG_LIST_SHARE_BASKET}
               render={(props) => withLayout(LayoutMain, ShareBasketListPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_CONFIG_RULE_SHARE_BASKET}
               render={(props) => withLayout(LayoutMain, ShareBasketRulePage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_LIST_EMPLOYER_SHARE_BASKET}
               render={(props) => withLayout(LayoutMain, ShareBasketDetailListPage, props)}/>
        <Route path={Constant.BASE_URL_SYSTEM_PAYMENT_REQUEST}
               render={(props) => withLayout(LayoutMain, PaymentRequestPage, props)}/>
        {/*auth*/}
        <Route path={Constant.BASE_URL_AUTH_STAFF} render={(props) => withLayout(LayoutMain, StaffPage, props)}/>
        <Route path={Constant.BASE_URL_AUTH_DIVISION} render={(props) => withLayout(LayoutMain, DivisionPage, props)}/>
        <Route path={Constant.BASE_URL_AUTH_PERMISSION}
               render={(props) => withLayout(LayoutMain, PermissionPage, props)}/>
        <Route path={Constant.BASE_URL_AUTH_ACTION} render={(props) => withLayout(LayoutMain, ActionPage, props)}/>
        {/*accountant*/}
        <Route path={Constant.BASE_URL_ACCOUNTANT_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, SalesOrderApprovePage, props)}/>
        <Route path={Constant.BASE_URL_SALES_ORDER_APPROVE_DROP}
               render={(props) => withLayout(LayoutMain, SalesOrderApproveDropPage, props)}/>
        <Route path={Constant.BASE_URL_SALES_ORDER_APPROVE_SERVICE}
               render={(props) => withLayout(LayoutMain, SalesOrderServiceApprovePage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_PRODUCT_PRICE_RECONTRACK}
               render={(props) => withLayout(LayoutMain, PriceRecontractPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_SALES_ORDER_APPROVE_CHANGE_EMAIL_INVOICES}
               render={(props) => withLayout(LayoutMain, ApproveRequestChangeRequestInvoicesPage, props)}/>
        <Route path={Constant.BASE_URL_PRODUCT_PRICE_LIST}
               render={(props) => withLayout(LayoutMain, PriceListPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_CUSTOMER}
               render={(props) => withLayout(LayoutMain, CustomerPage, props)}/>
        <Route exact path={Constant.BASE_URL_ACCOUNTANT_BOOKING}
               render={(props) => withLayout(LayoutMain, AccBookingPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_BOOKING_JOB}
               render={(props) => withLayout(LayoutMain, BookingJobPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_BOOKING_BOX}
               render={(props) => withLayout(LayoutMain, BookingBoxPage, props)}/>
        <Route path={Constant.BASE_URL_BOOKING_BANNER}
               render={(props) => withLayout(LayoutMain, BookingBannerPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_BOOKING_BANNER_BOX}
               render={(props) => withLayout(LayoutMain, BookingBannerBoxPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_BOOKING_BANNER_JOX}
               render={(props) => withLayout(LayoutMain, BookingBannerJobPage, props)}/>
        <Route path={Constant.BASE_URL_SALES_ORDER_APPROVE_REQUEST}
               render={(props) => withLayout(LayoutMain, SalesOrderRegisCancelApprovePage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_CAMPAIGN}
               render={(props) => withLayout(LayoutMain, CampaignPage, props)}/>
        <Route path={Constant.BASE_URL_PROMOTION_PROGRAMS}
               render={(props) => withLayout(LayoutMain, PromotionProgramsPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNTANT_PRODUCT_GROUP}
               render={(props) => withLayout(LayoutMain, ProductGroupPage, props)}/>
        <Route path={Constant.BASE_URL_BUNDLES_PACKAGE_PAGE}
               render={(props) => withLayout(LayoutMain, BundlesPackagePage, props)}/>
        <Route path={Constant.BASE_URL_COMBO_PACKAGE_PAGE}
               render={(props) => withLayout(LayoutMain, ComboPackagePage, props)}/>
        <Route path={Constant.BASE_URL_COMBO_POSTING_PACKAGE_PAGE}
               render={(props) => withLayout(LayoutMain, ComboPostingPackagePage, props)}/>
        <Route path={Constant.BASE_URL_SUBSCRIPTION_PACKAGE_PAGE}
               render={(props) => withLayout(LayoutMain, SubscriptionPackagePage, props)}/>
        <Route path={Constant.BASE_URL_OFFER_INCREASING_CONFIG_PAGE}
            render={(props) => withLayout(LayoutMain, OfferIncreasingConfigPage, props)}/>
        <Route path={Constant.BASE_URL_CONFIG_GIFT_SERVICE_PACKAGE_PAGE}
               render={(props) => withLayout(LayoutMain, ConfigGiftServicePackagePage, props)}/>
        <Route path={Constant.BASE_URL_GROUP_CAMPAIGN_PAGE}
               render={(props) => withLayout(LayoutMain, GroupCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_GROUP_SALES_ORDER_CONVERT_PAGE}
               render={(props) => withLayout(LayoutMain, SalesOrderConvertPage, props)}/>
         <Route path={Constant.BASE_URL_SALES_OPS_APPROVE_SALES_ORDER}
                render={(props) => withLayout(LayoutMain, SalesOrderApprovePage, props)}/>

        {/*Article*/}
        <Route path={Constant.BASE_URL_ARTICLE_POST}
               render={(props) => withLayout(LayoutMain, ArticlePostPage, props)}/>
        <Route path={Constant.BASE_URL_ARTICLE_QUESTION}
               render={(props) => withLayout(LayoutMain, ArticleQuestionPage, props)}/>
        <Route path={Constant.BASE_URL_SEO_META} render={(props) => withLayout(LayoutMain, SeoMetaPage, props)}/>
        {/*SEO*/}
        <Route path={Constant.BASE_URL_TAG} render={(props) => withLayout(LayoutMain, TagPage, props)}/>
        {/*Revenue*/}
        <Route path={Constant.BASE_URL_REVENUE_DAILY}
               render={(props) => withLayout(LayoutMain, RevenueDailyPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_CONFIG}
               render={(props) => withLayout(LayoutMain, RevenueConfigPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_OF_STAFF}
               render={(props) => withLayout(LayoutMain, RevenueOfStaffPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_LIST_FOLLOW}
               render={(props) => withLayout(LayoutMain, RevenueListFollowPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_COMMISSION}
               render={(props) => withLayout(LayoutMain, RevenueCommissionPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_COMMISSION_REPORT}
               render={(props) => withLayout(LayoutMain, RevenueCommissionReportPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_COMMISSION_BONUS}
               render={(props) => withLayout(LayoutMain, RevenueBonusPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_RESULT_KPI}
               render={(props) => withLayout(LayoutMain, RevenueResultKPIPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_CONFIG_OF_MONTH}
               render={(props) => withLayout(LayoutMain, RevenueConfigKPIMonthPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_CONFIG_STAFF}
               render={(props) => withLayout(LayoutMain, RevenueConfigStaffPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_CONFIG_GROUP}
               render={(props) => withLayout(LayoutMain, RevenueConfigGroupPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_CONFIG_KPI_STAFF}
               render={(props) => withLayout(LayoutMain, RevenueConfigKPIStaffPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_REPORT_KPI_STAFF}
               render={(props) => withLayout(LayoutMain, RevenueReportKPIStaffPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_REPORT_KPI_STAFF_NEW}
               render={(props) => withLayout(LayoutMain, RevenueReportKPIStaffNewPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_REPORT_REVENUE_STAFF}
               render={(props) => withLayout(LayoutMain, RevenueReportRevenueStaffPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_REPORT_BONUS_STAFF}
               render={(props) => withLayout(LayoutMain, RevenueReportBonusStaffPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_DATA}
               render={(props) => withLayout(LayoutMain, RevenueDataPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_NET_SALE_DATA}
               render={(props) => withLayout(LayoutMain, RevenueNetSaleDataPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_CASH_DATA}
               render={(props) => withLayout(LayoutMain, RevenueCashDataPage, props)}/>
        <Route path={Constant.BASE_URL_REVENUE_REVIEW}
               render={(props) => withLayout(LayoutMain, RevenueReview, props)}/>
        {/*Payment*/}
        <Route path={Constant.BASE_URL_PAYMENT_MANAGE_PAYMENT}
               render={(props) => withLayout(LayoutMain, PaymentPage, props)}/>
        <Route path={Constant.BASE_URL_PAYMENT_MANAGE_STATEMENT}
               render={(props) => withLayout(LayoutMain, StatementPage, props)}/>
        <Route path={Constant.BASE_URL_PAYMENT_MANAGE_TRANSACTION}
               render={(props) => withLayout(LayoutMain, TransactionPage, props)}/>
        <Route path={Constant.BASE_URL_OPPORTUNITY}
               render={(props) => withLayout(LayoutMain, OpportunityPage , props)}/>
        <Route path={Constant.BASE_URL_PAYMENT_MANAGE_BANK}
               render={(props) => withLayout(LayoutMain, BankPage, props)}/>
        {/*Experiment*/}
        <Route path={Constant.BASE_URL_EXPERIMENT_PROJECT}
               render={(props) => withLayout(LayoutMain, ProjectPage, props)}/>
        <Route path={Constant.BASE_URL_EXPERIMENT_EXPERIMENT}
               render={(props) => withLayout(LayoutMain, ExperimentPage, props)}/>
        <Route path={Constant.BASE_URL_EXPERIMENT_SEGMENT}
               render={(props) => withLayout(LayoutMain, SegmentPage, props)}/>
        <Route path={Constant.BASE_URL_EXPERIMENT_FEATURE_FLAG}
               render={(props) => withLayout(LayoutMain, FeatureFlagPage, props)}/>
        {/*Checkmate*/}
        <Route path={Constant.BASE_URL_SALES_ORDER_BY_FIELD}
               render={(props) => withLayout(LayoutMain, SalesOrderByFieldPage, props)}/>
        <Route path={Constant.BASE_URL_FIELD_PRICE_LIST}
               render={(props) => withLayout(LayoutMain, FieldPriceListPage, props)}/>
        <Route path={Constant.BASE_URL_FIELD_PRINT_CHECKMATE}
               render={(props) => withLayout(LayoutMain, FieldPrintTemplatePage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_CHECKMATE}
               render={(props) => withLayout(LayoutMain, EmployerCheckmatePage, props)}/>
        <Route path={Constant.BASE_URL_CALL_HISTORY_CHECKMATE}
               render={(props) => withLayout(LayoutMain, CallHistoryCheckmatePage, props)}/>
        <Route path={Constant.BASE_URL_SALES_ORDER_SCHEDULE}
               render={(props) => withLayout(LayoutMain, SalesOrderSchedulePage, props)}/>
        <Route path={Constant.BASE_URL_REGISTRATION_CHECKMATE}
               render={(props) => withLayout(LayoutMain, FieldRegistrationPage, props)}/>
        <Route path={Constant.BASE_URL_FIELD_PROMOTION_PROGRAMS}
               render={(props) => withLayout(LayoutMain, FieldPromotionProgramsPage, props)}/>
        {/*Rating*/}
        <Route path={Constant.BASE_URL_SURVEY}
               render={(props) => withLayout(LayoutMain, SurveyJsPage, props)}/>
        <Route path={Constant.BASE_URL_GROUP_SURVEY}
            render={(props) => withLayout(LayoutMain, GroupSurveyPage, props)}/>
        {/*Headhunt*/}
        <Route path={Constant.BASE_URL_HEADHUNT_CAMPAIGN}
               render={(props) => withLayout(LayoutMain, HeadHuntCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_CUSTOMER}
               render={(props) => withLayout(LayoutMain, HeadHuntCustomerPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_GROUP}
               render={(props) => withLayout(LayoutMain, HeadHuntGroupPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_RESUME}
               render={(props) => withLayout(LayoutMain, HeadHuntResumePage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_JOB}
               render={(props) => withLayout(LayoutMain, HeadHuntJobPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_RECRUITMENT_PIPELINE}
               render={(props) => withLayout(LayoutMain, HeadHuntRecruitmentPipelinePage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_EMPLOYER}
               render={(props) => withLayout(LayoutMain, HeadHuntEmployerPage, props)}/>
        <Route path={Constant.BASE_URL_ADD_HEADHUNT_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, HeadHuntSalesOrderEditPage, props)}/>
        <Route path={Constant.BASE_URL_EDIT_HEADHUNT_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, HeadHuntSalesOrderEditPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_SALES_ORDER}
               render={(props) => withLayout(LayoutMain, HeadHuntSalesOrderPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_CONTRACT}
               render={(props) => withLayout(LayoutMain, HeadHuntContractPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_SKU}
               render={(props) => withLayout(LayoutMain, HeadHuntSkuPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_APPLICANT_STATUS}
               render={(props) => withLayout(LayoutMain, HeadHuntApplicantStatusPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_ACCEPTANCE_RECORD}
               render={(props) => withLayout(LayoutMain, HeadHuntAcceptanceRecordPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_EMAIL_TEMPLATE}
               render={(props) => withLayout(LayoutMain, HeadHuntEmailTemplatePage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST}
               render={(props) => withLayout(LayoutMain, HeadHuntRecruitmentRequestPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_STATISTIC_SALES_ORDER}
                render={(props) => withLayout(LayoutMain, HeadHuntStatisticSalesOrderPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_SEARCH_CANDIDATE}
               render={(props) => withLayout(LayoutMain, HeadHuntSearchCandidatePage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_APPLICANT_ACCEPTANCE}
               render={(props) => withLayout(LayoutMain, HeadHuntApplicantAcceptancePage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_REPORT_RECRUIT}
               render={(props) => withLayout(LayoutMain, HeadHuntReportRecruitPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_SOURCE_JOB_REQUEST}
               render={(props) => withLayout(LayoutMain, HeadHuntSourceJobRequestPage, props)}/>
        <Route path={Constant.BASE_URL_HEADHUNT_CANDIDATE_BANK}
               render={(props) => withLayout(LayoutMain, HeadHuntCandidateBankPage, props)}/>
        {/*SOv2*/}
        <Route path={Constant.BASE_URL_SALES_ORDER_V2}
               render={(props) => withLayout(LayoutMain, SalesOrderV2Page, props)}/>
        <Route path={Constant.BASE_URL_ADD_SALES_ORDER_V2}
               render={(props) => withLayout(LayoutMain, SalesOrderEditV2Page, props)}/>
        <Route path={Constant.BASE_URL_EDIT_SALES_ORDER_V2}
               render={(props) => withLayout(LayoutMain, SalesOrderEditV2Page, props)}/>
        <Route path={Constant.BASE_URL_CATEGORY}
               render={(props) => withLayout(LayoutMain, CategoryPage, props)}/>
        <Route path={Constant.BASE_URL_SKU}
               render={(props) => withLayout(LayoutMain, SkuPage, props)}/>
        <Route path={Constant.BASE_URL_PRODUCT_PACKAGE}
               render={(props) => withLayout(LayoutMain, ProductPackagePage, props)}/>
        <Route path={Constant.BASE_URL_PRICE_LIST}
               render={(props) => withLayout(LayoutMain, PriceListNewPage, props)}/>
        <Route path={Constant.BASE_URL_PROMOTION_V2}
               render={(props) => withLayout(LayoutMain, PromotionProgramPage, props)}/>
        <Route path={Constant.BASE_URL_EMPLOYER_RESIGN_V2}
               render={(props) => withLayout(LayoutMain, EmployerResignV2Page, props)}/>
        <Route path={Constant.BASE_URL_EXCHANGE_SALES_ORDER_V2}
               render={(props) => withLayout(LayoutMain, ExchangeSalesOrderPageV2, props)}/>
        <Route path={Constant.BASE_URL_PRICE_LIST_DETAIL}
                render={(props) => withLayout(LayoutMain, PriceListDetailNewPage, props)}/>
        {/*EmailMarketing*/}
        <Route path={Constant.BASE_URL_EMAIL_MARKETING_GROUP_CAMPAIGN}
               render={(props) => withLayout(LayoutMain, EmailMarketingGroupCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_EMAIL_MARKETING_CAMPAIGN}
               render={(props) => withLayout(LayoutMain, EmailMarketingCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_EMAIL_MARKETING_TEMPLATE_MAIL}
               render={(props) => withLayout(LayoutMain, EmailMarketingTemplateMailPage, props)}/>
        <Route path={Constant.BASE_URL_EMAIL_MARKETING_LIST_CONTACT}
               render={(props) => withLayout(LayoutMain, EmailMarketingListContactPage, props)}/>

        {/*Account Service*/}
        <Route path={Constant.BASE_URL_ACCOUNT_SERVICE_GROUP}
               render={(props) => withLayout(LayoutMain, AccountServiceGroupCustomerCarePage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNT_SERVICE_CAMPAIGN}
            render={(props) => withLayout(LayoutMain, AccountServiceCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNT_SERVICE_APPLICANT}
               render={(props) => withLayout(LayoutMain, AccountServiceApplicantPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNT_SERVICE_EMAIL_TEMPLATE}
               render={(props) => withLayout(LayoutMain, AccountServiceEmailTemplatePage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN}
            render={(props) => withLayout(LayoutMain, AccountServiceSearchResumeCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_ACCOUNT_SERVICE_SEARCH_RESUME}
            render={(props) => withLayout(LayoutMain, AccountServiceSearchResumePage, props)}/>
        {/*Gamification*/}
        <Route path={Constant.BASE_URL_GAMIFICATION_CHALLENGES_CATEGORY}
               render={(props) => withLayout(LayoutMain, GamificationChallengesCategoryPage, props)}/>
        <Route path={Constant.BASE_URL_GAMIFICATION_CHALLENGES}
               render={(props) => withLayout(LayoutMain, GamificationChallengesPage, props)}/>
        <Route path={Constant.BASE_URL_GAMIFICATION_EVENT}
               render={(props) => withLayout(LayoutMain, GamificationEventPage, props)}/>
        <Route path={Constant.BASE_URL_GAMIFICATION_REWARD}
               render={(props) => withLayout(LayoutMain, GamificationRewardPage, props)}/>
        <Route path={Constant.BASE_URL_GAMIFICATION_POINT}
               render={(props) => withLayout(LayoutMain, GamificationPointPage  , props)}/>
        <Route path={Constant.BASE_URL_GAMIFICATION_REWARD_CONDITION}
               render={(props) => withLayout(LayoutMain, GamificationRewardConditionPage  , props)}/>
        <Route path={Constant.BASE_URL_GAMIFICATION_REWARD_CONFIG}
               render={(props) => withLayout(LayoutMain, GamificationRewardConfigPage  , props)}/>

        {/*Zalo ZNS*/}
        <Route path={Constant.BASE_URL_ZALO_ZNS_GROUP_CAMPAIGN}
               render={(props) => withLayout(LayoutMain, ZaloZNSGroupCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_ZALO_ZNS_CAMPAIGN}
               render={(props) => withLayout(LayoutMain, ZaloZNSCampaignPage, props)}/>
        <Route path={Constant.BASE_URL_ZALO_ZNS_TEMPLATE}
               render={(props) => withLayout(LayoutMain, ZaloZNSTemplatePage, props)}/>
        <Route path={Constant.BASE_URL_ZALO_ZNS_LIST_CONTACT}
               render={(props) => withLayout(LayoutMain, ZaloZNSListContactPage, props)}/>
 {/*Hotline*/}
        <Route path={Constant.BASE_URL_HOTLINE_LIST_CONTACT_HOTLINE}
               render={(props) => withLayout(LayoutMain, HotlineListContactPage, props)}/>

        <Route path={Constant.BASE_URL_SCAN_CV}
               render={(props) => withLayout(LayoutMain, ScanCvPage , props)}/>
        <Route path={Constant.BASE_URL_SCAN_CV_LIST}
               render={(props) => withLayout(LayoutMain, ScanCvListPage , props)}/>

        {/* */}
        <Route render={(props) => withLayout(LayoutMain, ErrorPage, {
            ...props,
            msg: 'Không tìm thấy trang. Vui lòng thử lại ...'
        })}/>
    </Switch>
);
