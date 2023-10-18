/**
 * SYSTEM CONFIGURATION
 */

export const CHANNEL_CODE_TVN = "tvn";
export const CHANNEL_CODE_VTN = "vtn";
export const CHANNEL_CODE_VL24H = "vl24h";
export const CHANNEL_CODE_MW = "mw";
export const CHANNEL_CODE_VL24H_DELETE = "mw.vl24h";
export const CHANNEL_CODE_MW_DELETE = "vl24h.mw";
export const DOMAIN_RECRUITER_VL24H = "vl24h_re";
export const CHANNEL_CODE_TVN_KEEP = "tvn.vl24h";
export const CHANNEL_CODE_TVN_VL24H_KEEP = "vl24h.tvn";
export const CHANNEL_CODE_MW_FROM_TVN = "tvn.vl24h,mw";

export const PAGE_DEFAULT = 1;
export const PER_PAGE_LIMIT = 10;
export const UN_LIMIT_PER_PAGE = 1000;
export const DELAY_LOAD_LIST_2S = 2000;

export const OTP_METHOD_EMAIL = "Email";
export const OTP_STATUS_TRUE = 1;
export const JWT_SECRET_KEY = "TEST";

export const STATUS_CODE_SUCCESS = 200;

export const CHANNEL_LIST = {
  vl24h: "Việc Làm 24H",
  tvn: "Tìm Việc Nhanh",
  vtn: "Việc Tốt Nhất",
  mw: "Mywork",
};

export const BRANCH_ALL = {
  id: null,
  code: null,
  name: "Toàn quốc",
  title: "Toàn quốc",
};

/**
 * TYPE CONFIG
 */
export const LOGIN_STEP_0 = 0;
export const LOGIN_STEP_1 = 1;
export const LOGIN_STEP_2 = 2;

export const LANGUAGE_VIE = "vi";
export const LANGUAGE_EN = "en";

export const PAYMENT_TERM_METHOD_TM = 1; // Tiền mặt
export const PAYMENT_TERM_METHOD_CK = 2; // Chuyển khoản

export const PAYMENT_METHOD_PAY_NOW = 1;

export const VISIBLE_STATUS_SHOW = 1;
export const VISIBLE_STATUS_HIDE = 2;

export const DIVISION_STATUS_ACTIVED = 1;
export const DIVISION_STATUS_LOCKED = 2;

export const DIVISION_TYPE_DRAW = 1;
export const DIVISION_TYPE_DISCHARGE = 2;

export const DIVISION_SEEKER = "seeker";

export const ORDER_BY_NONE = 0;
export const ORDER_BY_ASC = 1;
export const ORDER_BY_DESC = 2;

export const AREA_ALL = 3;

export const SERVICE_TYPE_JOB_BOX = "jobbox";
export const SERVICE_TYPE_JOB_BASIC = "jobbox_basic";
export const SERVICE_TYPE_BANNER = "banner";
export const SERVICE_TYPE_EFFECT = "effect";
export const SERVICE_TYPE_FILTER_RESUME = "filter_resume";
export const SERVICE_TYPE_FILTER_RESUME_2018 = "filter_resume_2018";
export const SERVICE_TYPE_FILTER_MINISITE = "minisite";
export const SERVICE_TYPE_ACCOUNT_SERVICE = "account_service";
export const SERVICE_TYPE_SERVICE_POINT = "service_point";
export const SERVICE_TYPE_JOB_FREEMIUM = "jobbox_freemium";
export const SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME = "account_service_filter_resume";

export const SERVICE_PAGE_TYPE_FIELD = 2;

export const EFFECT_TYPE_REFRESH_HOUR = "refresh_hour";
export const EFFECT_TYPE_REFRESH_DAY = "refresh_day";

export const UNIT_TYPE_POIN = "point";
export const UNIT_TYPE_WEEK = "week";
export const UNIT_TYPE_CV = "cv";
export const UNIT_TYPE_POINT_NEW = "point_new";

export const IS_SEARCH_ALLOWED_YES = 1;
export const IS_SEARCH_ALLOWED_NO = 2;

export const MAIL_NOT_VERIFIED = 2;

export const RESUME_NORMAL = 1;
export const RESUME_NORMAL_FILE = 2;
export const RESUME_ATTACH_FILE = 3;

export const RANK_TYPE_ALL = "type_all";
export const RANK_TYPE_CHANNEL = "type_channel";
export const RANK_TYPE_BRANCH = "type_branch";

export const TEAM_ROLE_LEADER = "leader";

export const JOB_PREMIUM_VIP = 1;
export const JOB_PREMIUM_NORMAL = 3;

export const SERVICE_PAGE_TYPE_HOME_PAGE = 1;
export const SERVICE_PAGE_TYPE_FIELD_PAGE = 2;
export const SERVICE_PAGE_TYPE_GATE_PAGE = 3;

export const IS_FREE_YES = 1;

export const IS_VERIFIED = "verified";

export const RESUME_TYPE_ONLINE = 1;
export const RESUME_TYPE_FILE = 2;
export const RESUME_TYPE_QUICKLY = 3;
export const RESUME_QUICKLY_NAME = "Hồ sơ ứng viên ";
export const LABEL_REVIEW_LINK_FILE = "Xem file";

export const EMPLOYER_PREMIUM = 1;

export const CUSTOM_FILTER_PUBLIC = 1;

export const EMPLOYER_REPORT_TYPE_SEEKER = 1; //báo xấu ứng viên

export const SALES_ORDER_TYPE = 1; //phiếu đăng ký
export const SALES_ORDER_TYPE_PRICE = 2; //phiếu báo giá

export const JOB_SUPPORT_TYPE_USER = 2; //người dùng tạo

export const FILTER_RESUME = "filter_resume_2018";
export const GUARANTEE_RESUME = "guarantee_resume";
export const GUARANTEE_AS_RESUME = "guarantee_as_resume";
export const GUARANTEE_SERVICE = "guarantee_service";

export const FREE_TYPE_BONUS = 3;

/**
 * STATUS CODE API
 */
export const CODE_SUCCESS = 200;
export const CODE_NON_RECORD = 1001;
export const CODE_EXPIRED_TOKEN = 440;
export const CODE_ACCESS_DENY = 1000;
export const CODE_VALIDATION_FAIL = 422;
export const CODE_VALIDATION_DUPLICATE = 1008;
export const CODE_RES_CONFIRM = 8005;
export const CODE_RES_ALERT = 8006;
export const CODE_RES_CONFIRM_UPDATE_END_DATE = 8007;
export const CODE_FILE_TOO_BIG = 413;
export const CODE_SQL_ERROR = "22007";

/**
 * STATUS CONFIG
 */
export const STATUS_ACTIVED = 1;
export const STATUS_INACTIVED = 2;
export const STATUS_DISABLED = 3;
export const STATUS_COMPLETE = 4;
export const STATUS_LOCKED = 5;
export const STATUS_DELETED = 99;

export const SALE_ORDER_ACTIVED = 1;
export const SALE_ORDER_NOT_COMPLETE = 2;
export const SALE_ORDER_DISABLED = 3;
export const SALE_ORDER_INACTIVE = 4;
export const SALE_ORDER_CANCEL = 5;
export const SALE_ORDER_EXPIRED = 7;
export const SALE_ORDER_EXPIRED_ACTIVE = 10;
export const SALE_ORDER_DELETED = 99;

export const EXCHANGE_SALES_ORDER_STATUS_APPROVED = 1;
export const EXCHANGE_SALES_ORDER_STATUS_NEW = 2;
export const EXCHANGE_SALES_ORDER_STATUS_REJECTED = 3;
export const EXCHANGE_SALES_ORDER_STATUS_SUBMITTED = 4;
export const EXCHANGE_SALES_ORDER_STATUS_CANCELLED = 5;

export const STATUS_SALES_ORDER_ITEM_NEW = 2;

export const SALE_ORDER_REVERSE_PROCCESS = 3;

export const PROMOTIONS_STATUS_DRAFT = 4;

export const SALE_ORDER_SUB_ITEM_ACTIVED = 1;
export const SALE_ORDER_SUB_ITEM_RESERVING = 3;
export const SALE_ORDER_SUB_ITEM_COMPLETE = 4;
export const SALE_ORDER_SUB_ITEM_PROCESS = 3;

export const STATUS_SERVICE_ALL = "all";
export const STATUS_SUSPECTED = 1;

export const BOOKING_STATUS_NEW = 1; //Giữ chổ
export const BOOKING_STATUS_USED = 2; //Đang chạy
export const BOOKING_STATUS_CANCELED = 3; //Hủy
export const BOOKING_STATUS_DELETED = 99; //Xoa'

export const RECONTRACT_STATUS_ACTIVE = 1;

export const BUSINESS_LICENSE_STATUS_NEW = 4; //1 - duyệt,2 - chờ duyệt,3 - hủy dùng theo status erp

export const REQUEST_DROP_SALES_ORDER = 99;

export const REASON_APPROVE_CHANGE_EMAIL = 2;
export const REASON_APPROVE_CHANGE_COMPANY = 3;
export const REASON_APPROVE_VERIFY_EMAIL = 1;
export const REASON_APPROVE_CHANGE_TITLE = 1;

export const REASON_OTHER_VALUE = 15;
export const REASON_STATUS_NOT_ACTIVE = 3;

export const EXTENSION_FILE_IMPORT = ["xls", "xlsx"];
export const EXTENSION_FILE_SIZE_LIMIT = 10000000;
export const ASSIGNMENT_UPLOAD_TYPE = ["jpg", "jpeg", "png", "doc", "docx", "pdf"];
export const SALES_ORDER_SCHEDULE_FILE_UPLOAD_TYPE = ["jpg", "jpeg", "png", "doc", "docx", "pdf", "xls", "xlsx"];
export const FILE_OPEN_BROWSER_TYPE = ["jpg", "jpeg", "png", "pdf"];
export const FILE_IMAGE_TYPE = ["jpg", "jpeg", "png"];
export const EXTENSION_PDF = "pdf";
export const EXTENSION_DOC = ["doc", "docx"];

export const DIVIDE_SIZE = 2;

export const RIVAL_TYPE_NOT_SELECT = [0, 5];
export const RIVAL_TYPE_DONT_SHOW_WARNING = [0, 3, 5];

export const ALLOW_COUNTINUE_VALUE = 1;
export const EMAIL_MARKETING_STATUS_ACTIVE = 1;
export const EMAIL_MARKETING_STATUS_PENDING = 2;
export const EMAIL_MARKETING_STATUS_EMPTY = 3;

export const BANNER_HANG_DAU = "banner.nhatuyendunghangdau";
export const BANNER_TRANG_CHU = "banner.bannertrangchu";
export const BANNER_COVER_TRANG_CHU = "banner.covertrangchu";
export const BANNER_PHAI_TRANG_CONG = "banner.bannerphaitrangcong";
export const BANNER_PHAI_TRANG_NGANH = "banner.bannerphaitrangnganh";
export const BANNER_TRUNG_TAM = "banner.trungtam";
export const BANNER_PHAI_TRANG_CHU = "banner.bannerphaitrangchu";
export const BANNER_LOGO_NOI_BAT_TRANG_CHU = "banner.logonoibat_trangchu";

export const VL24H_UU_TIEN_NGANH = "vl24h.jobbox.uutien_trangnganh";
export const TVN_UU_TIEN_NGANH = "tvn.jobbox.uutien_trangnganh";
export const VTN_UU_TIEN_NGANH = "vtn.jobbox.uutien_trangnganh";
export const Service_Code_Account_Service = "vl24h.jobbox.account_service";
export const Service_Code_Account_Service_Filter_Resume = "vl24h.account_service_filter_resume";
export const Service_Code_Account_Service_TVN = "tvn.jobbox.account_service";

export const OTHER_LANGUAGE_NAME = "language";
export const OTHER_LANGUAGE_VALUE = 10;

export const EMPLOYER_IMAGE_STATUS_PENDING = 2;

export const EMPLOYER_DISCARD_REASON_EXPIRED_CARE = 1;

export const STAFF_LOCK = 2;

export const SEARCH_ALLOW_DEFAUT = 1;

export const TYPE_DIVIDE_OLD = 1;
export const TYPE_DIVIDE_NEW = 2;

export const INCLUDE_TYPE_STAFF = [1, 2]; // chỉ Lấy chính thức và thử việc

export const ARRAY_STATUS_SHOW_TIME_GUARANTEE = [1, 2];

export const EMPLOYER_TYPE = "employer";
export const EMPLOYER_ASSIGNED_TYPE_NOT_POPENTIAL = 3;
export const EMPLOYER_ASSIGNED_TYPE_FILTER = 4;

export const EMPLOYER_IMAGE_DIMENSION = {
  width: 616,
  height: 308,
};

export const EMPLOYER_BANNER_COVER_DIMENSION = {
  vl24h: {
    width: 1376,
    height: 256,
  },
  tvn: {
    width: 1024,
    height: 360,
  },
  mw: {
    width: 1376,
    height: 256,
  },
};

export const COMBO_POSTING_PACKAGE_BANNER_DIMENSION = {
  width: 410,
  height: 240,
};

export const ASSIGNED_TYPE_NOT_POTENTIAL = 3;
export const ASSIGNED_TYPE_FILTER = 4;

export const ASSIGNMENT_CUSTOMER_BIG = 2;

export const CAMPAIGN_TYPE_DEFAULT = 1;
export const CAMPAIGN_TYPE_GIFT = 2;
export const CAMPAIGN_TYPE_EXCHANGE = 3;
export const CAMPAIGN_TYPE_CONVERT_POINT = 4;

export const LEVEL_HIGH_UP = 1; // Định nghĩa giá trị của cấp bậc "Quản lý cao cấp"

export const SALARY_RANGE_AGREE = 11; // Định nghĩa giá trị của mức lương "Thỏa thuân"
export const SALARY_RANGE_CUSTOM = 21; // Định nghĩa giá trị của mức lương "Khác"

