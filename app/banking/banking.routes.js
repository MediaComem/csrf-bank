import express from 'express';

import { authenticate } from '../middlewares.js';
import { transfer } from './banking.middlewares.js';

const router = express.Router();

router.post('/transfer', authenticate(), transfer);

export default router;
