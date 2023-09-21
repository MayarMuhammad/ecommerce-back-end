import express, { Router } from "express";
import { createOrder, webhook } from "./controller/order.js";
import auth from "../../middleware/auth.js";
import { endpoints } from "./order.endPoint.js";


const router = Router();

router.route('/').post(auth(endpoints.order), createOrder);

router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

export default router