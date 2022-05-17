const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
  blockDuration: 60,
});

const rateLimiterMiddleware = (req, res, next) => {
  let remainingPoints = rateLimiter.points;

  rateLimiter.consume(req.ip, 1)
    .then(() => {
      remainingPoints -= 1;
      next();
    })
    .catch(() => {
      res.set({
        'Retry-After': rateLimiter.msBlockDuration / 1000,
        'X-RateLimit-Limit': rateLimiter.points,
        'X-RateLimit-Remaining': remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + rateLimiter.msBlockDuration),
      });

      res.status(429).json({ error: 'Too Many Requests' });
    });
};

module.exports = rateLimiterMiddleware;
