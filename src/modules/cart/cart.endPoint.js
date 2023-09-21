import { roles } from "../../middleware/auth.js";

export const endpoints = {
    cart: [roles.user]
}