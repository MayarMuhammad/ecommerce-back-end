import { roles } from "../../middleware/auth.js";

export const endpoints = {
    categoryCRUD: [roles.admin]
}