export const PROMOTION_PROGRAMS_APPLY_ORDER = 2;
export const SALES_ORDER_IS_SIGNATURE_YES = 1;

export const PROMOTION_PROGRAMS_POSITION_ALLOCATE_AFTER = 4;

export const GUARANTEE_TYPE_NEW = 2;

export const STATUS_TRANSFER_PROCESS_ACTIVE = 1;
export const STATUS_TRANSFER_PROCESS_DRAFT = 6;

export const REQUEST_APPROVE_STATUS_YES = 1;
export const IS_STATEMENT_TEST_YES = 1;
export const SALES_OPS_APPROVE_STATUS_YES = 1;
export const SALES_OPS_APPROVE_STATUS_WAITING = 2;

export const LINK_TEMPLATE_IMPORT_STATEMENT =
  "https://cdn1.timviecnhanh.com/file/request_employer/2021/06/29/template_import_statement_xlsx_162493770837.xlsx";

export const SALES_ORDER_BY_FIELD_GUARANTEE_YES = 1;
export const SALES_ORDER_BY_FIELD_GUARANTEE_NO = 2;

export const SALES_ORDER_BY_COMPENSATION_RECRUITMENT_YES = 1;
export const SALES_ORDER_BY_COMPENSATION_RECRUITMENT_NO = 2;

/**
 * ROOM TYPE
 */
export const STATUS_ROOM_TYPE_SME = 1;

export const PAYMENT_STATUS_PAID = 1;
export const PAYMENT_STATUS_NOT_PAID = 3;
export const PAYMENT_STATUS_PAID_A_PART = 2;
export const TRANSACTION_STATUS_MATCH = 1;
export const TRANSACTION_STATUS_CONFIRM_YES = 1;
export const TRANSACTION_STATUS_CONFIRM_NO = 2;
export const TRANSACTION_STATUS_CONFIRM_PENDING = 3;

export const REQUEST_APPROVE = 1;

export const TRANSACTION_TYPE_ADD = "+";
export const TRANSACTION_TYPE_SUB = "-";

export const EXCHANGE_STEP_CREATE = 1;
export const EXCHANGE_STEP_CONFIRM = 2;

/**
 * Nếu chọn các ngành LĐPT(ngành chính/ngành phụ):
 * sẽ show trường thông tin Yêu cầu hồ sơ để điền và hiển thị + ko bắt buộc nhập
 * xem trước tin sẽ hiện thông tin email phone liên hệ
 * Gồm: Lao động phổ thông 24,
 * Phục vụ/Tạp vụ/Giúp việc 56,
 * Làm đẹp/Thể lực/Spa 49,
 * Tài xế/Lái xe/Giao nhận 50,
 * Bảo vệ/Vệ sĩ/An ninh 11
 */
export const FIELD_VALUE_LDPT = [24, 56, 49, 50, 11];

export const REASON_CANCEL_FROM_SYSTEM = 3;

export const SERVICES_GUARANTEE = ["guarantee_resume", "guarantee_service"];

export const SALARY_UNIT_DEFAULT = 1;
export const PAYMENT_METHOD_DEFAULT = 2;

export const ORDER_BY_CONFIG = [
  {
    title: "Tăng dần",
    value: "asc",
  },
  {
    title: "Giảm dần",
    value: "desc",
  },
];

export const TEAM_CALL_LINE = [
  { label: "QLCL NTV", value: 90 },
  { label: "QLCL NTD", value: 91 },
];

export const SALES_ORDER_ITEM_TYPE_CAMPAIGN = {
  default: 1,
  gift: 2,
  convert: 3,
};

export const WEEK_QUANTITY_MAX_JOB_BASIC = {
  vl24h: 4,
  tvn: 4,
  vtn: 4,
  mw: 48,
};

export const DEFAULT_VALUE_FORM_JOBBOX = {
  mw: {
    job_quantity: 1, // Số lượng tin
    displayed_area: 3, //Toàn quốc
    displayed_method: 2, // Chia sẻ
  },
};

export const DEFAULT_VALUE_FORM_EFFECT = {
  mw: {
    job_quantity: 1, // Số lượng tin
    displayed_area: 3, //Toàn quốc
    displayed_method: 2, // Chia sẻ
  },
};

export const DEFAULT_VALUE_FORM_FILTER_JOB = {
  mw: {
    displayed_area: 3, //Toàn quốc
    displayed_method: 2, // Chia sẻ
  },
};

export const DEFAULT_VALUE_FORM_BANNER = {
  mw: {
    displayed_area: 3, //Toàn quốc
  },
};

export const BOX_TYPE_BANNER = 2;

export const OPTION_STAFF_EMPTY = { login_name: "Chưa có CSKH", id: "-1" };
export const OPTION_EMPLOYER_SUPPORT_EMPTY = {
  title: "Chưa chọn loại hổ trợ",
  value: "-1",
};

export const OBJECT_TYPE_JOB = 2;

export const PROMOTIONS_CONDITION_TYPE = {
  input: 1,
  select: 2,
  select_multi: 3,
  currency: 4,
  date: 5,
};

export const PROMOTIONS_SUB_CONDITION_TYPE = {
  input: 1,
  select: 2,
  select_multi: 3,
  currency: 4,
  date: 5,
  region: 6,
  number: 7,
  select_item_type: 8,
};

export const PROMOTIONS_FETCH_API = {
  promotion_programs: 1,
  service_code: 2,
};

export const PROMOTIONS_SUB_FETCH_API = {
  service_code: 1,
  bundles: 2,
  regions: 3,
  subscription: 4,
  combo: 5,
  products: 6,
};

export const CONDITION_DEFAULT = {
  left: "",
  operation: "",
  right: "",
};

export const CONDITION_SUB_DEFAULT = {
  from_condition: "AND",
  conditions: [CONDITION_DEFAULT],
};

export const BUNDLE_DEFAULT = {
  id: "",
  proportion: "",
  sku_code: "",
};

export const KEY_VALUE_DEFAULT = {
  key: "",
  value: "",
};

export const CONDITION_CONFIG_KPI = {
  room_id: "",
  division_code: "",
  rating: "",
  level: "",
  percent_kpi: "",
  percent_commission: "",
  conditions: "",
};

export const EXPERIMENT_EXCLUDE_DEFAULT = {
  experiment: "",
  experiment_variant: [],
};

export const EXPERIMENT_VARIANT_DEFAULT = {
  name: "",
  code: "",
  percent: "",
};

export const SEGMENT_RING_OPTIONS = [
  { label: 0, value: 0 },
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
];

export const TOGGLE_FLAG_OPTIONS = [
  { label: true, value: 1 },
  { label: false, value: 2 },
];

export const TYPE_ASSIGNMENT_LIST = [
  { label: "Khối - Sale", title: "Khối - Sale", value: 1 },
  { label: "Khối - BD", title: "Khối - BD", value: 2 },
];

export const TYPE_ASSIGNMENT_SALE = 1;
export const TYPE_ASSIGNMENT_HEADHUNT = 2;

export const TOGGLE_FLAG_OFF = 2;

export const COMMON_RESOURCE_FE = [{ title: "FE", value: "fe" }];

export const CHANGE_JOB_TYPE_JOB = 1;
export const CHANGE_JOB_TYPE_EFFECT = 2;

export const JOB_BASIC_WEEK_QUANTITY_DEFAULT = 4;

export const STATEMENT_NOT_MAPPING = 0;

export const EXPERIMENT_STATUS_ACTIVE = 1;

export const TRANSACTION_TYPE_INTERNAL = 1;

export const TRANSACTION_TYPE_CUSTOMER = 0;

export const SURVEY_TYPE_INTERNAL = 1;

export const SURVEY_ID_EXPERIMENT_PAGE = 3;
export const SURVEY_ID_SURVEY_PAGE = 4;

export const ALLOW_RECEIVE_EMPLOYER = 1
export const NOT_ALLOW_RECEIVE_EMPLOYER = 2

/**
 * MESSAGE CONFIG
 */
export const MSG_REQUIRED = "Thông tin là bắt buộc";
export const MSG_PASSWORD_MIN_8 = "Mật khẩu tối thiểu 8 ký tự";
export const MSG_TYPE_VALID = "Thông tin không đúng định dạng";
export const MSG_MIN_CHARATER_1 = "Tối thiểu 1 ký tự";
export const MSG_MIN_CHARATER_5 = "Tối thiểu 5 ký tự";
export const MSG_MIN_CHARATER_8 = "Tối thiểu 8 ký tự";
export const MSG_MIN_CHARATER_9 = "Tối thiểu 9 ký tự";
export const MSG_MIN_CHARATER_10 = "Tối thiểu 10 ký tự";
export const MSG_MIN_CHARATER_14 = "Tối thiểu 14 ký tự";
export const MSG_MIN_CHARATER_100 = "Tối thiểu 100 ký tự";
export const MSG_MAX_CHARATER_11 = "Tối đa 11 ký tự";
export const MSG_MAX_CHARATER_200 = "Tối đa 200 ký tự";
export const MSG_MAX_CHARATER_255 = "Tối đa 255 ký tự";
export const MSG_PASSWORD_REGEX = "Mật khẩu cần tối thiểu 8 ký tự, trong đó có ít nhất 1 ký tự chữ và 1 ký tự số";
export const MSG_MAX_ARRAY_ITEM = "Tối đa chỉ nhập 5 phần tử";
export const MSG_MAX_ARRAY_3_ITEM = "Tối đa chỉ nhập 3 phần tử";
export const MSG_NOTIFY_SALE_ORDER =
  "Đăng ký tính phí thành công, tuy nhiên ngày kết thúc tính phí > hạn sử dụng phiếu nên sẽ được update lại bằng hạn sử dụng của phiếu đăng ký";
export const MSG_NUMBER_ONLY = "Giá trị phải là số";
export const MSG_POSITIVE_ONLY = "Giá trị phải lớn hơn 0";
export const MSG_TAX_CODE_VALID = "MST chứa ký tự không hợp lệ, vui lòng kiểm tra lại";
export const MSG_CODE_VALID = "Mã code chứa ký tự không hợp lệ, vui lòng kiểm tra lại";
export const MSG_MOD_30 = "Số CV mua phải là bội số của 30";
export const MSG_MIN_CHARATER_DYNAMIC = (nums) => `Tối thiểu ${nums} ký tự`;
export const MSG_MAX_CHARATER_DYNAMIC = (nums) => `Tối đa ${nums} ký tự`;
export const MSG_MAX_NUMBER_VALUE_DYNAMIC = (nums) => `Giá trị không được lớn hơn ${nums}`;
export const MSG_MIN_NUMBER_VALUE_DYNAMIC = (nums) => `Giá trị không được nhỏ hơn ${nums}`;
export const MSG_PHONE_ZALO =
  "Lưu ý: SĐT phải chuẩn hóa theo mã quốc gia VN (84xxx và 11 ký tự). Ví dụ: 0912345678 -> 84912345678";
export const MSG_NON_CUSTOMER = "Mã số thuế này chưa thuộc về khách hàng nào.";
export const MSG_TAX_CODE_INVALID = 'Mã số thuế chỉ chứa ký tự dạng chữ, dạng số, dấu gạch nối "_" và bao gồm 10 hoặc 14 ký tự';
export const MSG_EMAIL_INVALID = "Email không đúng định dạng";
/**
 * CUSTOM OF SITE
 */
export const URL_FE = {
  vl24h_re: process.env.REACT_APP_URL_FE_VL24H_RE,
  vl24h: process.env.REACT_APP_URL_FE_VL24H,
  tvn: process.env.REACT_APP_URL_FE_TVN,
  vtn: process.env.REACT_APP_URL_FE_VTN,
  mw: process.env.REACT_APP_URL_FE_MW,
};

export const LICENSE_NAME_BY_CHANNEL = {
  vl24h: "vieclam24h",
  tvn: "timviecnhanh",
  vtn: "viectotnhat",
  mw: "mywork",
};

export const TAG_LINK_FE = {
  vl24h: "vieclam",
  tvn: "tim-viec-lam",
  vtn: "việc-làm",
  mw: "viec-lam",
};

export const RESUME_APPLY_TEXT_DEFAULT = {
  vl24h:
    "Ưu tiên nộp hồ sơ trực tuyến qua hệ thống của Việc Làm 24h\nhoặc gửi CV mô tả quá trình học tập và làm việc về email liên hệ.",
  tvn: "Ưu tiên nộp hồ sơ trực tuyến qua hệ thống của Tìm việc nhanh\nhoặc gửi CV mô tả quá trình học tập và làm việc về email liên hệ.",
};

export const GATE_DEFAULT = {
  [CHANNEL_CODE_TVN]: "tvn.default",
  [CHANNEL_CODE_VTN]: "vtn.default",
  [CHANNEL_CODE_MW]: "mw.default",
  [CHANNEL_CODE_VL24H]: null,
};

export const LINK_INTERNAL = {
  vl24h: "https://vieclam24h.vn",
  tvn: "https://timviecnhanh.com",
  mw: "https://mywork.com.vn",
};

export const SERVICE_LINK_INTERNAL = {
  vl24h: [
    "vl24h.banner.nhatuyendunghangdau",
    "vl24h.banner.bannertrangchu",
    "vl24h.banner.covertrangchu",
    "vl24h.banner.bannerphaitrangcong",
    "vl24h.banner.bannerphaitrangnganh",
    "vl24h.banner.bannerphaitrangcong_250x600",
    "vl24h.banner.bannerphaitrangnganh_250x600",
  ],
  tvn: ["tvn.banner.trungtam"],
  mw: [],
};

export const SERVICE_IGNORE_FILTER = {
  vl24h: ["vl24h.banner.khachangcuachungtoi"],
  tvn: ["tvn.banner.khachangcuachungtoi"],
  vtn: ["vtn.banner.khachangcuachungtoi"],
  mw: ["mw.banner.khachangcuachungtoi"],
};
export const SERVICE_IGNORE_BY_CHANNEL = {
  vl24h: [],
  tvn: [],
  vtn: [],
  mw: ["mw.jobbox.basic"],
};

