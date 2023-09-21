import { roles } from "../../middleware/auth.js";

export const endpoints = {
    subCategoryCRUD: [roles.admin]
}