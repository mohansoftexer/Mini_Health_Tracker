// module.exports = async function (job) {
//   const { patientId, phone, report } = job.data;

//   console.log(`📥 Processing WhatsApp report for patient ${patientId}...`);

//   // Simulate failure randomly
//   if (Math.random() < 0.3) {
//     throw new Error('Mock WhatsApp API failure');
//   }

//   await new Promise((res) => setTimeout(res, 2000));
//   console.log(`✅ Report sent to ${phone}: "${report}"`);
// };