export const CONFIG_FLAG_QRCODE_CODE = "sales_order.flag_qrcode";
export const CONFIG_FLAG_QRCODE_LOAD = 1;

export const CONFIG_CHANGE_AREA_REGISTRATION_CODE = "change_area_registration";

export const CONFIG_SALES_ORDER_EFFECT_NOT_REQUIRE_JOB_BOX_CODE = "sales_order.effect.not_required_jobbox";
export const CONFIG_SALES_ORDER_EFFECT_NOT_REQUIRE_JOB_BOX_LOAD = 1;

export const SALES_ORDER_PACKAGE = "silver";

export const REVENUE_UNIT = {
  1: "đ",
  2: "cus",
  3: "jb",
};

export const HEADHUNT_GROUP_DIVISON = [
  "customer_headhunt_lead",
  "customer_headhunt_sale",
  "customer_headhunt_recruiter",
  "customer_headhunt_manager",
];

export const HEADHUNT_APPLICATE_REASON_STATUS_OTHER = "khac";

/**
 * IDKEY
 */
export const IDKEY_DISCOUNT_RECONTRACT = "DiscountRecontract";
export const IDKEY_SALES_ORDER_EDIT_PAGE = "SalesOrderEditPage";
export const IDKEY_SALES_ORDER_DETAIL = "SalesOrderDetail";
export const IDKEY_JOB_BASIC_PACKAGE = "JobBasicPackage";
export const IDKEY_JOB_PACKAGE = "JobboxPackage";
export const IDKEY_EMPLOYER_PACKAGE = "EmployerPackageList";
export const IDKEY_SERVICE_POINT_PACKAGE = "ServicePointPackageList";
export const IDKEY_EFFECT_PACKAGE = "EffectPackageList";
export const IDKEY_BANNER_PACKAGE = "BannerPackageList";
export const IDKEY_MINISITE_PACKAGE = "MiniSitePackageList";
export const IDKEY_PRODUCT_GROUP_PACKAGE = "ProductGroupPackage";
export const IDKEY_BUNDLE_PACKAGE = "BundlePackage";
export const IDKEY_COMBO_PACKAGE = "ComboPackage";
export const IDKEY_COMBO_POST = "ComboPost";
export const IDKEY_SUBSCRIPTION_PACKAGE = "SubscriptionPackage";
export const IDKEY_ACCOUNT_SERVICE_PACKAGE = "AccountServicePackage";
export const IDKEY_FREEMIUM_PACKAGE = "FreemiumPackage";
export const IDKEY_EMPLOYER_TRIAL_LIST = "EmployerTrialList";
export const IDKEY_SALES_ORDER_BY_FIELD_EDIT = "SalesOrderByFieldEdit";
export const IDKEY_ITEM_PACKAGE = "ItemPackageList";
export const IDKEY_PROMOTION = "PromotionList";
export const IDKEY_EXCHANGE = "PromotionList";
export const IDKEY_EMPLOYER_FREEMIUM_LIST = "EmployerFreemiumList";
export const IDKEY_JOB_FREEMIUM_LIST = "JobFreemiumList";
export const IDKEY_ACCOUNT_SERVICE_TEAM_LIST = "AccountServiceTeamList";
export const IDKEY_ACCOUNT_SERVICE_CAMPAIGN_LIST = "AccountServiceCampaignList";
export const IDKEY_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN = "AccountServiceSearchResumeCampaignList";
export const IDKEY_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_HISTORY_SEND_RESUME =
  "AccountServiceSearchResumeCampaignHistorySendResumeList";
export const IDKEY_ACCOUNT_SERVICE_SEARCH_RESUME = "AccountServiceSearchResumeList";
export const IDKEY_GROUP_SURVEY_LIST = "GroupSurveyList";
export const IDKEY_DIVISION_CODE_GROUP_SURVEY_LIST = "DivisionCodeGroupSurveyList";

/**
 * DIVISION_TYPE
 */
export const DIVISION_TYPE_admin = "admin";
export const DIVISION_TYPE_root = "root";
export const DIVISION_TYPE_customer_care_member = "customer_care_member";
export const DIVISION_TYPE_customer_care_leader = "customer_care_leader";
export const DIVISION_TYPE_quality_control_employer = "quality_control_employer";
export const DIVISION_TYPE_regional_sales_leader = "regional_sales_leader";
export const DIVISION_TYPE_sales_administrator = "sales_administrator";
export const DIVISION_TYPE_seeker_care_leader = "seeker_care_leader";
export const DIVISION_TYPE_seeker_care_member = "seeker_care_member";
export const DIVISION_TYPE_quality_control_call_seeker = "quality_control_call_seeker";
export const DIVISION_TYPE_accountant_liabilities = "accountant_liabilities";
export const DIVISION_TYPE_accountant_invoice = "accountant_invoice";
export const DIVISION_TYPE_accountant_service_control = "accountant_service_control";
export const DIVISION_TYPE_customer_headhunt_lead = "customer_headhunt_lead";
export const DIVISION_TYPE_customer_headhunt_sale = "customer_headhunt_sale";
export const DIVISION_TYPE_customer_headhunt_recruiter = "customer_headhunt_recruiter";
export const DIVISION_TYPE_customer_headhunt_sourcer = "customer_headhunt_sourcer";
export const DIVISION_TYPE_account_service = "account_service";
export const DIVISION_TYPE_account_service_lead = "account_service_lead";

/**
 * BASE URL
 */
