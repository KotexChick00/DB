import express from 'express';
import { deleteEmployee, insertEmployee, updateEmployee, } from '../controllers/employeeController';

const router = express.Router();

// Định nghĩa route PUT /api/employee để cập nhật thông tin nhân viên

router.put('/employee/update', updateEmployee);

router.post('/employee/insert', insertEmployee);

router.delete('/employee/delete/:userID/', deleteEmployee);

export default router;