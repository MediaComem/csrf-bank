import express from 'express';

import bankingRouter from './banking/banking.routes.js';
import homeRouter from './home/home.routes.js';
import usersRouter from './users/users.routes.js';

const router = express.Router();

router.use('/', homeRouter);
router.use('/banking', bankingRouter);
router.use('/users', usersRouter);

export default router;
