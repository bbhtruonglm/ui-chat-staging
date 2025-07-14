/**
 * hàm callback cơ bản, trả về lỗi và kết quả
 */
export interface Cb<type = any> {
    (error?: any, result?: type): void
}
/**
 * hàm callback chỉ trả về lỗi nếu có
 */
export interface CbError {
    (error?: any): void
}