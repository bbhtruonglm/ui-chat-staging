export {}

// import { container, injectable, singleton } from 'tsyringe'
// import { QueryString, type IQueryString } from '../helper/QueryString'

// // ApiConfig.ts: Định nghĩa cấu hình API
// export interface ApiConfig {
//   baseURL: string
//   headers?: Record<string, string>
// }

// // HttpMethod.ts
// type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// // ApiRequest.ts
// interface ApiRequest {
//   url: string
//   method: HttpMethod
//   data?: any
//   params?: Record<string, string | number>
//   headers?: Record<string, string>
// }

// // IApiClient.ts: Interface chuẩn
// export interface IApiClient {
//   request<T>(request: ApiRequest): Promise<T>
//   get<T>(url: string, params?: Record<string, string | number>): Promise<T>
//   post<T>(url: string, data?: any): Promise<T>
//   put<T>(url: string, data?: any): Promise<T>
//   delete<T>(url: string): Promise<T>
// }

// // ApiClient.ts: Class gọi API
// @injectable()
// export class ApiClient implements IApiClient {
//   private baseURL: string
//   private defaultHeaders: Record<string, string>

//   constructor(private config: ApiConfig) {
//     this.baseURL = config.baseURL
//     this.defaultHeaders = config.headers || {
//       'Content-Type': 'application/json',
//     }
//   }

//   private buildUrl(
//     url: string,
//     params?: Record<string, string | number>
//   ): string {
//     if (!params) return `${this.baseURL}${url}`
//     const query = new URLSearchParams()
//     for (const key in params) {
//       query.append(key, params[key].toString())
//     }
//     return `${this.baseURL}${url}?${query.toString()}`
//   }

//   async request<T>(request: ApiRequest): Promise<T> {
//     const { url, method, data, params, headers } = request

//     const fullUrl = this.buildUrl(url, params)
//     const response = await fetch(fullUrl, {
//       method,
//       headers: { ...this.defaultHeaders, ...headers },
//       body:
//         method !== 'GET' && method !== 'DELETE'
//           ? JSON.stringify(data)
//           : undefined,
//     })

//     if (!response.ok) {
//       const errorResponse = await response.text()
//       throw new Error(`Error ${response.status}: ${errorResponse}`)
//     }

//     return (await response.json()) as T
//   }

//   async get<T>(
//     url: string,
//     params?: Record<string, string | number>
//   ): Promise<T> {
//     return this.request<T>({ url, method: 'GET', params })
//   }

//   async post<T>(url: string, data?: any): Promise<T> {
//     return this.request<T>({ url, method: 'POST', data })
//   }

//   async put<T>(url: string, data?: any): Promise<T> {
//     return this.request<T>({ url, method: 'PUT', data })
//   }

//   async delete<T>(url: string): Promise<T> {
//     return this.request<T>({ url, method: 'DELETE' })
//   }
// }

// // ExampleApiService.ts: Service 1
// @injectable()
// export class ExampleApiService {
//   private apiClient: ApiClient

//   constructor() {
//     const exampleApiConfig: ApiConfig = {
//       baseURL: 'https://jsonplaceholder.typicode.com',
//       headers: { Authorization: 'Bearer example-token' },
//     }
//     this.apiClient = new ApiClient(exampleApiConfig)
//   }

//   async fetchUsers(): Promise<any> {
//     return this.apiClient.get('/users')
//   }

//   async createUser(userData: any): Promise<any> {
//     return this.apiClient.post('/users', userData)
//   }
// }

// // AnotherApiService.ts: Service 2 với cấu hình khác
// @injectable()
// export class AnotherApiService {
//   private apiClient: ApiClient

//   constructor() {
//     const anotherApiConfig: ApiConfig = {
//       baseURL: 'https://api.another-service.com',
//       headers: { 'Custom-Header': 'CustomValue' },
//     }
//     this.apiClient = new ApiClient(anotherApiConfig)
//   }

//   async fetchData(): Promise<any> {
//     return this.apiClient.get('/data')
//   }
// }

// // import { container } from 'tsyringe'

// // ;(async () => {
// //   try {
// //     // Service 1
// //     const exampleService = container.resolve(ExampleApiService)
// //     const users = await exampleService.fetchUsers()
// //     console.log('Example Service - Users:', users)

