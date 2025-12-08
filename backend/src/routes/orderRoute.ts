import express from 'express';
import { getOrderByCustomer } from '../controllers/orderController';
import e from 'express';

const router = express.Router();  

router.get('/orders/customer', getOrderByCustomer);


export default router;