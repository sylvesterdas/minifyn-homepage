const SUPPORTED_VERSIONS = ['v1'];

export default function apiVersionMiddleware(handler) {
  return async (req, res) => {
    const version = req.url.split('/')[2];
    
    if (!SUPPORTED_VERSIONS.includes(version)) {
      return res.status(400).json({ 
        error: 'Invalid API version',
        supported: SUPPORTED_VERSIONS
      });
    }

    return handler(req, res);
  };
}