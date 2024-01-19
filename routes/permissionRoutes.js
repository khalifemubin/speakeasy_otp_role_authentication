import express from "express";
import { writePermission, readPermission, executePermission } from "../controllers/permissionControllers.js";
import { authorize } from "../middlewares/authMiddleware.js";

//Router for "claims" based endpoints
// Full url will be http://<your-domain-name-or-localhost:3000>/api/permissions
const permissionsRouter = express.Router();
permissionsRouter.post("/read_protected_endpoint", authorize(['read']), readPermission);
permissionsRouter.post("/write_protected_endpoint", authorize(['write']), writePermission);
permissionsRouter.post("/execute_protected_endpoint", authorize(['execute']), executePermission);

export default permissionsRouter;