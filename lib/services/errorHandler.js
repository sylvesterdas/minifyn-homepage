export class APIError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function handleError(error, res) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  return res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
}