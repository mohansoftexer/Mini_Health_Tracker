// services/whatsappService.js

async function sendWhatsAppMessage(patient, template) {
  console.log(`Sending WhatsApp message to ${patient.userUniqueID}...`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mocked templates
  const messages = {
    report: `Hi ${patient.name}, your nutrition report is ready.`,
    reminder: `Hi ${patient.name}, reminder: You have a scheduled coach call tomorrow.`,
  };

  console.log(`✅ Message sent: "${messages[template]}" to ${patient.userUniqueID}`);
  
  // Simulate delivery status
  console.log(` Delivery status: Delivered to ${patient.userUniqueID}`);

  return true;
}

module.exports = {
  sendWhatsAppMessage,
};
