import { connectDB } from "../../db";
import * as sql from 'mssql';
import { EmployeeUpdateData } from "../interfaces/employee.interface";

export async function updateEmployeeDb(employeeData: EmployeeUpdateData): Promise<number> {
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

        console.log("DEBUG DB RESULT:", JSON.stringify(result, null, 2));

        const rows = result.recordset?.[0]?.RowsAffected ?? 0;
        return rows;


    } catch (err) {
        console.error('Error updating employee:', err);
        throw err;
    }
}