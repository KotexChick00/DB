import {Request, Response} from 'express';
import { getOrderByCustomerDb } from '../services/orderService';

export async function getOrderByCustomer(req: Request, res: Response): Promise<void> {

    const customerName: string = req.params.customerName;

    try {
        const orders = await getOrderByCustomerDb(customerName);
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error in getOrderByCustomer controller:', err);
        res.status(500).json({ message: 'Lỗi khi lấy đơn hàng theo tên khách hàng.' });
    }
}
