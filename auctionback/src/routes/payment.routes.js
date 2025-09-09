import {createCheckoutSession} from "../controllers/payment.controller.js";
import { Router } from "express";

const router = Router();
router.post("/create-checkout-session", createCheckoutSession);
export default router;