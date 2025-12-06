import express from 'express';
import { updateEmployee } from '../controllers/employeeController';

const router = express.Router();

// Định nghĩa route PUT /api/employee để cập nhật thông tin nhân viên

router.put('/employee', updateEmployee);

export default router;