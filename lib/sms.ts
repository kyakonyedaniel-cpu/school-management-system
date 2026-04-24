interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface SMSConfig {
  provider: 'mtn' | 'airtel';
  apiKey: string;
  apiSecret: string;
  senderId: string;
}

class SMSService {
  private config: SMSConfig | null = null;

  configure(config: SMSConfig) {
    this.config = config;
  }

  async sendSMS(phone: string, message: string): Promise<SMSResult> {
    if (!this.config) {
      console.log(`[SMS DEMO] To: ${phone}, Message: ${message}`);
      return { success: true, messageId: `demo-${Date.now()}` };
    }

    try {
      if (this.config.provider === 'mtn') {
        return await this.sendMTNSMS(phone, message);
      } else {
        return await this.sendAirtelSMS(phone, message);
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async sendMTNSMS(phone: string, message: string): Promise<SMSResult> {
    try {
      const token = await this.getMTNToken();
      if (!token) return { success: false, error: 'Failed to get MTN token' };
      
      const response = await fetch('https://sandbox.momodeveloper.mtn.comcollection/1/sms/requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY || '',
        },
        body: JSON.stringify({
          sender: this.config!.senderId,
          message: message,
          recipients: [this.formatPhone(phone)]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, messageId: data.referenceId };
      }

      return { success: false, error: 'Failed to send MTN SMS' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async getMTNToken(): Promise<string | null> {
    try {
      const response = await fetch('https://sandbox.momodeveloper.mtn.comcollection/token/hold', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from((this.config?.apiKey || '') + ':' + (this.config?.apiSecret || '')).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY || '',
        }
      });

      const data = await response.json();
      return data.access_token || null;
    } catch {
      return null;
    }
  }

  private async sendAirtelSMS(phone: string, message: string): Promise<SMSResult> {
    try {
      const response = await fetch('https://api.sandbox.airtel.com/standard/v1/sms/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config?.apiKey || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: this.config?.senderId || '',
          message: message,
          route: 'International',
          recipients: [{ phone: this.formatPhone(phone) }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, messageId: data.id };
      }

      return { success: false, error: 'Failed to send Airtel SMS' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private formatPhone(phone: string): string {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '256' + formatted.substring(1);
    }
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }
    return formatted;
  }

  async sendBulkSMS(recipients: string[], message: string): Promise<{ success: number; failed: number }> {
    let successCount = 0;
    let failedCount = 0;

    for (const phone of recipients) {
      const result = await this.sendSMS(phone, message);
      if (result.success) successCount++;
      else failedCount++;
    }

    return { success: successCount, failed: failedCount };
  }
}

export const smsService = new SMSService();

export const smsTemplates = {
  feeReminder: (studentName: string, amount: string, dueDate: string) =>
    `Dear Parent, fees for ${studentName} (UGX ${amount}) due ${dueDate}. Please pay promptly. SmartSchool`,

  attendanceAlert: (studentName: string, status: string, date: string) =>
    `${studentName} was ${status} on ${date}. SmartSchool`,

  examNotification: (examName: string, date: string, className: string) =>
    `${examName} for ${className} on ${date}. Prepare accordingly. SmartSchool`,

  meetingNotice: (date: string, venue: string) =>
    `PTA Meeting ${date} at ${venue}. Your presence is appreciated. SmartSchool`,

  resultPublished: (examName: string, className: string) =>
    `${examName} results for ${className} published. Check parent portal. SmartSchool`,

  paymentConfirmation: (studentName: string, amount: string, balance: string) =>
    `Payment UGX ${amount} received for ${studentName}. Balance: UGX ${balance}. SmartSchool`
};