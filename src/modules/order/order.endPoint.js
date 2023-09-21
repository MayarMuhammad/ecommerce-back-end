import { roles } from "../../middleware/auth.js";

export const endpoints = {
    order: [roles.user]
}