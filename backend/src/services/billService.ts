import { connectDB } from "../../db";
import * as sql from 'mssql';

export async function getCustomerSpendingHigherThanDb(amount: number): Promise<any[]> {
    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input('MinAmount', sql.Decimal(12, 2), amount);

        const result = await request.execute('sp_GetCustomerSpendingHigherThanAmount');

        result.recordset = result.recordset || [];
        return result.recordset;
    } catch (err) {
        console.error('Error fetching customers by spending:', err);
        throw err;
    }
}

export async function getReCalculateBillsDb(orderID: number): Promise<any[]> {

    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input('OrderID', sql.Int, orderID);
        const result = await request.execute('sp_RecalculateBillForOrder');

        result.recordset = result.recordset || [];

        return result.recordset;
    } catch (err) {
        console.error('Error recalculating bills for order:', err);
        throw err;
    }
}