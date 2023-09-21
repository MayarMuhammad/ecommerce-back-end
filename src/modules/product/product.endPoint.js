import { roles } from "../../middleware/auth.js";

export const endpoints = {
    productCRUD: [roles.admin]
}