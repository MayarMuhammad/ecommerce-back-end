import { roles } from "../../middleware/auth.js";

export const endpoints = {
    reviewCRUD: [roles.user]
}