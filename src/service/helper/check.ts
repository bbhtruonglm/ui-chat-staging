/**kiểm tra chuỗi có phải là domain dạng abc.com, sub.abc.com hay không */
export function isDomain(input: string) {
  return /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/.test(input)
}
