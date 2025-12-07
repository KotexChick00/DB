import express from 'express';
import { getTotalSpentByCustomer } from '../controllers/customerController';

const router = express.Router();

router.get('/customer/:customerID/total-spent', getTotalSpentByCustomer);

export default router;

