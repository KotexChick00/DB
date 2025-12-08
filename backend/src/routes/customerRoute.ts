import express from 'express';
import { getAllCustomers, getTotalSpentByCustomer } from '../controllers/customerController';

const router = express.Router();

router.get('/customer/:customerID/total-spent', getTotalSpentByCustomer);
router.get('/customer/all', getAllCustomers);

export default router;