export const BASE_URL = "/";
export const BASE_URL_SIGNIN = "/login";
export const BASE_URL_CHANGE_PASS = "/change-password";
export const BASE_URL_OTP = "/otp";
export const BASE_URL_ERROR = "/error";
export const BASE_URL_EMPLOYER = "/employer";
export const BASE_URL_SEARCH_INFORMATION_LOOKUP = "/search-information-lookup";
export const BASE_URL_ARCHIVED_EMPLOYER = "/archived-employer";
export const BASE_URL_SEARCH_EMPLOYER = "/search-employer";
export const BASE_URL_JOB = "/job";
export const BASE_URL_JOB_FREEMIUM = "/customer-care/job-freemium";
export const BASE_URL_ARCHIVED_JOB = "/archived-job";
export const BASE_URL_BOOKING_JOB = "/booking/slot-coverage";
export const BASE_URL_BOOKING_BOX = "/booking/box-coverage";
export const BASE_URL_ACCOUNTANT_BOOKING_JOB = "/accountant/booking/slot-coverage";
export const BASE_URL_ACCOUNTANT_BOOKING_BOX = "/accountant/booking/box-coverage";
export const BASE_URL_BOOKING = "/booking";
export const BASE_URL_SALES_SERVICE_PRICE = "/quotation";
export const BASE_URL_ADD_SALES_SERVICE_PRICE = "/quotation/add";
export const BASE_URL_EDIT_SALES_SERVICE_PRICE = "/quotation/edit";
export const BASE_URL_SALES_ORDER = "/sales-order";
export const BASE_URL_SEARCH_SALES_ORDER = "/search-sales-order";
export const BASE_URL_ADD_SALES_ORDER = "/sales-order/add";
export const BASE_URL_EDIT_SALES_ORDER = "/sales-order/edit";
export const BASE_URL_EDIT_SALES_ORDER_REQUEST = "/sales-order/request";
export const BASE_URL_PLANNING_TOMORROW = "/planning/tomorrow";
export const BASE_URL_PLANNING_DAILY_REVENUE = "/planning/daily-revenue";
export const BASE_URL_PLANNING_WEEK = "/planning/week";
export const BASE_URL_PLANNING_MONTH = "/planning/month";
export const BASE_URL_PLANNING_TRACKING = "/planning/tracking-progress";
export const BASE_URL_STATISTIC_EMPLOYER = "/statistic/employer";
export const BASE_URL_STATISTIC_REMOVED_EMPLOYER = "/statistic/throwout-employer";
export const BASE_URL_STATISTIC_EMPLOYER_BY_STAFF = "/statistic/throwout-employer-list";
export const BASE_URL_CALL_STATISTIC = "/call/statistic";
export const BASE_URL_CALL_MOBILE_STATISTIC = "/call-mobile/statistic";
export const BASE_URL_CALL_HISTORY = "/call/history";
export const BASE_URL_CALL_MOBILE_HISTORY = "/call-mobile/history";
export const BASE_URL_CALL_EVALUATE = "/call/evaluate";
export const BASE_URL_PRODUCT_PRICE_LIST = "/product/price-list";
export const BASE_URL_ACCOUNTANT_CUSTOMER = "/accountant/customer";
export const BASE_URL_ACCOUNTANT_BOOKING = "/accountant/booking";
export const BASE_URL_ACCOUNTANT_SALES_ORDER = "/sales-order/process/approve";
export const BASE_URL_ACCOUNTANT_SALES_ORDER_APPROVE_CHANGE_EMAIL_INVOICES = "/sales-order/approve-change-email-invoices";
export const BASE_URL_ACCOUNTANT_PRODUCT_PRICE_RECONTRACK = "/product/price-list-recontract";
export const BASE_URL_SALES_ORDER_APPROVE_SERVICE = "/sales-order/process/approve-service";
export const BASE_URL_SALES_ORDER_APPROVE_REQUEST = "/sales-order/process/approve-request";
export const BASE_URL_BOOKING_BANNER = "/accountant/booking-banner";
export const BASE_URL_ACCOUNTANT_BOOKING_BANNER_JOX = "/accountant/booking/slot-coverage-banner";
export const BASE_URL_ACCOUNTANT_BOOKING_BANNER_BOX = "/accountant/booking/box-coverage-banner";
export const BASE_URL_SALES_ORDER_APPROVE_DROP = "/sales-order/process/approve-drop";
export const BASE_URL_AUTH_DIVISION = "/auth/division";
export const BASE_URL_AUTH_PERMISSION = "/auth/permission";
export const BASE_URL_AUTH_ACTION = "/action";
export const BASE_URL_AUTH_STAFF = "/auth/staff";
export const BASE_URL_SYSTEM_TEMPLATE_MAIL = "/system/mail";
export const BASE_URL_SYSTEM_UPLOAD = "/system/upload";
export const BASE_URL_SYSTEM_COMMON_DATA = "/system/common_data";
export const BASE_URL_SYSTEM_UPPERCASE_KEYWORD = "/system/uppercase-keyword";
export const BASE_URL_SYSTEM_FORBIDDEN_KEYWORD = "/system/forbidden-keyword";
export const BASE_URL_SYSTEM_DOCUMENT_GUIDE = "/system/document-guide";
export const BASE_URL_SYSTEM_GATE_JOB_FIELD = "/system/gate-job-field";
export const BASE_URL_SYSTEM_CONFIG = "/system/config";
export const BASE_URL_SYSTEM_CONFIG_LIST_SHARE_ROOM = "/system/config-list-share-room";
export const BASE_URL_SYSTEM_CONFIG_RULE_SHARE_ROOM = "/system/config-rule-share-room";
export const BASE_URL_SYSTEM_CONFIG_LIST_SHARE_BASKET = "/system/config-list-employer-share-basket";
export const BASE_URL_SYSTEM_CONFIG_RULE_SHARE_BASKET = "/system/config-rule-employer-share-basket";
export const BASE_URL_SYSTEM_LIST_EMPLOYER_SHARE_BASKET = "/system/list-employer-share-basket";
export const BASE_URL_AUTH_HOTLINE_WEBSITE = "/quality-control-employer/hotline_website";
export const BASE_URL_POINT_GUARANTEE = "/quality-control-employer/point-guarantee";
export const BASE_URL_SEEKER_RESUME = "/resume/list";
export const BASE_URL_SEEKER_RESUME_APPLIED_HISTORY = "/resume/applied/history/list";
export const BASE_URL_RESUME_DELETE = "/archied-resume";
export const BASE_URL_SEEKER_DELETE = "/archied-seeker";
export const BASE_URL_SEEKER_RESUME_STEP_BY_STEP = "/resume/step-by-step";
export const BASE_URL_SEEKER_RESUME_ATTACH = "/resume/attach";
export const BASE_URL_SEEKER_CARE_SEEKER = "/seeker";
export const BASE_URL_SEEKER_CARE_SEEKER_DETAIL_HIDE_CONTACT = "/seeker-detail-hide-contact";
export const BASE_URL_SEEKER_CARE_STATISTIC_SEEKER = "/seeker/statistic-seeker";
export const BASE_URL_SEEKER_RESUME_BLACK_LIST_KEYWORD = "/seeker/black-list-keyword";
export const BASE_URL_SEEKER_CARE_STATISTIC_RESUME = "/resume/statistic-resume";
export const BASE_URL_SEEKER_CARE_RESUME_TEMPLATE = "/resume-template";
export const BASE_URL_QA_CALL_HISTORY = "/qa/call_history";
export const BASE_URL_QA_MASTER_SCRORING = "/qa/master_scoring";
export const BASE_URL_QA_VIOLATION = "/qa/violation";
export const BASE_URL_QA_STATISTIC_CALL = "/qa/statistic_call";
export const BASE_URL_QA_TIME_FRAME = "/qa/time-frame";
export const BASE_URL_QA_CALL_LINE_STATISTIC = "/call-line/statistic";
export const BASE_URL_QC_KEYWORD = "/quality-control-employer/keyword";
export const BASE_URL_QC_VIOLATION = "/quality-control-employer/violation";
export const BASE_URL_QC_EMPLOYER = "/quality-control-employer/employer";
export const BASE_URL_QC_CUSTOMER_SERVICE = "/quality-control-employer/customer_service";
export const BASE_URL_QC_CUSTOMER_ROOM = "/quality-control-employer/customer_room";
export const BASE_URL_QC_NOTIFY_WEB = "/quality-control-employer/notify_website";
export const BASE_URL_QC_JOB_SUPPORT = "/quality-control-employer/job-support";
export const BASE_URL_QC_JOB_SUPPORT_LOGGING = "/quality-control-employer/job-support/logging";
export const BASE_URL_QC_JOB_SUPPORT_TRACKING = "/quality-control-employer/job-support/tracking";
export const BASE_URL_QC_JOB_SUPPORT_PREVIEW = "/quality-control-employer/job-support/preview";
export const BASE_URL_QC_DIVIDE_EMPLOYER = "/quality-control-employer/divide_employer";
export const BASE_URL_ASSIGNMENT_REQUEST = "/customer-care/assignment-request";
export const BASE_URL_APPROVE_ASSIGNMENT_REQUEST = "/quality-control-employer/approve-assignment-request";
export const BASE_URL_HISTORY_APPROVE_ASSIGNMENT_REQUEST = "/quality-control-employer/history-approve-assignment-request";
export const BASE_URL_RUNNING_BANNER = "/quality-control-employer/running-banner";
export const BASE_URL_REGISTER_ADVISORY = "/quality-control-employer/register-advisory";
export const BASE_URL_CUSTOMER_SUGGEST = "/list-customer-suggest";
export const BASE_URL_ARTICLE_POST = "/article/post";
export const BASE_URL_ARTICLE_QUESTION = "/article/question";
export const BASE_URL_SEO_META = "/seo-meta";
export const BASE_URL_INFO_CONTRACT = "/system/info-contract";
export const BASE_URL_SEEKER = "/seeker";
export const BASE_URL_RESUME = "/resume";
export const BASE_URL_RESUME_TEMPLATE = "/resume-template";
export const BASE_URL_REQUIREMENT_APPROVE = "/quality-control-employer/requirement-approve";
export const BASE_URL_RUNNING_SERVICE_MANAGE = "/running-service-manager";
export const BASE_URL_EMPLOYER_NOT_DISTURB = "/employer-not-disturb";
export const BASE_URL_EMPLOYER_NOT_DISTURB_SEARCH = "/employer-not-disturb-search";
export const BASE_URL_EMPLOYER_IMAGE_PENDING = "/employer-image-pending";
export const BASE_URL_EMPLOYER_IMAGE_DAY = "/employer-image-day";
export const BASE_URL_RESUME_DAILY = "/staff-resume-viewed-daily";
export const BASE_URL_JOB_DAILY = "/staff-job-viewed-daily";
export const BASE_URL_EMPLOYER_NOT_ALLOWED = "/employer-not-allowed";
export const BASE_URL_QC_FILTER_JOB = "/quality-control-employer/screen-job";
export const BASE_URL_EMPLOYER_FILTER = "/employer-filter-list";
export const BASE_URL_JOB_REFRESH_HISTORY = "/history-refresh-job";
export const BASE_URL_SEEKER_SERVICE = "/seeker-service";
export const BASE_URL_TAG = "/seo/tag";
export const BASE_URL_QC_COMPLAIN = "/quality-control-employer/complain";
export const BASE_URL_GUARANTEE_JOB = "/guarantee-job";
export const BASE_URL_GUARANTEE_REPORT = "/guarantee-report";
export const BASE_URL_DIVIDE_NEW_ACCOUNT = "/quality-control-employer/split-new-account";
export const BASE_URL_DIVIDE_OLD_ACCOUNT = "/quality-control-employer/split-old-account";
export const BASE_URL_EMPLOYER_NOT_POTENTIAL = "/employer-not-potential";
export const BASE_URL_STATTISTIC_SYSTEM = "/statistic-system";
export const BASE_URL_CUSTOMER = "/customer";
export const BASE_URL_ACCOUNTANT_CAMPAIGN = "/accountant/campaign";
export const BASE_URL_EMPLOYER_RESIGN = "/employer-resign";
export const BASE_URL_SEARCH_CHECK_EMAIL = "/search-check-email";
export const BASE_URL_HISTORY_SERVICE_MANAGER = "/history-service-manager";
export const BASE_URL_HISTORY_SERVICE_VTN = "/customer-care/history-service-vtn";
export const BASE_URL_SEARCH_EMAIL_CUSTOMER = "/search-email-customer";
export const BASE_URL_REVENUE_DAILY = "/revenue/daily";
export const BASE_URL_PROMOTION_PROGRAMS = "/promotion-programs";
export const BASE_URL_REVENUE_CONFIG = "/revenue/revenue-config";
export const BASE_URL_REVENUE_OF_STAFF = "/revenue/revenue-of-staff";
export const BASE_URL_REVENUE_LIST_FOLLOW = "/revenue/revenue-list-follow";
export const BASE_URL_REVENUE_COMMISSION = "/revenue/revenue-commission";
export const BASE_URL_REVENUE_COMMISSION_REPORT = "/revenue/revenue-commission-report";
export const BASE_URL_REVENUE_COMMISSION_BONUS = "/revenue/revenue-bonus";
export const BASE_URL_REVENUE_RESULT_KPI = "/revenue/revenue-result-kpi";
export const BASE_URL_CONFIG_SERVICE_GIFT = "/customer-care/config-service-gift";
export const BASE_URL_TOOL_TRANSFER_EMPLOYER_ASSIGNMENT = "/tool-transfer-employer-assignment";
export const BASE_URL_TOOL_TRANSFER_GET_EMPLOYER = "/tool-transfer-get-employer";
export const BASE_URL_TOOL_TRANSFER_PROCESS = "/tool-transfer-employer-process";
export const BASE_URL_REVENUE_CONFIG_OF_MONTH = "/revenue-config-kpi-of-month";
export const BASE_URL_REVENUE_CONFIG_STAFF = "/revenue-config-staff";
export const BASE_URL_REVENUE_CONFIG_GROUP = "/revenue-config-group";
export const BASE_URL_REVENUE_CONFIG_KPI_STAFF = "/revenue-config-kpi-staff";
export const BASE_URL_REVENUE_REPORT_KPI_STAFF = "/revenue/report-kpi-staff";
export const BASE_URL_REVENUE_REPORT_KPI_STAFF_NEW = "/revenue/odoo-sales-commission";
export const BASE_URL_REVENUE_REPORT_REVENUE_STAFF = "/revenue/report-revenue-staff";
export const BASE_URL_REVENUE_REPORT_BONUS_STAFF = "/revenue/report-bonus-staff";
export const BASE_URL_REVENUE_NET_SALE_DATA = "/revenue/net-sale-data";
export const BASE_URL_REVENUE_DATA = "/revenue/revenue-data";
export const BASE_URL_REVENUE_CASH_DATA = "/revenue/cash-data";
export const BASE_URL_REVENUE_REVIEW = "/revenue/review";
export const BASE_URL_POINT_GIFT_MANAGE = "/customer-care/point-gift-manage";
export const BASE_URL_ACCOUNTANT_PRODUCT_GROUP = "/accountant/product_group";
export const BASE_URL_BUNDLES_PACKAGE_PAGE = "/accountant/bundle-package";
export const BASE_URL_EMPLOYER_INTERNAL = "/customer-care/employer-internal";
export const BASE_URL_EMPLOYER_TRIAL = "/customer-care/employer-trial";
export const BASE_URL_EMPLOYER_FREEMIUM = "/customer-care/employer-freemium";
export const BASE_URL_QUOTATION_REQUEST = "/quotation-request";
export const BASE_URL_FIELD_QUOTATION_REQUEST = "/field-quotation-request";
export const BASE_URL_EMPLOYER_SME_30 = "/employer-sme-30";
export const BASE_URL_EMPLOYER_CLASSIFICATION = "/customer-care/employer-classification";
export const BASE_URL_SYSTEM_PAYMENT_REQUEST = "/system/payment-request";
export const BASE_URL_JD_TEMPLATE = "/jd-template";
export const BASE_URL_BANNER_PAGE = "/banner";
export const BASE_URL_EMPLOYER_WITH_PROMOTION_CODE = "/customer_care/list-employer-code-promotion";
export const BASE_URL_EXCHANGE_SALES_ORDER = "/exchange-sales-order";
export const BASE_URL_CREDIT_EMPLOYER = "/credit-employer";
export const BASE_URL_CONFIG_GIFT_SERVICE_PACKAGE_PAGE = "/accountant/config-gift-service-package";
export const BASE_URL_COMBO_PACKAGE_PAGE = "/accountant/combo-package";
export const BASE_URL_COMBO_POSTING_PACKAGE_PAGE = "/accountant/combo-post";
export const BASE_URL_SUBSCRIPTION_PACKAGE_PAGE = "/accountant/subscription-package";
export const BASE_URL_OFFER_INCREASING_CONFIG_PAGE = "/accountant/offer-increasing-config";
export const BASE_URL_GROUP_CAMPAIGN_PAGE = "/accountant/group-campaign";
export const BASE_URL_GROUP_SALES_ORDER_CONVERT_PAGE = "/accountant/sales-order-convert";
export const BASE_URL_SALES_OPS_APPROVE_SALES_ORDER = "/sales-ops-approve-sales-order";
// experiment
export const BASE_URL_EXPERIMENT_PROJECT = "/experiment-manage/project";
export const BASE_URL_EXPERIMENT_EXPERIMENT = "/experiment-manage/experiment";
export const BASE_URL_EXPERIMENT_SEGMENT = "/experiment-manage/segment";
export const BASE_URL_EXPERIMENT_FEATURE_FLAG = "/experiment-manage/feature-flag";

// payment
export const BASE_URL_PAYMENT_MANAGE_PAYMENT = "/payment-mange/payment";
export const BASE_URL_PAYMENT_MANAGE_STATEMENT = "/payment-mange/statement";
export const BASE_URL_PAYMENT_MANAGE_TRANSACTION = "/payment-mange/transaction";
export const BASE_URL_PAYMENT_MANAGE_BANK = "/payment-mange/bank";

//Opportunity
export const BASE_URL_OPPORTUNITY = "/customer-care/opportunity";

// checkmate
export const BASE_URL_SALES_ORDER_BY_FIELD = "/sales-order-by-field";
export const BASE_URL_FIELD_PRICE_LIST = "/field-price-list";
export const BASE_URL_FIELD_PRINT_CHECKMATE = "/field-print-checkmate";
export const BASE_URL_EMPLOYER_CHECKMATE = "/employer-checkmate";
export const BASE_URL_CALL_HISTORY_CHECKMATE = "/call-history-checkmate";
export const BASE_URL_SALES_ORDER_SCHEDULE = "/sales-order-schedule";
export const BASE_URL_REGISTRATION_CHECKMATE = "/registration-checkmate";
export const BASE_URL_FIELD_PROMOTION_PROGRAMS = "/field-promotion-program";

// survey
export const BASE_URL_SURVEY = "/survey";
export const BASE_URL_GROUP_SURVEY = "/group-survey";

// headhunt
export const BASE_URL_HEADHUNT_CAMPAIGN = "/headhunt/campaign";
export const BASE_URL_HEADHUNT_CUSTOMER = "/headhunt/customer";
export const BASE_URL_HEADHUNT_GROUP = "/headhunt/group";
export const BASE_URL_HEADHUNT_RESUME = "/headhunt/resume";
export const BASE_URL_HEADHUNT_RECRUITMENT_PIPELINE = "/headhunt/recruitment-pipeline";
export const BASE_URL_HEADHUNT_JOB = "/headhunt/search-job";
export const BASE_URL_HEADHUNT_EMPLOYER = "/headhunt/employer";
export const BASE_URL_HEADHUNT_SALES_ORDER = "/headhunt/sales-order";
export const BASE_URL_ADD_HEADHUNT_SALES_ORDER = "/headhunt/sales-order/add";
export const BASE_URL_EDIT_HEADHUNT_SALES_ORDER = "/headhunt/sales-order/edit";
export const BASE_URL_HEADHUNT_CONTRACT = "/headhunt/contract";
export const BASE_URL_HEADHUNT_SKU = "/headhunt/sku";
export const BASE_URL_HEADHUNT_APPLICANT_STATUS = "/headhunt/applicant-status";
export const BASE_URL_HEADHUNT_ACCEPTANCE_RECORD = "/headhunt/acceptance-record";
export const BASE_URL_HEADHUNT_EMAIL_TEMPLATE = "/headhunt/email-template";
export const BASE_URL_HEADHUNT_RECRUITMENT_REQUEST = "/headhunt/recruitment-request";
export const BASE_URL_HEADHUNT_STATISTIC_SALES_ORDER = "/headhunt/statistic-sales-order";
export const BASE_URL_HEADHUNT_SEARCH_CANDIDATE = "/headhunt/search-candidate";
export const BASE_URL_HEADHUNT_APPLICANT_ACCEPTANCE = "/headhunt/applicant-acceptance";
export const BASE_URL_HEADHUNT_REPORT_RECRUIT = "/headhunt/report-recruit";
export const BASE_URL_HEADHUNT_SOURCE_JOB_REQUEST = "/headhunt/source-job-request";
export const BASE_URL_HEADHUNT_CANDIDATE_BANK = "/headhunt/candidate-bank";

//SOv2
export const BASE_URL_SALES_ORDER_V2 = "/v2/sales-order";
export const BASE_URL_ADD_SALES_ORDER_V2 = "/v2-sales-order/add";
export const BASE_URL_EDIT_SALES_ORDER_V2 = "/v2-sales-order/edit";
export const BASE_URL_CATEGORY = "/category";
export const BASE_URL_SKU = "/sku";
export const BASE_URL_PRODUCT_PACKAGE = "/product-package";
export const BASE_URL_PRICE_LIST = "/pricing";
export const BASE_URL_PRICE_LIST_DETAIL = "/pricing-detail";
export const BASE_URL_PROMOTION_V2 = "/v2/promotion";
export const BASE_URL_CREATE_CAMPAIGN_V2 = "/v2/campaign";
export const BASE_URL_EMPLOYER_RESIGN_V2 = "/v2/employer-resign";
export const BASE_URL_EXCHANGE_SALES_ORDER_V2 = "/v2/exchange-sales-order";

