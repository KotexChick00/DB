import { connectDB } from "../../db";
import * as sql from 'mssql';
import { EmployeeData } from "../interfaces/employee.interface";

export async function updateEmployeeDb(employeeData: EmployeeData): Promise<number> {
    const { UserID, RestaurantID, Salary, HireDate, SupervisorID, EmployeeType } = employeeData;

    try {
        const pool = await connectDB();
        const request = pool.request();

        // Sử dụng kiểu dữ liệu TS đã xác định
        request.input('UserID', sql.Int, UserID);
        request.input('RestaurantID', sql.Int, RestaurantID);
        // Lưu ý: Mssql chấp nhận string hoặc number cho kiểu Decimal
        request.input('Salary', sql.Decimal(12, 2), Salary);
        request.input('HireDate', sql.Date, new Date(HireDate)); // Chuyển đổi sang Date object
        request.input('SupervisorID', sql.Int, SupervisorID);
        request.input('EmployeeType', sql.NVarChar(50), EmployeeType);

        const result = await request.execute('sp_UpdateEmployee');

        const rows = result.recordset?.[0]?.RowsAffected ?? 0;
        return rows;


    } catch (err) {
        console.error('Error updating employee:', err);
        throw err;
    }
}

export async function insertEmployeeDb(employeeData: EmployeeData): Promise<number> {
    const { UserID, RestaurantID, Salary, HireDate, SupervisorID, EmployeeType } = employeeData;
    try {
        const pool = await connectDB();
        const request = pool.request();
        request.input('UserID', sql.Int, UserID);
        request.input('RestaurantID', sql.Int, RestaurantID);
        request.input('Salary', sql.Decimal(12, 2), Salary);
        request.input('HireDate', sql.Date, new Date(HireDate));
        request.input('SupervisorID', sql.Int, SupervisorID ?? null);
        request.input('EmployeeType', sql.NVarChar(50), EmployeeType);

        const result = await request.execute('sp_InsertEmployee');

        const rows = result.recordset?.[0]?.RowsAffected ?? 0;
        return rows;
    } catch (err) {
        console.error('Error inserting employee:', err);
        throw err;
    }
}

export async function deleteEmployeeDb(userID: number): Promise<number> {
    try {
        const pool = await connectDB();
        const request = pool.request();

        request.input('UserID', sql.Int, userID);

        const result = await request.execute('sp_DeleteEmployee');

        const rows = result.rowsAffected[0] ?? 0;

        return rows;
    } catch (err) {
        console.error('Error deleting employee:', err);
        throw err;
    }
}

export async function getAllEmployeeDb(): Promise<any[]> {
    try {
        const pool = await connectDB();
        const request = pool.request();
        const result = await request.query(`
        SELECT * FROM Employee;
    `);

        return result.recordset;
    }

    catch (err) {
        console.error('Error fetching all employees:', err);
        throw err;
    }
}