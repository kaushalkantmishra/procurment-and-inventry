import { Router } from 'express';
import { UserManagementController } from '../controllers/user-management.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireAdmin } from '../../../middleware/role.middleware';

const router = Router();
const userManagementController = new UserManagementController();

// Admin-only routes
router.use('/admin', authMiddleware, requireAdmin);
router.post('/admin/assign-roles', userManagementController.assignRoles);
router.get('/admin/users/:userId/roles', userManagementController.getUserRoles);
router.get('/admin/roles', userManagementController.getAllRoles);
router.get('/admin/users', userManagementController.getAllUsers);

// User profile routes (authenticated users)
router.use(authMiddleware);
router.put('/profile', userManagementController.updateProfile);
router.post('/change-password', userManagementController.changePassword);

export { router as userManagementRoutes };