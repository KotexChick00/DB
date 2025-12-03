// db.ts
import * as sql from 'mssql';
import 'dotenv/config'; 

// Hàm chuyển đổi string 'true'/'false' từ .env sang boolean
const parseBool = (value: string | undefined, defaultValue: boolean): boolean => {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
};

const dbConfig: sql.config = {
    user: process.env.DB_USER,
    // Phải có mật khẩu để kết nối. Nếu không có, nên báo lỗi hoặc dùng chuỗi rỗng.
    password: process.env.DB_PASSWORD || '', 
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    // Chắc chắn rằng cổng là số và sử dụng 1433 nếu không có giá trị
    port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 1433,
    
    options: {
        // Lấy giá trị từ biến môi trường, mặc định là false nếu không có hoặc không phải 'true'
        trustServerCertificate: parseBool(process.env.DB_OPTIONS_TRUST_SERVER_CERTIFICATE, true), 
        encrypt: parseBool(process.env.DB_OPTIONS_ENCRYPT, false), 
        // Thêm tùy chọn timeout mặc định nếu cần
        // requestTimeout: 30000 
    },
    pool: {
        // Đảm bảo giá trị pool là số, nếu không có, dùng mặc định
        max: process.env.DB_POOL_MAX ? Number.parseInt(process.env.DB_POOL_MAX, 10) : 10,
        min: process.env.DB_POOL_MIN ? Number.parseInt(process.env.DB_POOL_MIN, 10) : 0,
        idleTimeoutMillis: process.env.DB_POOL_IDLE_TIMEOUT ? Number.parseInt(process.env.DB_POOL_IDLE_TIMEOUT, 10) : 30000
    }
};

// Tạo một pool kết nối chung
const pool = new sql.ConnectionPool(dbConfig);

// Hàm khởi tạo kết nối (gọi 1 lần khi server khởi động)
export async function connectDB() {
    try {
        // Kiểm tra xem đã kết nối chưa để tránh kết nối lại
        if (pool.connected) {
             console.log("⚠️ Pool đã được kết nối trước đó.");
             return pool;
        }
        await pool.connect();
        console.log("✅ Kết nối MS SQL Server thành công.");
        return pool;
    } catch (err) {
        console.error("❌ Lỗi kết nối MS SQL Server:", err);
        // Quan trọng: Đóng pool nếu kết nối thất bại
        await pool.close(); 
        throw err;
    }
}

// Hàm lấy pool kết nối để thực hiện truy vấn
export function getPool() {
    // Thêm kiểm tra: đảm bảo pool đã được kết nối trước khi trả về
    if (!pool.connected) {
        throw new Error("Pool kết nối chưa được khởi tạo. Vui lòng gọi connectDB() trước.");
    }
    return pool;
}

// Thêm hàm đóng kết nối (hữu ích khi server tắt)
export async function closeDB() {
    if (pool.connected) {
        await pool.close();
        console.log("▶️ Đã đóng pool kết nối MS SQL Server.");
    }
}