//EmailMarketing
export const BASE_URL_EMAIL_MARKETING_GROUP_CAMPAIGN = "/email-marketing/group-campaign";
export const BASE_URL_EMAIL_MARKETING_CAMPAIGN = "/email-marketing/campaign";
export const BASE_URL_EMAIL_MARKETING_TEMPLATE_MAIL = "/email-marketing/template-mail";
export const BASE_URL_EMAIL_MARKETING_LIST_CONTACT = "/email-marketing/list-contact";

//Account Service
export const BASE_URL_ACCOUNT_SERVICE_GROUP = "/account-service-group";
export const BASE_URL_ACCOUNT_SERVICE_CAMPAIGN = "/account-service-campaign";
export const BASE_URL_ACCOUNT_SERVICE_APPLICANT = "/account-service-applicant";
export const BASE_URL_ACCOUNT_SERVICE_EMAIL_TEMPLATE = "/account-service-email-template";
export const BASE_URL_ACCOUNT_SERVICE_SEARCH_RESUME = "/account-service-search-resume";
export const BASE_URL_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN = "/account-service-search-resume-campaign";

//Gamification
export const BASE_URL_GAMIFICATION_CHALLENGES_CATEGORY = "/gamification/challenges-category";
export const BASE_URL_GAMIFICATION_CHALLENGES = "/gamification/challenges";
export const BASE_URL_GAMIFICATION_EVENT = "/gamification/event";
export const BASE_URL_GAMIFICATION_REWARD = "/gamification/reward";
export const BASE_URL_GAMIFICATION_REWARD_CONDITION = "/gamification/reward-condition";
export const BASE_URL_GAMIFICATION_REWARD_CONFIG = "/gamification/reward-config";
export const BASE_URL_GAMIFICATION_POINT = "/gamification/point";

//Zalo zns
export const BASE_URL_ZALO_ZNS_GROUP_CAMPAIGN = "/zalo-zns/group-campaign";
export const BASE_URL_ZALO_ZNS_CAMPAIGN = "/zalo-zns/campaign";
export const BASE_URL_ZALO_ZNS_TEMPLATE = "/zalo-zns/template";
export const BASE_URL_ZALO_ZNS_LIST_CONTACT = "/zalo-zns/list-contact";

//Hotline
export const BASE_URL_HOTLINE_LIST_CONTACT_HOTLINE = "/hotline/list-contact-hotline";

//Commit CV
export const BASE_URL_COMMIT_CV = "/commit-cv";
export const BASE_URL_LANG_PAGE = "/system/lang";

export const BASE_URL_SCAN_CV = "/scan-cv/add";
export const BASE_URL_SCAN_CV_LIST = "/scan-cv/list";


/**
 * COMMON DATA
 */
