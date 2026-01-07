import { Router } from 'express';
import { ThreeWayMatchingController } from '../controllers/threeWayMatching.controller';

const router = Router();

router.get('/', ThreeWayMatchingController.getAll);
router.get('/:id', ThreeWayMatchingController.getById);
router.post('/', ThreeWayMatchingController.create);
router.post('/auto-match', ThreeWayMatchingController.createAutomaticMatch);
router.put('/:id', ThreeWayMatchingController.update);
router.delete('/:id', ThreeWayMatchingController.delete);

export { router as threeWayMatchingRoutes };