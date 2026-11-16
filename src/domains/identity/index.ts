/**
 * Identity / session domain — BHD SSO and product session only.
 */
export {
  SESSION_COOKIE,
  authSecret,
  readSessionToken,
  signSession,
  type ProductSession,
} from "@/lib/auth/session";
export {
  portalLoginHref,
  resolvePortalViewer,
  resolveWorkspaceAccess,
} from "@/lib/portal/access";
