/**query tìm kiếm cơ bản */
interface BaseQuery {
  /**phân trang */
  skip?: number
  /**phân trang */
  limit?: number
  /**sắp xếp */
  sort?: string
  /**lọc field */
  select?: string
  /**tìm kiếm */
  search?: string
}