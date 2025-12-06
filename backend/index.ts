// Giả sử startApp trả về promise của connectDB
import { connectDB } from './db';

async function startApp() {
    return connectDB(); // Trả về Promise để có thể dùng await bên ngoài
}


// --- Main Execution ---
async function main() {
    try {
        await startApp(); // CHỜ KẾT NỐI DB XONG
    } catch (error) {
        console.error('Lỗi khởi động hoặc Fetching:', error);
    }
}

main();