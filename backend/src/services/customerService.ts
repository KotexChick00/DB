import { connectDB } from "../../db";
import * as sql from 'mssql';

export async function getTotalSpentByCustomerDb(customerID: number): Promise<number> {
    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input('CustomerID', sql.Int, customerID);

        const result = await request.query(`
            SELECT dbo.fn_TotalSpentByCustomer(@CustomerID) AS TotalSpent;
        `);

        return result.recordset[0].TotalSpent;

    } catch (err) {
        console.error('Error fetching total spent by customer:', err);
        throw err;
    }
}

export async function getAllCustomersDb(): Promise<any[]> {
    try {
        const pool = await connectDB();
        const request = pool.request();
        const result = await request.query(`
            SELECT * FROM Customer;
        `);
        return result.recordset;
    } catch (err) {
        console.error('Error fetching all customers:', err);
        throw err;
    }
}
