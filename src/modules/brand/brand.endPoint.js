import { roles } from "../../middleware/auth.js";

export const endpoints = {
    brandCRUD: [roles.admin]
}