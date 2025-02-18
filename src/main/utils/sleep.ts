export const sleep = (time: number): Promise<null> =>
  new Promise((resolve) => setTimeout(resolve, time))