export const COMMON_DATA_KEY_created_source = "created_source";
export const COMMON_DATA_KEY_created_source_sales_order = "created_source_sales_order";
export const COMMON_DATA_KEY_created_source_employer = "created_source_employer";
export const COMMON_DATA_KEY_old_channel_code_employer = "old_channel_code_employer";
export const COMMON_DATA_KEY_old_channel_code_list_employer = "old_channel_code_list_employer";
export const COMMON_DATA_KEY_branch_name = "branch_name";
export const COMMON_DATA_KEY_employer_business_license_rejected_reason = "employer_business_license_rejected_reason";
export const COMMON_DATA_KEY_employer_company_size = "employer_company_size";
export const COMMON_DATA_KEY_fraud_status = "fraud_status";
export const COMMON_DATA_KEY_employer_company_kind = "employer_company_kind";
export const COMMON_DATA_KEY_employer_is_freemium = "employer_is_freemium";
export const COMMON_DATA_KEY_employer_channel_checkmate = "channel_checkmate";
export const COMMON_DATA_KEY_employer_contact_method = "employer_contact_method";
export const COMMON_DATA_KEY_employer_discharged_reason = "employer_discharged_reason";
export const COMMON_DATA_KEY_seeker_discharged_reason = "seeker_discharged_reason";
export const COMMON_DATA_KEY_employer_email_verified_status = "employer_email_verified_status";
export const COMMON_DATA_KEY_employer_folder = "employer_folder";
export const COMMON_DATA_KEY_employer_support = "employer_support";
export const COMMON_DATA_KEY_employer_locked_reason = "employer_locked_reason";
export const COMMON_DATA_KEY_employer_rejected_reason = "employer_rejected_reason";
export const COMMON_DATA_KEY_employer_rival_type = "employer_rival_type";
export const COMMON_DATA_KEY_employer_staff_age_range = "employer_staff_age_range";
export const COMMON_DATA_KEY_employer_image_action = "employer_image_action";
export const COMMON_DATA_KEY_drop_job_freemium_action = "drop_job_freemium_action";
export const COMMON_DATA_KEY_reason_drop_job_freemium_action = "reason_drop_job_freemium_action";
export const COMMON_DATA_KEY_staff_level = "staff_level";
export const COMMON_DATA_KEY_employer_status = "employer_status";
export const COMMON_DATA_KEY_employer_resign_status = "employer_resign_status";
export const COMMON_DATA_KEY_employer_status_suspect = "employer_status_suspect";
export const COMMON_DATA_KEY_employer_suspect_reason = "employer_suspect_reason";
export const COMMON_DATA_KEY_employer_premium_status = "employer_premium_status";
export const COMMON_DATA_KEY_employer_business_license_status = "employer_business_license_status";
export const COMMON_DATA_KEY_employer_business_license_file = "employer_business_license_file";
export const COMMON_DATA_KEY_employer_report_abuse = "employer_report_abuse";
export const COMMON_DATA_KEY_employer_image_type = "employer_image_type";
export const COMMON_DATA_KEY_employer_unlocked_reason = "employer_unlocked_reason";
export const COMMON_DATA_KEY_booking_canceled_reason = "booking_canceled_reason";
export const COMMON_DATA_KEY_booking_status = "booking_status";
export const COMMON_DATA_KEY_job_status = "job_status";
export const COMMON_DATA_KEY_admin_job_status = "admin_job_status";
export const COMMON_DATA_KEY_job_level_requirement = "job_level_requirement";
export const COMMON_DATA_KEY_job_working_method = "job_working_method";
export const COMMON_DATA_KEY_job_attribute = "job_attribute";
export const COMMON_DATA_KEY_job_probation_duration = "job_probation_duration";
export const COMMON_DATA_KEY_job_salary_range = "job_salary_range";
export const COMMON_DATA_KEY_job_salary_unit = "job_salary_unit";
export const COMMON_DATA_KEY_job_degree_requirement = "job_degree_requirement";
export const COMMON_DATA_KEY_job_gender = "job_gender";
export const COMMON_DATA_KEY_job_experience_range = "job_experience_range";
export const COMMON_DATA_KEY_request_type = "request_type";
export const COMMON_DATA_KEY_job_contact_method = "job_contact_method";
export const COMMON_DATA_KEY_job_is_search_allowed = "job_is_search_allowed";
export const COMMON_DATA_KEY_job_post_status = "job_post_status";
export const COMMON_DATA_KEY_view_per_post_score = "view_per_post_score";
export const COMMON_DATA_KEY_job_post_guarantee_status = "job_post_guarantee_status";
export const COMMON_DATA_KEY_job_rejected_reason = "job_rejected_reason";
export const COMMON_DATA_KEY_area = "area";
export const COMMON_DATA_KEY_invoice_issuance_method = "invoice_issuance_method";
export const COMMON_DATA_KEY_sales_order_is_signature = "sales_order_is_signature";
export const COMMON_DATA_KEY_sales_order_payment_term_method = "sales_order_payment_term_method";
export const COMMON_DATA_KEY_sales_order_payment_method = "sales_order_payment_method";
export const COMMON_DATA_KEY_display_method = "displayed_method";
export const COMMON_DATA_KEY_display_method_booking = "displayed_method_booking";
export const COMMON_DATA_KEY_object_type = "object_type";
export const COMMON_DATA_KEY_call_status = "call_status";
export const COMMON_DATA_KEY_call_type = "call_type";
export const COMMON_DATA_KEY_service_page_type = "service_page_type";
export const COMMON_DATA_KEY_sales_order_status = "sales_order_status";
export const COMMON_DATA_KEY_request_invoices_status = "request_invoices_status";
export const COMMON_DATA_KEY_items_type_campaign = "items_type_campaign";
export const COMMON_DATA_KEY_price_status = "price_status";
export const COMMON_DATA_KEY_service_type = "service_type";
export const COMMON_DATA_KEY_language_code = "language_code";
export const COMMON_DATA_KEY_staff_mode = "staff_mode";
export const COMMON_DATA_KEY_call_review_status = "call_review_status";
export const COMMON_DATA_KEY_call_feedback_status = "call_feedback_status";
export const COMMON_DATA_KEY_division_status = "division_status";
export const COMMON_DATA_KEY_email_template_type = "email_template_type";
export const COMMON_DATA_KEY_role_name = "role_name";
export const COMMON_DATA_KEY_visible_status = "visible_status";
export const COMMON_DATA_KEY_note_hotline_log = "note_hotline_log";
export const COMMON_DATA_KEY_notification_object = "notification_object";
export const COMMON_DATA_KEY_notification_type = "notification_type";
export const COMMON_DATA_KEY_notification_status = "notification_status";
export const COMMON_DATA_KEY_gender = "gender";
export const COMMON_DATA_KEY_admin_gender = "admin_gender";
export const COMMON_DATA_KEY_marital_status = "marital_status";
export const COMMON_DATA_KEY_seeker_status = "seeker_status";
export const COMMON_DATA_KEY_support_type = "support_type";
export const COMMON_DATA_KEY_type_skill_forte = "type_skill_forte";
export const COMMON_DATA_KEY_certificate_rate = "certificate_rate";
export const COMMON_DATA_KEY_mobile_exist = "mobile_exist";
export const COMMON_DATA_KEY_token_mobile = "token_mobile";
export const COMMON_DATA_KEY_token_email = "token_email";
export const COMMON_DATA_KEY_seeker_resume_status = "seeker_resume_status";
export const COMMON_DATA_KEY_seeker_resume_template_status = "resume_template_status";
export const COMMON_DATA_KEY_seeker_rejected_reason = "seeker_rejected_reason";
export const COMMON_DATA_KEY_seeker_has_assigned_staff = "seeker_has_assigned_staff";
export const COMMON_DATA_KEY_language_resume = "language_resume";
export const COMMON_DATA_KEY_language_resume_rate = "language_resume_rate";
export const COMMON_DATA_KEY_resume_type = "resume_type";
export const COMMON_DATA_KEY_resume_status = "resume_status";
export const COMMON_DATA_KEY_resume_has_mobile_status = "seeker_has_mobile";
export const COMMON_DATA_KEY_resume_history_status = "resume_history_status";
export const COMMON_DATA_KEY_resume_status_v2 = "resume_status_v2";
export const COMMON_DATA_KEY_resume_completed = "resume_completed";
export const COMMON_DATA_KEY_time_frame_type = "time_frame_type";
export const COMMON_DATA_KEY_job_support_status = "job_support_status";
export const COMMON_DATA_KEY_job_support_type = "job_support_type";
export const COMMON_DATA_KEY_job_support_frequency = "job_support_frequency";
export const COMMON_DATA_KEY_job_support_log_status = "job_support_log_status";
export const COMMON_DATA_KEY_job_support_tracking_type = "job_support_tracking_type";
export const COMMON_DATA_KEY_resume_salary_range = "resume_salary_range";
export const COMMON_DATA_KEY_resume_working_method = "resume_working_method";
export const COMMON_DATA_KEY_resume_experience_range = "resume_experience_range";
export const COMMON_DATA_KEY_resume_level_requirement = "resume_level_requirement";
export const COMMON_DATA_KEY_resume_degree_requirement = "resume_degree_requirement";
export const COMMON_DATA_KEY_seeker_level = "seeker_level";
export const COMMON_DATA_KEY_resume_rejected_reason = "resume_rejected_reason";
export const COMMON_DATA_KEY_divide_status = "divide_status";
export const COMMON_DATA_KEY_divide_type = "divide_type";
export const COMMON_DATA_KEY_divide_option = "divide_option";
export const COMMON_DATA_KEY_divide_source = "divide_source";
export const COMMON_DATA_KEY_request_status = "request_status";
export const COMMON_DATA_KEY_team_status = "team_status";
export const COMMON_DATA_KEY_question_answer_type = "question_answer_type";
export const COMMON_DATA_KEY_document_kind = "document_kind";
export const COMMON_DATA_KEY_device_type = "device_type";
export const COMMON_DATA_KEY_document_guide_page = "document_guide_page";
export const COMMON_DATA_KEY_sales_order_regis_status = "sales_order_regis_status";
export const COMMON_DATA_KEY_job_age_requirement = "job_age_requirement";
export const COMMON_DATA_KEY_sales_order_regis_status_filter_actived = "sales_order_regis_status_filter_actived";
export const COMMON_DATA_KEY_service_point_history_fe = "service_point_history_fe";
export const COMMON_DATA_KEY_employer_point_resume_guarantee_status = "employer_point_resume_guarantee_status";
export const COMMON_DATA_KEY_employer_guarantee_resume_type = "guarantee_resume_type";
export const COMMON_DATA_KEY_classify_type = "classify_type";
export const COMMON_DATA_KEY_guarantee_verify_type = "guarantee_verify_type";
export const COMMON_DATA_KEY_guarantee_note_list_type = "guarantee_note_list_type";
export const COMMON_DATA_KEY_guarantee_reason = "guarantee_reason";
export const COMMON_DATA_KEY_employer_care_type = "employer_care_type";
export const COMMON_DATA_KEY_accountant_customer_status = "accountant_customer_status";
export const COMMON_DATA_KEY_quotation_status = "quotation_status";
export const COMMON_DATA_KEY_permission_status = "permission_status";
export const COMMON_DATA_KEY_resume_applied_status_V2 = "resume_applied_status_v2";
export const COMMON_DATA_KEY_resume_applied_employer_deleted = "resume_applied_employer_deleted";
export const COMMON_DATA_KEY_article_status = "article_status";
export const COMMON_DATA_KEY_assignment_request_status = "assignment_request_status";
export const COMMON_DATA_KEY_employer_discard_reason = "employer_discard_reason";
export const COMMON_DATA_KEY_status_registration = "status_registration";
export const COMMON_DATA_KEY_auto_load_value = "auto_load_value";
export const COMMON_DATA_KEY_viewed_status = "viewed_status";
export const COMMON_DATA_KEY_employer_status_marketing = "employer_status_marketing";
export const COMMON_DATA_KEY_is_search_allowed = "is_search_allowed";
export const COMMON_DATA_KEY_resume_is_viewed_cv = "resume_is_viewed_cv";
export const COMMON_DATA_KEY_commited_cv_status = "commited_cv_status";
export const COMMON_DATA_KEY_is_applied_status_new = "is_applied_status_new";
export const COMMON_DATA_KEY_complain_status = "complain_status";
export const COMMON_DATA_KEY_complain_type = "complain_type";
export const COMMON_DATA_KEY_status_backup = "status_backup";
export const COMMON_DATA_KEY_job_box_type = "job_box_type";
export const COMMON_DATA_KEY_throw_customer_type = "throw_customer_type";
export const COMMON_DATA_KEY_employer_throwout_type = "employer_throwout_type";
export const COMMON_DATA_KEY_job_guarantee_status = "job_guarantee_status";
export const COMMON_DATA_KEY_statistic_system_meta_key = "statistic_system_meta_key";
export const COMMON_DATA_KEY_statistic_system_meta_object = "statistic_system_meta_object";
export const COMMON_DATA_KEY_service_page_type_full = "service_page_type_full";
export const COMMON_DATA_KEY_seo_template_status = "seo_template_status";
export const COMMON_DATA_KEY_seo_meta_priority = "seo_meta_priority";
export const COMMON_DATA_KEY_employer_assigned_type = "employer_assigned_type";
export const COMMON_DATA_KEY_employer_account_type = "employer_account_type";
export const COMMON_DATA_KEY_customer_not_yet_verify = "customer_not_yet_verify";
export const COMMON_DATA_KEY_type_campaign = "type_campaign";
export const COMMON_DATA_KEY_type_campaign_create = "type_campaign_create";
export const COMMON_DATA_KEY_customer_type_code = "customer_type_code";
export const COMMON_DATA_KEY_customer_suggest_status = "customer_suggest_status";
export const COMMON_DATA_KEY_customer_type = "customer_type";
export const COMMON_DATA_KEY_campaign_status = "campaign_status";
export const COMMON_DATA_KEY_verify_type = "verify_type";
export const COMMON_DATA_KEY_fee_type = "fee_type";
export const COMMON_DATA_KEY_sales_order_items_sub_status = "sales_order_items_sub_status";
export const COMMON_DATA_KEY_LIBRARY_IMAGE_STATUS = "employer_library_image_status";
export const COMMON_DATA_KEY_LIBRARY_IMAGE_REASON = "employer_library_image_reason";
export const COMMON_DATA_KEY_language_level = "language_level";
export const COMMON_DATA_KEY_language_requirement = "language_requirement";
export const COMMON_DATA_KEY_promotion_programs_condition_items = "promotion_programs_condition_items";
export const COMMON_DATA_KEY_promotion_program_sub_conditions_keys = "promotion_program_sub_conditions_keys";
export const COMMON_DATA_KEY_promotion_programs_condition_operation = "promotion_programs_condition_operation";
export const COMMON_DATA_KEY_promotion_programs_status = "promotion_programs_status";
export const COMMON_DATA_KEY_promotion_v2_type = "promotion_v2_type";
export const COMMON_DATA_KEY_promotion_programs_position_apply = "promotion_programs_position_apply";
export const COMMON_DATA_KEY_promotion_detail_v2_position_apply = "promotion_detail_v2_position_apply";
export const COMMON_DATA_KEY_promotion_programs_position_allocate = "promotion_programs_position_allocate";
export const COMMON_DATA_KEY_promotion_detail_v2_position_allocate = "promotion_detail_v2_position_allocate";
export const COMMON_DATA_KEY_config_service_gift_condition_items = "config_service_gift_condition_items";
export const COMMON_DATA_KEY_customer_premium_status = "customer_premium_status";
export const COMMON_DATA_KEY_websites_crawled = "websites_crawled";
export const COMMON_DATA_KEY_list_price_promotion_point = "list_price_promotion_point";
export const COMMON_DATA_KEY_list_price_promotion_point_new = "list_price_promotion_point_new";
export const COMMON_DATA_KEY_revenue_config_kpi_status = "revenue_config_kpi_status";
export const COMMON_DATA_KEY_revenue_config_status = "revenue_config_status";
export const COMMON_DATA_KEY_revenue_config_level = "revenue_config_level";
export const COMMON_DATA_KEY_revenue_config_percent = "revenue_config_percent";
export const COMMON_DATA_KEY_revenue_config_rating = "revenue_config_rating";
export const COMMON_DATA_KEY_kpi_config_detail_condition_items = "kpi_config_detail_condition_items";
export const COMMON_DATA_KEY_kpi_config_detail_condition_operation = "kpi_config_detail_condition_operation";
export const COMMON_DATA_KEY_email_template_load = "email_template_load";
export const COMMON_DATA_KEY_extend_programs_service_type = "extend_programs_service_type";
export const COMMON_DATA_KEY_extend_programs_fee_type = "extend_programs_fee_type";
export const COMMON_DATA_KEY_extend_programs_status = "extend_programs_status";
export const COMMON_DATA_KEY_tool_transfer_process_status = "tool_transfer_process_status";
export const COMMON_DATA_KEY_revenue_staff_position = "revenue_staff_position";
export const COMMON_DATA_KEY_kpi_result = "kpi_result";
export const COMMON_DATA_KEY_point_gift_status = "point_gift_status";
export const COMMON_DATA_KEY_items_group_status = "items_group_status";
export const COMMON_DATA_KEY_bundle_status = "bundle_status";
export const COMMON_DATA_KEY_bundle_display = "bundle_display";
export const COMMON_DATA_KEY_bundle_type = "bundle_type";
export const COMMON_DATA_KEY_sales_order_package = "sales_order_package";
export const COMMON_DATA_KEY_employer_internal_channel_code = "employer_internal_channel_code";
export const COMMON_DATA_KEY_employer_internal_type = "employer_internal_type";
export const COMMON_DATA_KEY_ldp_type = "ldp_type";
export const COMMON_DATA_KEY_employer_guarantee_status = "employer_guarantee_status";
export const COMMON_DATA_KEY_sales_order_opportunity = "sales_order_opportunity";
export const COMMON_DATA_KEY_quotation_request_status = "quotation_request_status";
export const COMMON_DATA_KEY_quotation_request_type = "quotation_request_type";
export const COMMON_DATA_KEY_status_trial = "status_trial";
export const COMMON_DATA_KEY_employer_freemium_status = "employer_freemium_status";
export const COMMON_DATA_KEY_employer_freemium_is_new = "employer_freemium_is_new";
export const COMMON_DATA_KEY_employer_is_trial = "employer_is_trial";
export const COMMON_DATA_KEY_employer_class = "employer_class";
export const COMMON_DATA_KEY_employer_filter_channel_checkmate = "employer_channel_checkmate";
export const COMMON_DATA_KEY_employer_freemium = "employer_freemium";
export const COMMON_DATA_KEY_room_type = "room_type";
export const COMMON_DATA_KEY_payment_status = "payment_status";
export const COMMON_DATA_KEY_transaction_status = "transaction_status";
export const COMMON_DATA_KEY_transaction_type = "transaction_type";
export const COMMON_DATA_KEY_transaction_log_type = "transaction_log_type";
export const COMMON_DATA_KEY_transaction_status_confirm = "transaction_status_confirm";
export const COMMON_DATA_KEY_transaction_internal = "transaction_internal";
export const COMMON_DATA_KEY_request_approve_status = "request_approve_status";
export const COMMON_DATA_KEY_confirm_payment_status = "confirm_payment_status";
export const COMMON_DATA_KEY_statement_mapping = "statement_mapping";
export const COMMON_DATA_KEY_statement_test = "statement_test";
export const COMMON_DATA_KEY_audience_condition_items = "audience_condition_items";
export const COMMON_DATA_KEY_experiment_status = "experiment_status";
export const COMMON_DATA_KEY_bank_status = "bank_status";
export const COMMON_DATA_KEY_experiment_type = "experiment_type";
export const COMMON_DATA_KEY_sales_order_by_field_status = "sales_order_by_field_status";
export const COMMON_DATA_KEY_sales_order_by_field_items_level = "sales_order_by_field_items_level";
export const COMMON_DATA_KEY_sales_order_by_field_items_guarantee = "sales_order_by_field_items_guarantee";
export const COMMON_DATA_KEY_field_registration_status = "field_registration_status";
export const COMMON_DATA_KEY_compensation_recruitment_status = "compensation_recruitment_status";
export const COMMON_DATA_KEY_applied_status = "applied_status";
export const COMMON_DATA_KEY_jd_template_status = "jd_template_status";
export const COMMON_DATA_KEY_sales_order_schedule_checkout_status = "sales_order_schedule_checkout_status";
export const COMMON_DATA_KEY_payment_term_method_checkmate = "payment_term_method_checkmate";
export const COMMON_DATA_KEY_field_promotion_programs_status = "field_promotion_programs_status";
export const COMMON_DATA_KEY_flag_status = "flag_status";
export const COMMON_DATA_KEY_survey_type = "survey_type";
export const COMMON_DATA_KEY_GIFT_PACKAGE = 3;
export const COMMON_DATA_KEY_customer_status = "customer_status";
export const COMMON_DATA_KEY_exchange_sales_order_status = "exchange_sales_order_status";
export const COMMON_DATA_KEY_sales_order_status_in_payment = "sales_order_status_in_payment";
export const COMMON_DATA_KEY_BANK_STATUS_PRINT_SHOW = 1;
export const COMMON_DATA_KEY_BANK_STATUS_PRINT_HIDE = 2;
export const COMMON_DATA_KEY_headhunt_campaign_status = "headhunt_campaign_status";
export const COMMON_DATA_KEY_headhunt_campaign_type = "headhunt_campaign_type";
export const COMMON_DATA_KEY_headhunt_group_member_rule = "headhunt_group_member_rule";
export const COMMON_DATA_KEY_headhunt_group_division = "headhunt_group_division";
export const COMMON_DATA_KEY_headhunt_applicant_status = "headhunt_applicant_status";
export const COMMON_DATA_KEY_headhunt_applicant_source = "headhunt_applicant_source";
export const COMMON_DATA_KEY_headhunt_applicant_reason_status = "headhunt_applicant_reason_status";
export const COMMON_DATA_KEY_headhunt_contract_status = "headhunt_contract_status";
export const COMMON_DATA_KEY_headhunt_applicant_status_status = "headhunt_applicant_status_status";
export const COMMON_DATA_KEY_headhunt_pipeline_action_result = "headhunt_pipeline_action_result";
export const COMMON_DATA_KEY_headhunt_candidate_bank_status = "headhunt_candidate_bank_status";
export const COMMON_DATA_KEY_headhunt_candidate_bank_result = "headhunt_candidate_bank_result";
export const COMMON_DATA_KEY_sku_headhunt_quantity = "sku_headhunt_quantity";
export const COMMON_DATA_KEY_assign_cross_selling = "cross_selling";
export const COMMON_DATA_KEY_category_status = "category_status";
export const COMMON_DATA_KEY_sku_status = "sku_status";
export const COMMON_DATA_KEY_sku_quantity = "sku_quantity";
export const COMMON_DATA_KEY_bundle_quantity = "bundle_quantity";
export const COMMON_DATA_KEY_product_package_status = "product_package_status";
export const COMMON_DATA_KEY_sales_order_status_v2 = "sales_order_status_v2";
export const COMMON_DATA_KEY_price_list_status_v2 = "price_list_status_v2";
export const COMMON_DATA_KEY_region = "region";
export const COMMON_DATA_KEY_product_unit = "product_unit";
export const COMMON_DATA_KEY_promotion_v2_status = "promotion_v2_status";
export const COMMON_DATA_KEY_payment_debt_status = "payment_debt_status";
export const COMMON_DATA_KEY_exchange_sales_order_v2_status = "exchange_sales_order_v2_status";
export const COMMON_DATA_KEY_sku_branch = "sku_branch";
export const COMMON_DATA_KEY_email_marketing_list_contact_type = "email_marketing_list_contact_type";
export const COMMON_DATA_KEY_email_marketing_status = "email_marketing_status";
export const COMMON_DATA_KEY_email_marketing_template_status = "email_marketing_template_status";
export const COMMON_DATA_KEY_email_campaign_template_status = "email_campaign_template_status";
export const COMMON_DATA_KEY_campaign_cross_sell_type = "campaign_cross_sell_type";
export const COMMON_DATA_KEY_sales_order_status_headhunt = "sales_order_status_headhunt";
export const COMMON_DATA_KEY_email_marketing_campaign_type = "email_marketing_campaign_type";
export const COMMON_DATA_KEY_headhunt_acceptance_record_type = "headhunt_acceptance_record_type";
export const COMMON_DATA_KEY_headhunt_acceptance_record_status = "headhunt_acceptance_record_status";
export const COMMON_DATA_KEY_headhunt_applicant_acceptance_status = "headhunt_applicant_acceptance_status";
export const COMMON_DATA_KEY_email_marketing_campaign_detail_status = "email_marketing_campaign_detail_status";
export const COMMON_DATA_KEY_email_marketing_campaign_unsubscribe_type = "email_marketing_campaign_unsubscribe_type";
export const COMMON_DATA_KEY_headhunt_email_template_status = "headhunt_email_template_status";
export const COMMON_DATA_KEY_headhunt_recruitment_request_status = "headhunt_recruitment_request_status";
export const COMMON_DATA_KEY_headhunt_job_request_status = "headhunt_job_request_status";
export const COMMON_DATA_KEY_service_package_status = "config_gift_service_package_status";
export const COMMON_DATA_KEY_type_register_advise_package_pro = "type_register_advise_package_pro_landing_page";
export const COMMON_DATA_KEY_account_service = "account_service";
export const COMMON_DATA_KEY_account_service_lead = "account_service_lead";
export const COMMON_DATA_KEY_account_service_manager = "account_service_manager";
export const COMMON_DATA_KEY_status_campaign = "status_campaign";
export const COMMON_DATA_KEY_status_campaign_search_resume = "status_campaign_search_resume";
export const COMMON_DATA_KEY_account_service_status = "account_service_status";
export const COMMON_DATA_KEY_advisory_register_type = "advisory_register_type";
export const COMMON_DATA_KEY_effects = "effects";
export const COMMON_DATA_KEY_email_marketing_group_campaign_status = "email_marketing_group_campaign_status";
export const COMMON_DATA_KEY_email_marketing_list_contract_status = "email_marketing_list_contract_status";
export const COMMON_DATA_KEY_jobbox_type = "jobbox_type";
export const COMMON_DATA_KEY_subscription_type = "subscription_type";
export const COMMON_DATA_KEY_type_sales_order_id = "type_sales_order_id";
export const COMMON_DATA_KEY_team_call_line = "team_call_line";
export const COMMON_DATA_KEY_gamification_challenges_category_status = "gamification_challenges_category_status";
export const COMMON_DATA_KEY_gamification_challenges_status = "gamification_challenges_status";
export const COMMON_DATA_KEY_gamification_event_status = "gamification_event_status";
export const COMMON_DATA_KEY_gamification_reward_status = "gamification_reward_status";
export const COMMON_DATA_KEY_gamification_reward_condition_status = "gamification_reward_condition_status";
export const COMMON_DATA_KEY_gamification_point_status = "gamification_point_status";
export const COMMON_DATA_KEY_call_center_label = "call_center_label";
export const COMMON_DATA_KEY_is_type = "is_type";
export const COMMON_DATA_KEY_headhunt_candidate_status = "headhunt_candidate_status";
export const COMMON_DATA_KEY_headhunt_exist_applicant_status = "headhunt_exist_applicant_status";
export const COMMON_DATA_KEY_zalo_zns_group_campaign_status = "zalo_zns_group_campaign_status";
export const COMMON_DATA_KEY_zalo_zns_campaign_status = "zalo_zns_campaign_status";
export const COMMON_DATA_KEY_zalo_zns_list_contact_status = "zalo_zns_list_contact_status";
export const COMMON_DATA_KEY_zalo_zns_template_status = "zalo_zns_template_status";
export const COMMON_DATA_KEY_zalo_zns_campaign_detail_status = "zalo_zns_campaign_detail_status";
export const COMMON_DATA_KEY_zalo_zns_campaign_detail_status_zalo = "zalo_zns_campaign_detail_status_zalo";
export const COMMON_DATA_KEY_zalo_zns_list_contact_type = "zalo_zns_list_contact_type";
export const COMMON_DATA_KEY_list_price_promotion_cv = "list_price_promotion_cv";
export const COMMON_DATA_KEY_account_service_resume_is_sent = "account_service_resume_is_sent";
export const COMMON_DATA_KEY_is_seen_resume_account_service = "is_seen_resume_account_s4ervice";
export const COMMON_DATA_KEY_type_campaign_history = "type_campaign_history";
export const COMMON_DATA_KEY_customer_import_history_status = "customer_import_history_status";
export const COMMON_DATA_KEY_history_service_vtn_type = "history_service_vtn_type";
export const COMMON_DATA_KEY_group_campaign_status = "group_campaign_status";
export const COMMON_DATA_KEY_list_log_promotion_program_status = "list_log_promotion_program_status";
export const COMMON_DATA_KEY_employer_with_code_promotion_status = "employer_with_code_promotion_status";
export const COMMON_DATA_KEY_employer_with_code_promotion_email_status = "employer_with_code_promotion_email_status";
export const COMMON_DATA_KEY_headhunt_applicant_evaluation = "headhunt_applicant_evaluation";
export const COMMON_DATA_KEY_headhunt_candidate_bank_evaluation = "headhunt_candidate_bank_evaluation";
export const COMMON_DATA_KEY_headhunt_candidate_email_verify = "headhunt_candidate_email_verify";
export const COMMON_DATA_KEY_status_group_survey = "status_group_survey";
export const COMMON_DATA_KEY_applicant_channel_code = "applicant_channel_code";
export const COMMON_DATA_KEY_promotion_program_sub_conditions_items_type = "promotion_program_sub_conditions_items_type";
export const COMMON_DATA_KEY_headhunt_customer_source = "headhunt_customer_source";
export const COMMON_DATA_KEY_headhunt_customer_info_result = "headhunt_customer_info_result";
export const COMMON_DATA_KEY_marketing_type = "marketing_type";
export const COMMON_DATA_KEY_combo_group = "combo_group";
export const COMMON_DATA_KEY_combo_items_group_status = "combo_items_group_status";
export const COMMON_DATA_KEY_type_campaign_post = "type_campaign_post";
export const COMMON_DATA_KEY_type_campaign_flexible = "type_campaign_flexible";
export const COMMON_DATA_KEY_type_campaign_brand = "type_campaign_brand";
export const COMMON_DATA_KEY_banner_type = "banner_type";
export const COMMON_DATA_KEY_system_lang_type = "system_lang_type";

