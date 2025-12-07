import { Request, Response } from 'express';
import { updateEmployeeDb, insertEmployeeDb, deleteEmployeeDb, getAllEmployeeDb } from '../services/employeeService';
import { EmployeeData } from '../interfaces/employee.interface';

export async function updateEmployee(req: Request, res: Response): Promise<void> {
    const employeeData: EmployeeData = req.body;
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

export async function insertEmployee(req: Request, res: Response): Promise<void> {
    const employeeData: EmployeeData = req.body;
    const { UserID, RestaurantID, Salary, HireDate, EmployeeType } = employeeData;

    // 1. Validate input
    if (!UserID) {
        res.status(400).json({
            message: 'Thiếu trường bắt buộc: UserID.'
        });
        return;
    }

    if (!RestaurantID) {
        res.status(400).json({
            message: 'Thiếu trường bắt buộc: RestaurantID.'
        });
        return;
    }

    if (!Salary) {
        res.status(400).json({
            message: 'Thiếu trường bắt buộc: Salary.'
        });
        return;
    }

    if (!HireDate) {
        res.status(400).json({
            message: 'Thiếu trường bắt buộc: HireDate.'
        });
        return;
    }

    if (!EmployeeType) {
        res.status(400).json({
            message: 'Thiếu trường bắt buộc: EmployeeType.'
        });
        return;
    }

    try {
        // 2. Gọi service
        const rowsAffected: number = await insertEmployeeDb(employeeData);

        // 3. Controller xử lý kết quả

        if (rowsAffected > 0) {
            res.status(201).json({
                message: `Chèn nhân viên UserID ${UserID} thành công.`,
                rowsAffected
            });
        } else {
            res.status(200).json({
                message: `Chèn nhân viên UserID ${UserID} không thành công.`,
                rowsAffected: 0
            });
        }
    } catch (err: any) {
        console.error('Lỗi trong Controller khi chèn nhân viên:', err.message);
        res.status(500).json({
            message: 'Lỗi chèn dữ liệu vào cơ sở dữ liệu.'
        });
    }
}

export async function deleteEmployee(req: Request, res: Response): Promise<void> {
    const userID = Number(req.params.userID);

    try {
        const rowsAffected = await deleteEmployeeDb(userID);

        if (rowsAffected > 0) {
            res.status(200).json({
                message: `Xóa nhân viên UserID ${userID} thành công.`,
                rowsAffected
            });
        } else {
            res.status(404).json({
                message: `Không tìm thấy nhân viên với UserID ${userID} để xóa.`,
                rowsAffected: 0
            });
        }

    } catch (err: any) {
        const msg = err.message || "Lỗi hệ thống";

        console.error("Lỗi trong Controller khi xóa nhân viên:", msg);

        if (msg.includes("không tồn tại")) {
            res.status(404).json({ message: msg });
            return;
        }

        if (msg.includes("giám sát nhân viên khác")) {
            res.status(409).json({ message: msg });
            return;
        }

        res.status(400).json({ message: msg });
    }
}

export async function getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
        const employees = await getAllEmployeeDb();
        res.status(200).json(employees);
    } catch (err: any) {
        console.error("Lỗi trong Controller khi lấy danh sách nhân viên:", err.message);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}