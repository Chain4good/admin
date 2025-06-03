export const AuthV1 = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_PROFILE: "/auth/profile",
};

export const CategoryV1 = {
  GET_CATEGORIES: "/categories",
  GET_CATEGORY: "/categories",
  CREATE_CATEGORY: "/categories",
  UPDATE_CATEGORY: "/categories",
  DELETE_CATEGORY: "/categories",
};

export const CountryV1 = {
  GET_COUNTRIES: "/countries",
  GET_COUNTRY: "/countries",
  CREATE_COUNTRY: "/countries",
  UPDATE_COUNTRY: "/countries",
  DELETE_COUNTRY: "/countries",
};

export const FundraiseTypeV1 = {
  GET_FUNDRAISE_TYPES: "/fundraise-types",
  GET_FUNDRAISE_TYPE: "/fundraise-types",
  CREATE_FUNDRAISE_TYPE: "/fundraise-types",
  UPDATE_FUNDRAISE_TYPE: "/fundraise-types",
  DELETE_FUNDRAISE_TYPE: "/fundraise-types",
};

export const UploadV1 = {
  UPLOADS: "/uploads",
};
export const CoverV1 = {
  CREATE_COVER: "/covers",
};

export const CampaignV1 = {
  GET_CAMPAIGNS: "/campaigns",
  GET_CAMPAIGN: "/campaigns",
  CREATE_CAMPAIGN: "/campaigns",
  UPDATE_CAMPAIGN: "/campaigns",
  DELETE_CAMPAIGN: "/campaigns",
  GET_MY_CAMPAIGNS: "/campaigns/my-campaigns",
  GET_CALCULATE_ETH_GOAL: "/campaigns/calculate-eth-goal",
};

export const DonationV1 = {
  GET_DONATIONS: "/donations",
  GET_DONATION: "/donations",
  CREATE_DONATION: "/donations",
  UPDATE_DONATION: "/donations",
  DELETE_DONATION: "/donations",
};

export const CommentV1 = {
  GET_COMMENTS: "/comments",
  GET_COMMENT: "/comments",
  CREATE_COMMENT: "/comments",
  UPDATE_COMMENT: "/comments",
  DELETE_COMMENT: "/comments",
  GET_COMMENT_BY_CAMPAIGN: "/comments/campaign",
};

export const UserV1 = {
  GET_USERS: "/users",
  GET_USER: "/users",
  CREATE_USER: "/users",
  UPDATE_USER: "/users",
  DELETE_USER: "/users",
};

export const AiV1 = {
  AI_ANALYZE_CAMPAIGN: "/ai/analyze-campaign",
};

export const NotificationV1 = {
  GET_NOTIFICATIONS: "/notifications",
  GET_NOTIFICATION: "/notifications",
  CREATE_NOTIFICATION: "/notifications",
  UPDATE_NOTIFICATION: "/notifications",
  DELETE_NOTIFICATION: "/notifications",
  READ_NOTIFICATION: "/notifications",
  MARK_ALL_AS_READ: "/notifications/mark-all-read",
  UNREAD_COUNT: "/notifications/unread-count",
};

export const DashboardV1 = {
  GET_DASHBOARD_STATS: "/dashboard/stats",
  GET_DASHBOARD_CAMPAIGNS_STATS: "/dashboard/campaigns-stats",
  GET_DASHBOARD_DONATIONS_STATS: "/dashboard/donations-stats",
  GET_DASHBOARD_RECENT_ACTIVITIES: "/dashboard/recent-activities",
  GET_DASHBOARD_TOP_CAMPAIGNS: "/dashboard/top-campaigns",
  GET_DASHBOARD_USER_GROWTH: "/dashboard/user-growth",
};
// Các API này sẽ cung cấp:

// /dashboard/stats: Thống kê tổng quan

// Tổng số user
// Tổng số campaign
// Tổng số donation
// Tổng số tiền quyên góp
// Số campaign đang hoạt động
// /dashboard/campaigns-stats: Thống kê về campaigns

// Số lượng campaign theo trạng thái
// Phân tích trend theo thời gian
// /dashboard/donations-stats: Thống kê về donations

// Số tiền quyên góp theo thời gian
// Trend donation
// /dashboard/recent-activities: Hoạt động gần đây

// Các donation mới nhất
// Thông tin người donate và campaign
// /dashboard/top-campaigns: Top campaigns

// Campaigns có số tiền quyên góp cao nhất
// Số lượng người tham gia
// /dashboard/user-growth: Thống kê tăng trưởng user

// Số lượng user mới theo thời gian
// Trend tăng trưởng
