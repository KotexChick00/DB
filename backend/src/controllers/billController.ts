import { Request, Response } from 'express';
import { getCustomerSpendingHigherThanDb, getReCalculateBillsDb } from '../services/billService';

export async function getCustomerSpendingHigherThan(req: Request, res: Response): Promise<void> {

    const amountParam: string = req.params.amount;
    const amount: number = parseFloat(amountParam);

    if (isNaN(amount)) {
        res.status(400).json({ message: 'Tham số không hợp lệ: amount phải là một số.' });
        return;
    }
    try {
        const customers = await getCustomerSpendingHigherThanDb(amount);

        res.status(200).json(customers);
    } catch (err) {
        console.error('Error in getCustomerSpendingHigherThan controller:', err);
        res.status(500).json({ message: 'Lỗi khi lấy khách hàng với mức chi tiêu cao hơn.' });
    }
}

export async function reCalculateBills(req: Request, res: Response): Promise<void> {
    const orderIDParam: string = req.params.orderID;

    const orderID: number = parseInt(orderIDParam, 10);

    if (isNaN(orderID)) {
        res.status(400).json({ message: 'Tham số không hợp lệ: orderID phải là một số nguyên.' });
        return;
    }
    try {
        const bills = await getReCalculateBillsDb(orderID);
        res.status(200).json(bills);
    } catch (err) {
        console.error('Error in reCalculateBills controller:', err);
        res.status(500).json({ message: 'Lỗi khi tính lại hóa đơn cho đơn hàng.' });
    }
};
