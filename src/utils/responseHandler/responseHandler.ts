/**
 * @description this function is used to create success response
 * @param : res , message ,code , data
 * @returns resolved message
 */
export const successResponse = (
  res: any,
  message: string,
  code: number,
  data: object
) => {
  const responseObject = {
    message: message,
    code: code,
    data
  };
  return res.status(code).json(responseObject);
};
/**
 * @param {*} res
 * @param {*} message
 * @param {*} code
 * @param {*} data
 * @description this function is used to handle the error response
 */
export const errorResponse = (res: any, message: string, code: number) => {
  return res.status(code).json({
    message: message,
    code: code
  });
};
