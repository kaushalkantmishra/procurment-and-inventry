import { Router } from 'express';
import { ThreeWayMatchingController } from '../controllers/threeWayMatching.controller';

const router = Router();
const controller = new ThreeWayMatchingController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/auto-match', controller.createAutomaticMatch);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export { router as threeWayMatchingRoutes };