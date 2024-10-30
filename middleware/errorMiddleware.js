export default function errorMiddleware(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || 'Internal server error';
      const errorCode = error.code || 'INTERNAL_ERROR';

      return res.status(statusCode).json({
        error: errorMessage,
        code: errorCode
      });
    }
  };
}