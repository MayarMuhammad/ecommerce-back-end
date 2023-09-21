import { roles } from "../../middleware/auth.js";

export const endpoints = {
    user: [roles.user]
}