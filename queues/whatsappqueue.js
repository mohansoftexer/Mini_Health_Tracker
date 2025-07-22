// const Queue = require('bull');

// // Create the Bull queue
// const whatsappQueue = new Queue('whatsappQueue', {
//   redis: { host: '127.0.0.1', port: 6379 },
// });

// // Logging
// whatsappQueue.on('completed', (job) =>
//   console.log(`Job ${job.id} completed`)
// );
// whatsappQueue.on('failed', (job, err) =>
//   console.error(`Job ${job.id} failed:`, err.message)
// );
// whatsappQueue.on('error', (err) => {
//   console.error('Redis Queue connection error:', err.message);
// });
// module.exports = whatsappQueue;
