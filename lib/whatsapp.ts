export function sendWhatsApp(phone: string, message: string) {
  const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
}

export function sendFeeReminder(student: any, amount: string) {
  const message = `Dear ${student.parent},\n\nThis is a friendly reminder from SmartSchool Pro that the school fees of UGX ${amount} for ${student.name} (${student.class}) are currently ${student.fees?.toLowerCase()}.\n\nPlease make payment at your earliest convenience via:\n- MTN MoMo\n- Airtel Money\n- Bank transfer\n\nThank you for your cooperation.\n\nBest regards,\nSchool Administration`;
  sendWhatsApp(student.phone, message);
}

export function sendAttendanceAlert(student: any, status: string) {
  const message = `Dear ${student.parent},\n\nWe would like to inform you that ${student.name} (${student.class}) was marked as ${status} today.\n\nPlease contact us if you have any concerns.\n\nBest regards,\nSchool Administration`;
  sendWhatsApp(student.phone, message);
}

export function sendGeneralMessage(phone: string, name: string, subject: string, body: string) {
  const message = `Dear ${name},\n\n${subject}\n\n${body}\n\nBest regards,\nSchool Administration`;
  sendWhatsApp(phone, message);
}

export function generateBulkWhatsAppMessage(students: any[], subject: string, body: string) {
  const messages = students.map(student => ({
    phone: student.phone,
    parent: student.parent,
    message: `Dear ${student.parent},\n\n${subject}\n\n${body}\n\nBest regards,\nSchool Administration`
  }));
  return messages;
}