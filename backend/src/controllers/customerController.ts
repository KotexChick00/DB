import { Request, Response } from 'express';
import {getTotalSpentByCustomerDb, getAllCustomersDb} from '../services/customerService';

export async function getTotalSpentByCustomer(req: Request, res: Response) {
    try {
        const customerID = Number.parseInt(req.params.customerID, 10);
        const total = await getTotalSpentByCustomerDb(customerID);

        res.json({
            customerID,
            totalSpent: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
}

export async function getAllCustomers(req: Request, res: Response) {
    try {
        const customers = await getAllCustomersDb();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
}
