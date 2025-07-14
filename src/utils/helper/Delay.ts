import { singleton } from 'tsyringe'

/**hàm trì hoãn thực thi */
export interface IDelay {
  /**
   * thực thi
   * @param time thời gian trì hoãn (ms)
   */
  exec(time: number): Promise<unknown>
}

/**hàm trì hoãn thực thi */
@singleton()
export class Delay implements IDelay {
  exec(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
  }
}
