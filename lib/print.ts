import { getSchoolProfile } from './school';

export function generateStudentIdCard(student: any) {
  const school = getSchoolProfile();
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student ID Card - ${student.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; display: flex; justify-content: center; }
        .id-card {
          width: 350px;
          height: 220px;
          border: 3px solid #1e40af;
          border-radius: 15px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .header img { width: 40px; height: 40px; object-fit: contain; background: white; border-radius: 8px; padding: 2px; }
        .header h1 { margin: 0; font-size: 16px; }
        .header p { margin: 0; font-size: 10px; opacity: 0.9; }
        .content { padding: 15px; display: flex; gap: 15px; }
        .avatar {
          width: 80px;
          height: 80px;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          color: #6b7280;
        }
        .details { flex: 1; }
        .details h2 { margin: 0 0 8px; font-size: 18px; color: #1f2937; }
        .details p { margin: 4px 0; font-size: 12px; color: #6b7280; }
        .details strong { color: #374151; }
        .footer {
          background: #f9fafb;
          padding: 8px 15px;
          text-align: center;
          font-size: 9px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="id-card">
        <div class="header">
          ${school.logo ? `<img src="${school.logo}" alt="Logo" />` : ''}
          <div>
            <h1>${school.name}</h1>
            <p>${school.motto}</p>
          </div>
        </div>
        <div class="content">
          <div class="avatar">${student.name.split(' ').map((n: string) => n[0]).join('')}</div>
          <div class="details">
            <h2>${student.name}</h2>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Admission No:</strong> ${student.admissionNo}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Parent:</strong> ${student.parent}</p>
          </div>
        </div>
        <div class="footer">
          This card is the property of ${school.name}. If found, please return to ${school.address}.
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

export function printReceipt(studentName: string, amount: string) {
  const school = getSchoolProfile();
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head><title>Fee Receipt</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
      .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 20px; }
      .header img { width: 60px; height: 60px; object-fit: contain; }
      .header h1 { margin: 10px 0 5px; color: #1e40af; }
      .header p { margin: 0; color: #6b7280; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      td { border-bottom: 1px solid #e5e7eb; padding: 12px 8px; }
      td:first-child { color: #6b7280; }
      td:last-child { font-weight: 500; text-align: right; }
      .total { font-size: 18px; font-weight: bold; color: #1e40af; }
      .footer { text-align: center; margin-top: 40px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    </style>
    </head>
    <body>
      <div class="header">
        ${school.logo ? `<img src="${school.logo}" alt="Logo" />` : ''}
        <h1>${school.name}</h1>
        <p>${school.motto}</p>
        <p>${school.phone} | ${school.email}</p>
      </div>
      <table>
        <tr><td>Student</td><td>${studentName}</td></tr>
        <tr><td>Amount</td><td>UGX ${amount}</td></tr>
        <tr><td>Date</td><td>${new Date().toLocaleDateString()}</td></tr>
        <tr class="total"><td>STATUS</td><td>RECEIVED</td></tr>
      </table>
      <div class="footer">
        <p>Thank you for your payment!</p>
        <p>${school.address}</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}