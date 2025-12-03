// Giả sử startApp trả về promise của connectDB
import { connectDB, getPool } from './db';

async function startApp() {
    return connectDB(); // Trả về Promise để có thể dùng await bên ngoài
}

async function fetchData() {
    try {
        const pool = getPool();
        const result = await pool.request().query(`
            SELECT TOP 10 * FROM [User]
`);
        console.log('✅ Kết quả truy vấn:', result.recordset);
    } catch (err) {
        console.error('❌ Lỗi query:', err);
    }
}

// --- Main Execution ---
async function main() {
    try {
        await startApp(); // CHỜ KẾT NỐI DB XONG
        await fetchData(); // MỚI GỌI HÀM QUERY
    } catch (error) {
        console.error('Lỗi khởi động hoặc Fetching:', error);
    }
}

main();