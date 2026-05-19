/**
 * Send a consistent JSON response.
 * @param {Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 */
export const sendResponse = (res, statusCode, message, data = null) => {
  const body = { success: statusCode < 400, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};
