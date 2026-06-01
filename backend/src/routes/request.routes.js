import { Router } from "express";
import { makeRequest , getAllRequests , getRequestById } from "../controller/request.controller.js";

const router = Router();

router.route("/request").post(makeRequest);
router.route("/requests").get(getAllRequests);
router.route("/request/:id").get(getRequestById);

export default router;