export const COMMON_DATA_KEY_opportunity_ability_map = "opportunity_ability_map";
export const COMMON_DATA_KEY_opportunity_active_status = "opportunity_active_status";
export const COMMON_DATA_KEY_opportunity_ability = "opportunity_ability";
export const COMMON_DATA_KEY_opportunity_level = "opportunity_level";
export const COMMON_DATA_KEY_opportunity_status_cancel = "opportunity_status_cancel";
export const COMMON_DATA_KEY_opportunity_package_type = "opportunity_package_type";
export const COMMON_DATA_KEY_opportunity_priority = "opportunity_priority";
export const COMMON_DATA_KEY_opportunity_status = "opportunity_status";
export const COMMON_DATA_KEY_opportunity_contact_status = "opportunity_contact_status";
export const COMMON_DATA_KEY_opportunity_keep_status = "opportunity_keep_status";
export const COMMON_DATA_KEY_opportunity_keep_reason = "opportunity_keep_reason";
export const COMMON_DATA_KEY_opportunity_keywords = "opportunity_keywords";
export const COMMON_DATA_KEY_opportunity_send_quote_status = "opportunity_send_quote_status";
export const COMMON_DATA_KEY_opportunity_response_quote_status = "opportunity_response_quote_status";
export const COMMON_DATA_KEY_opportunity_cancel_reason_5 = "opportunity_cancel_reason_5";
export const COMMON_DATA_KEY_opportunity_cancel_reason_6 = "opportunity_cancel_reason_6";
export const COMMON_DATA_KEY_opportunity_cancel_reason_7 = "opportunity_cancel_reason_7";
export const COMMON_DATA_KEY_opportunity_cancel_reason_1 = "opportunity_cancel_reason_1";
export const COMMON_DATA_KEY_opportunity_cancel_reason_2 = "opportunity_cancel_reason_2";
export const COMMON_DATA_KEY_opportunity_cancel_reason_4 = "opportunity_cancel_reason_4";
export const COMMON_DATA_KEY_opportunity_cancel_reason_99 = "opportunity_cancel_reason_99";
export const COMMON_DATA_KEY_opportunity_cancel_reason_system = "opportunity_cancel_reason_system";
export const COMMON_DATA_KEY_opportunity_email_template_status = "opportunity_email_template_status";
export const COMMON_DATA_KEY_branch_code_for_room = "branch_code_for_room";
export const COMMON_DATA_KEY_sales_ops_approve_sales_order_status = "sales_ops_approve_sales_order_status";

/**
 * FUNCTION CONSTANT
 */
export const orderByList = (type) => {
  let list = {};
  if (type === 1) {
    list[ORDER_BY_NONE] = "";
    list[ORDER_BY_ASC] = "ASC";
    list[ORDER_BY_DESC] = "DESC";
  }
  if (type === 2) {
    list[""] = ORDER_BY_NONE;
    list["ASC"] = ORDER_BY_ASC;
    list["DESC"] = ORDER_BY_DESC;
  }
  return list;
};

export const rankTypeList = () => {
  let list = {};
  list[RANK_TYPE_ALL] = {
    title: "Tất cả kênh",
    key_count: "count_team_all",
  };
  list[RANK_TYPE_CHANNEL] = {
    title: "Toàn kênh",
    key_count: "count_team_channel",
  };
  list[RANK_TYPE_BRANCH] = {
    title: "Toàn chi nhánh",
    key_count: "count_team_branch",
  };
  return list;
};

export const STATUS_TRIAL_ACTIVE = 1;
export const STATUS_TRIAL_INACTIVE = 2;
// export const LINK_EXPORT_EXCEL_CASH_BY_CHANNEL_CODE = {
//     [CHANNEL_CODE_TVN]: 'https://cdn1.timviecnhanh.com/file/excel/2021/06/25/template_import_cash_162460556987.xlsx',
//     [CHANNEL_CODE_VL24H]: 'https://cdn1.vieclam24h.vn/file/excel/2021/06/25/template_import_cash_162460568766.xlsx',
//     [CHANNEL_CODE_MW]: 'https://cdn.mywork.com.vn/file/excel/2021/06/25/template_import_cash_162460570983.xlsx',
// };

export const CONFIG_EMAIL_ACCOUNT_SERVICE_CONTROL_SOUTH = "sales_order.email_accountant_service_control_south";
export const CONFIG_EMAIL_ACCOUNT_SERVICE_CONTROL_NORTH = "sales_order.email_accountant_service_control_north";
export const Default_Email_Opportunity_Email_Template = "default_email_opportunity_email_template";
export const CUSTOMER_STATUS_ACTIVE = 1;
export const CUSTOMER_STATUS_INACTIVE = 2;
export const COMMON_DATA_KEY_company_status = "company_status";
export const COMPANY_STATUS_ACTIVE = 1;
export const CONFIRM_PAYMENT_STATUS_CONFIRMED = 1;
export const CONFIRM_PAYMENT_STATUS_NOT_SEND_MAIL_YET = 0;
export const CONFIRM_PAYMENT_STATUS_SENT_MAIL_AND_WAITING_CONFIRM = 2;
export const PARAM_PAGE_CALL_MOBIBLE_STATISTIC = "call_mobile_statistic";
export const COMMON_DATA_KEY_call_inline_status = "call_status";
export const COMMON_DATA_KEY_type_campaign_job_by_field = "type_campaign_job_by_field";
export const REFERRAL_FROM_HOME_PAGE = "home-page";
export const COMMON_DATA_KEY_registration_guarantee_type = "registration_guarantee_type";

export const CUSTOMER_FIELD_DETAIL = {
  tax_code: "Mã số thuế",
  company_name: "Tên công ty",
  address: "Địa chỉ",
  branch_name: "Tên thương hiệu",
  type_of_business: "Loại hình doanh nghiệp",
  fields_activity: "Lĩnh vực hoạt động",
  founding_at: "Ngày thành lập",
  product_service: "Sản phẩm dịch vụ hiện tại",
  website: "Website",
  about_us: "Giới thiệu công ty",
  revenue: "Doanh thu 3 năm gần nhất",
  profit: "Lợi nhuận 3 năm gần nhất",
};

export const CUSTOMER_FIELD_TYPE = {
  staff_lead: "Lead",
  staff_sale: "Sale",
  staff_recruiter: "Recruiter",
};

export const CUSTOMER_FIELD_CONTACT = {
  email: "Email",
  phone: "Số điện thoại",
  name: "Tên",
  position: "Vị trí",
  time_at_company: "Thời gian làm việc tại Công ty",
  time_at_industry: "Thời gian làm việc trong ngành",
  link_profile: "Link Profile",
};

// SOv2
export const CATEGORY_STATUS_ACTIVE = 1;
export const CATEGORY_STATUS_INACTIVE = 2;

export const SKU_STATUS_ACTIVE = 1;
export const SKU_STATUS_INACTIVE = 2;

export const PRODUCT_PACKAGE_STATUS_ACTIVE = 1;
export const PRODUCT_PACKAGE_STATUS_INACTIVE = 2;

export const SKU_PRICE_STATUS_ACTIVE = 1;
export const SKU_PRICE_STATUS_INACTIVE = 2;

export const PROMOTION_PROGRAM_STATUS_ACTIVE = 1;
export const PROMOTION_PROGRAM_POSITION_APPLY_PACKAGE = 1;
export const PROMOTION_DETAIL_STATUS_DELETE = 99;

export const SALES_ORDER_V2_STATUS_DRAFT = 10;
export const SALES_ORDER_V2_STATUS_SUBMITTED = 15;
export const SALES_ORDER_V2_STATUS_CONFIRMED = 20;
export const SALES_ORDER_V2_STATUS_REJECTED = 30;
export const SALES_ORDER_V2_STATUS_APPROVED = 40;
export const SALES_ORDER_V2_STATUS_DELETED = 99;

export const PAYMENT_DEBT_STATUS_DRAFT = 10;
export const PAYMENT_DEBT_STATUS_SUBMITTED = 15;
export const PAYMENT_DEBT_STATUS_REJECTED = 30;
export const PAYMENT_DEBT_STATUS_APPROVED = 40;

