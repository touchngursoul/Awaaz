import { Router, type IRouter } from "express";
import healthRouter from "./health";
import reportsRouter from "./reports";
import adminRouter from "./admin";
import awarenessRouter from "./awareness";

const router: IRouter = Router();

router.use(healthRouter);
router.use(reportsRouter);
router.use(adminRouter);
router.use(awarenessRouter);

export default router;
