const prefixAuth: string = "/core";
const prefixBase: string = "/api/v1";
const prefixOther: string = "/api/core";

const prefixApiAuth: string = `/api/core`;

const endpointPost = {
  GET_ALL_POSTS: `${prefixBase}/post/`,
  GET_POST_DETAIL: `${prefixBase}/post/{id}`,
  CREATE_POST: `${prefixBase}/post/createPost`,
  DELETE_POST: `${prefixBase}/post/{id}`,
  UPDATE_POST: `${prefixBase}/post/{id}`,
};
const endpointDashboard = {
  GET_NUMBER_MEMBER: `${prefixBase}/statistical/getNumber`,
};

const endpointAuth = {
  SIGN_IN: `${prefixBase}/auth/login`,
  SIGN_UP: `${prefixBase}/auth/signUp/`,
  FORGET_PASSWORD: `${prefixBase}/auth/forgotPassword/`,
  RESET_PASSWORD: `${prefixBase}/auth/resetPassword/{token}`,
  RESET_PASSWORD_NO_TOKEN: `${prefixBase}/auth/resetPasswordNoToken/`,
  SIGN_IN_WITH_GOOGLE: `${prefixBase}/auth/loginWithGoogle/`,
  VERIFY_TOKEN: `token/verify/`,
  CHECK_IS_MEMBER: `${prefixBase}/auth/checkIsMember/`,
};

const endpointUsersManagement = {
  GET_ALL_USERS: `${prefixBase}/getAll/users/`,
  GET_USER: `${prefixBase}/users/`,
  UPDATE_USER: `${prefixBase}/users/`,
  UPDATE_AVT: `${prefixBase}/users/avt/`,
};
const endpointFinancessManagement = {
  GET_ALL: `${prefixBase}/finances/`,
  ADD: `${prefixBase}/finances/`,
  ADD_FUND: `${prefixBase}/finances/funds`,
  PAY: `${prefixBase}/payment`,
};

const endpointPointsManagement = {
  GET_ALL_POINT_USERS: `${prefixBase}/point/info`,
};

const endpointEventsManagement = {
  GET_ALL_EVENTS: `${prefixBase}/event/`,
  ADMIN_GET_ALL_EVENTS: `${prefixBase}/event/admin`,
  MANAGER_GET_ALL_EVENTS: `${prefixBase}/event/manager`,
  GET_EVENT_DETAIL: `${prefixBase}/event/{id}`,
  CREATE_EVENT: `${prefixBase}/event/`,
  DELETE_EVENT: `${prefixBase}/event/{id}`,
  UPDATE_EVENT: `${prefixBase}/event/{id}`,
  REGISTER_EVENT: `${prefixBase}/event/{id}/register`,
  EVENT_REGISTRATIONS: `${prefixBase}/event/{id}/registrations`,
  TAKE_ATTENDANCE: `${prefixBase}/event/attendance`,
};

const endpointMeetingsManagement = {
  GET_ALL_EVENTS: `${prefixBase}/meetings`,
  GET_EVENT_DETAIL: `${prefixBase}/meetings/{id}`,
  CREATE_MEETING: `${prefixBase}/meetings/`,
  DELETE_EVENT: `${prefixBase}/meetings/{id}`,
  UPDATE_EVENT: `${prefixBase}/meetings/{id}`,
};

const endpointSemestersManagement = {
  CREATE_SEMESTER: `${prefixBase}/semester/`,
  GET_ALL_SEMESTERS: `${prefixBase}/semester/`,
  DELETE_SEMESTER: `${prefixBase}/semester/{id}`,
  UPDATE_SEMESTER: `${prefixBase}/semester/{id}`,
};

const endpointLoaction = {
  GET_ALL_LOCATIONS: `${prefixBase}/location/`,
  GET_LOCATION_DETAIL: `${prefixBase}/location/{id}`,
  UPDATE_LOCATION: `${prefixBase}/location/{id}`,
  CREATE_LOCATION: `${prefixBase}/location/`,
  DELETE_LOCATION: `${prefixBase}/location/{id}`,
};

const endpointClubsManagement = {
  GET_ALL_CLUBS: `${prefixBase}/clubs`,
  GET_ALL_CLUBS_WITH_PAGINATION: `${prefixBase}/clubs/pagination/`,
  ADD_NEW_CLUB: `${prefixBase}/clubs`,
  UPDATE_CLUB: `${prefixBase}/clubs`,
  GET_BY_SUBNAME: `${prefixBase}/clubs/club-event-detail/`,
  GET_ALL_CLUBS_WITHOUT_PAGINATION: `${prefixBase}/clubs/club-without-pagination/`,
  GET_TOP_5_CLUBS: `${prefixBase}/clubs/top-5-clubs`
};
const endpointClubCategoryManagement = {
  GET_ALL_CLUB_CATEGORY: `${prefixBase}/club-category`,
};

const endpointEnagagementManagement = {
  GET_ALL_ENGAGEMENT_WITH_PAGINATION: `${prefixBase}/engagement/pagination/`,
  GET_ENGAGEMENT_DETAIL: `${prefixBase}/engagement/{id}`,
  UPDATE_ENGAGEMENT: `${prefixBase}/engagement/{id}`,
  GET_MY_APPLICATION: `${prefixBase}/engagement/my-application/`,
  CREATE_ENGAGEMENT: `${prefixBase}/engagement/`,
  GET_MY_CLUB: `${prefixBase}/engagement/my-clubs/{id}`,
};

const endpointDepartmentManagement = {
  GET_ALL_DEPARTMENT_BY_CLUB: `${prefixBase}/department/club-department/`,
};

const endpointRolesManagement = {
  GET_ALL_ROLES: `${prefixBase}/roles/`,
};

const endpointEntracneInterviewManagement = {
  CREATE_INTERVIEW: `${prefixBase}/entrance-interview/create-interview/{id}`,
  INTERVIEW: `${prefixBase}/entrance-interview/interview/{id}`,
};

const endpointScheduleManagement = {};

const endpointOther = {};

const endpointNotificationsManagement = {
  GET_ALL_NOTIFICATIONS_WITH_PAGINATION: `${prefixBase}/notifications`,
  GET_NOTIFICATION_BY_ID: `${prefixBase}/notifications/:id`,
  UPDATE_NOTIFICATION: `${prefixBase}/notifications/:id`,
  CREATE_NOTIFICATION: `${prefixBase}/notifications`,
  DELETE_NOTIFICATION: `${prefixBase}/notifications/:id`,
  GET_ALL_USER_WITH_USERNAME_OR_EMAIL: `${prefixBase}/notifications/recipients`,
  SEND_EMAIL: `${prefixBase}/email/send`,
  GET_ALL_NOTIFICATIONS_BY_USER_ID: `${prefixBase}/notifications/members?userId=:id&status=:status`,
  MARK_NOTIFICATION_AS_READ: `${prefixBase}/notifications/:id`,
  UPDATE_STATUS: `${prefixBase}/notifications/:id`,
};

export {
  endpointAuth,
  endpointUsersManagement,
  endpointScheduleManagement,
  endpointEventsManagement,
  endpointClubsManagement,
  endpointClubCategoryManagement,
  endpointDepartmentManagement,
  endpointEnagagementManagement,
  endpointRolesManagement,
  endpointOther,
  endpointLoaction,
  endpointPointsManagement,
  endpointEntracneInterviewManagement,
  endpointSemestersManagement,
  endpointPost,
  endpointDashboard,
  endpointFinancessManagement,
  endpointNotificationsManagement,
  endpointMeetingsManagement,
};
