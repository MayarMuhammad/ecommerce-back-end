import { roles } from "../../middleware/auth.js";

export const endpoints = {
    coupon: [roles.admin]
}