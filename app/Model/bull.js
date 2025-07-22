// queues/whatsappQueue.js

const Queue = require('bull');

// Create the WhatsApp queue
const bullRadies = new Queue('whatsappQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// // ✅ Add event listeners for debugging
// bullRadies.on('error', (err) => {
//   console.error('❌ Bull Queue Error:', err);
// });

// bullRadies.on('waiting', (jobId) => {
//   console.log('⏳ Job waiting in queue:', jobId);
// });

// bullRadies.on('failed', (job, err) => {
//   console.error(`❗ Job ${job.id} failed:`, err.message);
// });

// bullRadies.on('completed', (job) => {
//   console.log(`✅ Job ${job.id} completed successfully`);
// });

module.exports = bullRadies;
