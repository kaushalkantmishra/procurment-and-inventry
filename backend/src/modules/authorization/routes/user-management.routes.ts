import { Router } from 'express';
import { UserManagementController } from '../controllers/user-management.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireAdmin } from '../../../middleware/role.middleware';

const router = Router();
const userManagementController = new UserManagementController();

// All routes require admin access
router.use(authMiddleware, requireAdmin);

router.post('/assign-roles', userManagementController.assignRoles);
router.get('/users/:userId/roles', userManagementController.getUserRoles);
router.get('/roles', userManagementController.getAllRoles);
router.get('/users', userManagementController.getAllUsers);

export { router as userManagementRoutes };