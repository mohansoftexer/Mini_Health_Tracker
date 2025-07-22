// worker/whatsappWorker.js
const whatsappQueue = require('../../app/Model/bull');
const { sendWhatsAppMessage } = require('./WhatsappServices');

// Process WhatsApp jobs
whatsappQueue.process('sendReport', async (job) => {
  const patient = job.data;

  console.log(` Processing job ID ${job.id} for patient: ${patient.firstname}`);

  // Simulate sending report message
  await sendWhatsAppMessage(patient, 'report');
});

// Optional: Listen to job events
whatsappQueue.on('completed', (job) => {
  console.log(` Job ${job.id} completed for user ${job.data.userID}`);
});

whatsappQueue.on('failed', (job, err) => {
  console.error(` Job ${job.id} failed: ${err.message}`);
});