export const EXCHANGE_V2_STATUS_NEW = 10;
export const EXCHANGE_V2_STATUS_SUBMITTED = 15;
export const EXCHANGE_V2_STATUS_REJECTED = 30;
export const EXCHANGE_V2_STATUS_APPROVED = 40;
export const EXCHANGE_V2_STATUS_DELETE = 99;

export const TYPE_PRINT_PDK = 1;
export const TYPE_PRINT_PBG = 2;

export const TYPE_BUNDLE_UNIT = "bundles";

export const TYPE_SEND_EMAIL_MARKETING_CAMPAIGN = 1;
export const TYPE_SEND_EMAIL_MARKETING_CAMPAIGN_TEST = 2;

export const EMAIL_MARKETING_CAMPAIGN_ACTIVE = 1;
export const EMAIL_MARKETING_CAMPAIGN_INACTIVE = 2;
export const EMAIL_MARKETING_CAMPAIGN_SENT = 10;
export const EMAIL_MARKETING_CAMPAIGN_DELETE = 99;
export const EMAIL_MARKETING_LIST_CONTACT_FILE_IMPORT_SAMPLE = "/file-download/list-contact-detail-import.xlsx";
export const ZALO_ZNS_LIST_CONTACT_FILE_IMPORT_SAMPLE = "/file-download/list-contact-detail-import.xlsx";

export const COMMON_DATA_KEY_promotion_object_code = "object_code";
export const COMMON_DATA_KEY_promotion_category = "promotion_category";
export const COMMON_DATA_KEY_promotion_type_discount = 1;
export const COMMON_DATA_KEY_promotion_type_gift = 2;
export const COMMON_DATA_KEY_position_apply_specific_item = 3;

export const HEADHUNT_CONTRACT_STATUS_INACTIVE = 2;
export const HEADHUNT_CONTRACT_STATUS_DRAFT = 10;
export const HEADHUNT_CONTRACT_STATUS_SUBMITTED = 15;
export const HEADHUNT_CONTRACT_STATUS_CONFIRMED = 20;
export const HEADHUNT_CONTRACT_STATUS_REJECTED = 30;
export const HEADHUNT_CONTRACT_STATUS_APPROVED = 40;
export const HEADHUNT_CONTRACT_STATUS_DELETED = 99;

export const SALES_ORDER_HEADHUNT_STATUS_DRAFT = 10;
export const SALES_ORDER_HEADHUNT_STATUS_SUBMITTED = 15;
export const SALES_ORDER_HEADHUNT_STATUS_CONFIRMED = 20;
export const SALES_ORDER_HEADHUNT_STATUS_REJECTED = 30;
export const SALES_ORDER_HEADHUNT_STATUS_APPROVED = 40;
export const SALES_ORDER_HEADHUNT_STATUS_DELETED = 99;

export const ACCEPTANCE_RECORD_HEADHUNT_STATUS_DRAFT = 10;
export const COMMON_DATA_KEY_CONFIG_GIFT_SERVICE_PACKAGE_CRITERIA = "config_gift_service_package_criteria";
export const COMMON_DATA_KEY_BUNDLES_TYPE_CAMPAIGN = "bundles_type_campaign";
export const COMMON_DATA_KEY_BUNDLES_AGE = "bundles_age";
export const EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_MARKETING = 1;
export const EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_TRANSACTION = 2;

export const HEADHUNT_ACCEPTANCE_RECORD_STATUS_DRAFT = 10;
export const HEADHUNT_ACCEPTANCE_RECORD_STATUS_SUBMITTED = 15;
export const HEADHUNT_ACCEPTANCE_RECORD_STATUS_CONFIRMED = 20;
export const HEADHUNT_ACCEPTANCE_RECORD_STATUS_REJECTED = 30;
export const HEADHUNT_ACCEPTANCE_RECORD_STATUS_APPROVED = 40;
export const HEADHUNT_ACCEPTANCE_RECORD_STATUS_DELETED = 99;

export const HEADHUNT_ACCEPTANCE_RECORD_STATUS_ACTIVE = 1;
export const HEADHUNT_RECRUITMENT_REQUEST_STATUS_ACTIVE = 1;

export const ACCOUNT_SERVICE_ACCEPTANCE_RECORD_STATUS_ACTIVE = 1;

export const FREEMIUM_CONFIG_STATUS_APPROVED = 1;
export const FREEMIUM_CONFIG_STATUS_NEW = 2;
export const FREEMIUM_CONFIG_STATUS_PAUSED = 3;
export const FREEMIUM_CONFIG_STATUS_COMPLETED = 4;
export const FREEMIUM_CONFIG_STATUS_EXPIRED = 5;
export const FREEMIUM_CONFIG_STATUS_DELETED = 99;

export const EMPLOYER_FREEMIUM_ACTIVE = 2;
export const EMPLOYER_FREEMIUM_APPROVE = 1;
export const EMPLOYER_FREEMIUM_REMOVE = 99;

export const BUNDLES_TYPE_CAMPAIGN_GIFT_TYPE = 3;

export const COMMON_DATA_KEY_freemium_pro_status = "freemium_pro_status";

export const HEADHUNT_APPLICANT_STATUS_UN_DISABLE = 2;
export const HEADHUNT_APPLICANT_STATUS_DISABLE = 1;
export const HEADHUNT_APPLICANT_STATUS_DEFAULT = 1;

export const CAMPAIGN_NEW = 1;
export const CAMPAIGN_DOING = 2;
export const CAMPAIGN_DONE = 3;
export const CAMPAIGN_DELETED = 99;

export const AS_FILTER_RESUME_CAMPAIGN_ACTIVE = 1;
export const AS_FILTER_RESUME_CAMPAIGN_INACTIVE = 2;
export const AS_FILTER_RESUME_CAMPAIGN_COMPLETE = 3;
export const AS_FILTER_RESUME_CAMPAIGN_NOT_APPROVED = 4;
export const AS_FILTER_RESUME_CAMPAIGN_EXPIRED = 5;

export const NAME_ACCOUNT_SERVICE = "Gói quản lý tài khoản Nhà Tuyển Dụng";
export const RECRUITER_ASSISTANT_BUY_TYPE = 1;
export const RECRUITER_ASSISTANT_GIFT_TYPE = 2;

export const COMMON_DATA_KEY_combo_package_condition_items = "config_combo_package_condition_items";
export const COMMON_DATA_KEY_subscription_package_condition_items = "config_subscription_package_condition_items";
export const DEFAULT_VALUE_SUBSCRIPTION_CONDITION = "sales-order.net_sale";
export const DEFAULT_VALUE_TYPE_COMBO = 1;
export const DEFAULT_VALUE_TYPE_SUBSCRIPTION = 2;

export const EMAIL_MARKETING_GROUP_CAMPAIGN_STATUS_ACTIVED = 1;

export const BASED_PRICE_PRO = 100000000;

export const SUBSCRIPTION_TYPE_PLUS_VALUE = 2;
export const SUBSCRIPTION_TYPE_PRO_VALUE = 3;
export const COMBO_SERVICE_POINT_TYPE = 3;

export const GAMIFICATION_CHALLENGE_CATEGORY_STATUS_DRAFT = 10;
export const GAMIFICATION_CHALLENGE_CATEGORY_STATUS_OFF = 20;
export const GAMIFICATION_CHALLENGE_CATEGORY_STATUS_ON = 30;
export const GAMIFICATION_CHALLENGE_CATEGORY_STATUS_DELETE = 99;

export const GAMIFICATION_CHALLENGE_STATUS_DRAFT = 10;
export const GAMIFICATION_CHALLENGE_STATUS_OFF = 20;
export const GAMIFICATION_CHALLENGE_STATUS_ON = 30;
export const GAMIFICATION_CHALLENGE_STATUS_DELETE = 99;

export const GAMIFICATION_EVENT_STATUS_DRAFT = 10;
export const GAMIFICATION_EVENT_STATUS_OFF = 20;
export const GAMIFICATION_EVENT_STATUS_ON = 30;
export const GAMIFICATION_EVENT_STATUS_DELETE = 99;

export const GAMIFICATION_REWARD_STATUS_DRAFT = 10;
export const GAMIFICATION_REWARD_STATUS_OFF = 20;
export const GAMIFICATION_REWARD_STATUS_ON = 30;
export const GAMIFICATION_REWARD_STATUS_DELETE = 99;

export const GAMIFICATION_REWARD_CONFIG_STATUS_DRAFT = 10;
export const GAMIFICATION_REWARD_CONFIG_STATUS_OFF = 20;
export const GAMIFICATION_REWARD_CONFIG_STATUS_ON = 30;
export const GAMIFICATION_REWARD_CONFIG_STATUS_DELETE = 99;

export const GAMIFICATION_POINT_STATUS_DRAFT = 10;
export const GAMIFICATION_POINT_STATUS_OFF = 20;
export const GAMIFICATION_POINT_STATUS_ON = 30;
export const GAMIFICATION_POINT_STATUS_DELETE = 99;

export const GAMIFICATION_REWARD_CONDITION_STATUS_DRAFT = 10;
export const GAMIFICATION_REWARD_CONDITION_STATUS_OFF = 20;
export const GAMIFICATION_REWARD_CONDITION_STATUS_ON = 30;
export const GAMIFICATION_REWARD_CONDITION_STATUS_DELETE = 99;

export const HEADHUNT_EXIST_APPLICANT_YES = 1;
export const HEADHUNT_STAFF_SEEN_YES = 1;
export const HEADHUNT_STAFF_SEEN_NO = 2;

export const ZALO_ZNS_GROUP_CAMPAIGN_STATUS_ACTIVED = 1;
export const RESUME_STATUS_ACTIVED = 1;
export const RESUME_HISTORY_STATUS_FRAUD = 4;
export const RESUME_HISTORY_STATUS_INACTIVE = 2;
export const RESUME_HISTORY_TYPE_QUICK_APPLIED = 3;
export const RESUME_STATUS_REQUEST_ACTIVED = 12;
export const ZALO_ZNS_TEMPLATE_STATUS_ENABLE = "ENABLE";
export const ZALO_ZNS_TEMPLATE_STATUS_REJECT = "REJECT";

export const TYPE_SEND_ZALO_CAMPAIGN = 1;
export const TYPE_SEND_ZALO_CAMPAIGN_TEST = 2;
export const APPLICANT_INFO_STATUS_CONTACT_SHOW = 1;
export const APPLICANT_INFO_STATUS_CONTACT_HIDE = 2;

export const ACCOUNT_SERVICE_FILTER_RESUME_CAMPAIGN_TYPE_JOB = 1;
export const ACCOUNT_SERVICE_FILTER_RESUME_CAMPAIGN_TYPE_OTHER = 2;

export const IS_SENT_EMAIL_RESUME = 1;
export const HEADHUNT_FILE_IMPORT_CUSTOMER_SAMPLE = "/file-download/list-customer-import.xlsx";
export const HEADHUNT_FILE_IMPORT_APPLICANT_SAMPLE = "/file-download/list-applicant-import.xlsx";
export const HEADHUNT_FILE_IMPORT_CANDIDATE_SAMPLE = "/file-download/list-candidate-import.xlsx";
export const HEADHUNT_FILE_IMPORT_CONTACT_SAMPLE = "/file-download/list-customer-contact-import.xlsx";
export const HEADHUNT_FILE_IMPORT_CHECK_MST_SAMPLE = "/file-download/check-list-customer-import.xlsx";
export const HEADHUNT_ACCEPTANCE_RECORD_TYPE_GUARANTEE = 2;
export const HEADHUNT_ACCEPTANCE_RECORD_TYPE_NEW = 1;

export const THE_NEXT_10_MINUTES = 600000;
export const ACTIVE_STATUS_GROUP_CAMPAIGN_ITEM = 1;
export const INACTIVE_STATUS_GROUP_CAMPAIGN_ITEM = 2;

export const GROUP_SURVEY_ACTIVE = 1;
export const GROUP_SURVEY_INACTIVE = 2;
export const GROUP_SURVEY_DELETE = 99;

export const IMPORT_HISTORY_TYPE_CUSTOMER = 1;
export const IMPORT_HISTORY_TYPE_APPLICANT = 2;
export const IMPORT_HISTORY_TYPE_CANDIDATE = 3;
export const IMPORT_HISTORY_TYPE_CONTACT = 4;
export const IMPORT_HISTORY_TYPE_CHECK_MST = 10;

export const VL24H_JOBBOX_BASIC = "vl24h.jobbox.basic";

export const RESUME_APPLIED_STATUS_FRAUD = 4;

export const VIEW_PER_POST_SCORE = 1;
export const OPPORTUNITY_CANCEL_STATUS_NORMAL = 99;

export const COMMON_DATA_KEY_CUSTOMER_DEMAND = "customer_demand";
export const COMMON_DATA_KEY_EMPLOYER_HOTLINE_STATUS = "employer_hotline_status";
export const COMMON_DATA_KEY_EMPLOYER_HOTLINE_TYPE = "employer_hotline_assigned_type";

export const COMMON_DATA_KEY_SYSTEM_LANG_LIST = "system_lang_list";

export const COMPO_GROUP_SERVICE_POINT = "SERVICE_POINT";
export const COMPO_GROUP_TYPE_CAMPAIGN_4 = 4;

export const NO_NEED_INVOICE_ISSUANCE = 3;

export const NEED_APPROVE_REQUEST_INVOICES = 2;

export const SPECIAL_CASE_ROOM_TYPE = 9;
export const VERIFY_ROOM_TYPE = 10;

// Trạng thái bình thường = 3
export const FRAUD_STATUS_DEFAULT = 3

export const CUSTOMER_TYPE_CODE_MST = 1
export const CUSTOMER_TYPE_CODE_CCCD = 2

export const EMPLOYER_ACCOUNT_TYPE_COMPANY = 2
export const EMPLOYER_ACCOUNT_TYPE_PERSONAL = 1