// //     // Service 2
// //     const anotherService = container.resolve(AnotherApiService)
// //     const data = await anotherService.fetchData()
// //     console.log('Another Service - Data:', data)
// //   } catch (error) {
// //     console.error('Error:', error)
// //   }
// // })()

// /**phương thức của API */
// type IRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// /**cấu hình khi gọi API */
// export interface IRequestOptions {
//   /**đường dẫn API */
//   uri: string
//   /**phương thức gọi */
//   method?: IRequestMethod
//   /**query string */
//   qs?: Record<string, any>
//   /**dữ liệu gửi đi dạng json */
//   body?: Record<string, any>
//   /**dữ liệu gửi đi dạng form */
//   form?: FormData
//   /**header đính kèm */
//   headers?: HeadersInit
// }

// /**gọi request API */
// export interface IRequest {
//   /**
//    * thực thi
//    * @param options cấu hình khi gọi API
//    */
//   exec<T = any>(options: IRequestOptions): Promise<T>
// }

// /**gọi request API */
// @singleton()
// export class Request implements IRequest {
//   /**
//    * @param SERVICE_QUERY_STRING xử lý query string
//    */
//   constructor(
//     private readonly SERVICE_QUERY_STRING: IQueryString = container.resolve(
//       QueryString
//     )
//   ) {}

//   /**
//    * khởi tạo cấu hình request
//    * @param options cấu hình khi gọi API
//    */
//   private initRequest({
//     method,
//     body,
//     form,
//     headers,
//   }: IRequestOptions): RequestInit {
//     // đặt phương thức mặc định
//     if (!method) method = 'GET'

//     /**
//      * dữ liệu gửi đi
//      * - ưu tiên json
//      * - nếu json thì chuyển thành chuỗi
//      * - nếu form thì giữ nguyên
//      */
//     const PAYLOAD = body ? JSON.stringify(body) : form

//     /**kiểu dữ liệu gửi đi */
//     const CONTENT_TYPE = body
//       ? 'application/json'
//       : form
//       ? 'multipart/form-data'
//       : undefined

//     // thêm kiểu dữ liệu gửi đi nếu có
//     if (CONTENT_TYPE) headers = { ...headers, 'Content-Type': CONTENT_TYPE }

//     // trả về cấu hình request
//     return { method, headers, body: PAYLOAD }
//   }
//   /**
//    * khởi tạo đường dẫn
//    * @param options cấu hình khi gọi API
//    */
//   private initUri({ uri, qs }: IRequestOptions): string {
//     // thêm query string nếu có
//     if (qs) uri += '?' + this.SERVICE_QUERY_STRING.toString(qs)

//     // trả về đường dẫn
//     return uri
//   }
//   /**
//    * xử lý kết quả trả về
//    * @param raw_res kết quả trả về gốc
//    */
//   private async parserResponse(raw_res: Response) {
//     /**kiểu dữ liệu trả về */
//     const RES_CONTENT_TYPE = raw_res.headers.get('content-type')

//     /**kết quả trả về */
//     const PARSER_RES = RES_CONTENT_TYPE?.includes('application/json')
//       ? await raw_res.json()
//       : await raw_res.text()

//     // nếu api bị lỗi thì bắn ra lỗi
//     if (!raw_res.ok) throw PARSER_RES

//     // trả về kết quả
//     return PARSER_RES
//   }

//   async exec(options: IRequestOptions) {
//     /**đường dẫn cần gọi */
//     const URI = this.initUri(options)

//     /**dữ liệu khởi tạo API */
//     const INIT_REQUEST = this.initRequest(options)

//     /**kết quả khi gửi request */
//     const RAW_RES = await fetch(URI, INIT_REQUEST)

//     // xử lý kết quả trả về
//     return await this.parserResponse(RAW_RES)
//   }
// }

// // try {
// //   const alo = await new Request().exec({
// //     // uri: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
// //     // uri: 'https://jsonplaceholder.typicode.com/todos/1',
// //     uri: 'https://chatbox-widget.botbanhang.vn/v1/quick-answer/quickanswer/label',
// //     // method: 'POST',
// //     // qs: {
// //     //   a: 1,
// //     // },
// //     // headers: {
// //     //   Authorization: 'xxxxx',
// //     // },
// //     // body: {b: 2},
// //     // form: new FormData(),
// //   })
// //   console.log('xxxxx', alo)
// // } catch (e) {
// //   console.log('xxxxx loi', e)
// // }
