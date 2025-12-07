import { connectDB } from "../../db";
import * as sql from 'mssql';

export async function getOrderByCustomerDb(customerName: string): Promise<any[]> {
    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input('CustomerName', sql.NVarChar(100), customerName);

        const result = await request.execute('sp_GetOrdersByCustomer');

        result.recordset = result.recordset || [];
        return result.recordset;
    } catch (err) {
        console.error('Error fetching orders by customer:', err);
        throw err;
    }
}