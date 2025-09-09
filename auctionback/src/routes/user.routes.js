import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import {
  registeruser,
  Loginuser,
  Logoutuser,
  getuserdetails,
  getuserbyid,
  getallusers
} from "../controllers/user.controller.js";
const router = Router();
router.route("/signup").post(registeruser);

router.post("/login", Loginuser);

router.post("/logout", verifyjwt, Logoutuser);

router.get("/getuser", verifyjwt, getuserdetails);

router.get("/me", verifyjwt, getuserdetails);

router.get("/all",getallusers)
router.get("/:id", getuserbyid);

export default router;
