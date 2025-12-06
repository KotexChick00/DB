import { Request, Response } from 'express';
import { updateEmployeeDb } from '../services/employeeService';
import { EmployeeUpdateData } from '../interfaces/employee.interface';

export async function updateEmployee(req: Request, res: Response): Promise<void> {
    const employeeData: EmployeeUpdateData = req.body;
    const { UserID, RestaurantID, Salary, HireDate, EmployeeType } = employeeData;

    // 1. Validate input
    if (!UserID || !RestaurantID || !Salary || !HireDate || !EmployeeType) {
        res.status(400).json({ 
            message: 'Thiếu các trường bắt buộc (UserID, RestaurantID, Salary, HireDate, EmployeeType).' 
        });
        return;
    }

    try {
        // 2. Gọi service
        const rowsAffected: number = await updateEmployeeDb(employeeData);

        // 3. Controller xử lý kết quả
        if (rowsAffected > 0) {
            res.status(200).json({
                message: `Cập nhật nhân viên UserID ${UserID} thành công.`,
                rowsAffected
            });
        } else {
            // Trường hợp UPDATE không thay đổi dữ liệu
            res.status(200).json({
                message: `Cập nhật UserID ${UserID} thành công nhưng không có thay đổi nào được ghi nhận.`,
                rowsAffected: 0
            });
        }

    } catch (err: any) {
        console.error('Lỗi trong Controller khi cập nhật nhân viên:', err.message);

        const errorMessage = err.message.includes('UpdateEmployee:')
            ? err.message.substring(err.message.indexOf('UpdateEmployee:'))
            : 'Lỗi cập nhật dữ liệu từ cơ sở dữ liệu.';

        res.status(500).json({
            message: errorMessage
        });
    }
}
