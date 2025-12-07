import express from 'express';
import { getCustomerSpendingHigherThan } from '../controllers/billController';

const router = express.Router();

router.get('/bills/customers/spending-higher-than/:amount', getCustomerSpendingHigherThan);

export default router;