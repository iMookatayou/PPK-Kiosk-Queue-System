const express = require('express');
const cors = require('cors');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

const app = express();
const port = 4000;  // เลือกพอร์ตที่คุณต้องการ

// เปิดใช้งาน CORS (เพื่อให้ React app เข้าถึง API ได้)
app.use(cors());
app.use(express.json());  // รองรับ JSON requests

// API สำหรับการพิมพ์คิว
app.post('/api/print-queue', async (req, res) => {
  const { queueNumber } = req.body;

  // ตรวจสอบว่ามีหมายเลขคิวหรือไม่
  if (!queueNumber) {
    return res.status(400).json({ error: 'Missing queue number' });
  }

  // สร้าง Thermal Printer
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,  // เลือกประเภทเครื่องพิมพ์ (ถ้าใช้ EPSON)
    interface: 'usb',          // หรือ 'printer:POS80' สำหรับ Windows
    options: { timeout: 5000 },
    width: 48,                 // ความกว้างของกระดาษพิมพ์
    characterSet: 'SLOVENIA',
    removeSpecialCharacters: false,
    lineCharacter: '='
  });

  // ดึงวันที่และเวลา
  const now = new Date();
  const date = now.toLocaleDateString('th-TH');
  const time = now.toLocaleTimeString('th-TH');

  // การพิมพ์ข้อมูล
  printer.alignCenter();
  printer.setTextSize(1, 1);
  printer.println('โรงพยาบาลพระปกเกล้าฯ');
  printer.drawLine();
  printer.setTextSize(2, 2);
  printer.println('คิวที่');
  printer.setTextSize(4, 4);
  printer.println(`${queueNumber}`);
  printer.setTextSize(1, 1);
  printer.drawLine();
  printer.println(`วันที่: ${date}`);
  printer.println(`เวลา: ${time}`);
  printer.println(`กรุณารอเรียกคิวจากเจ้าหน้าที่`);
  printer.newLine();
  printer.cut();

  try {
    const connected = await printer.isPrinterConnected();
    if (!connected) {
      return res.status(500).json({ error: 'Printer not connected' });
    }

    const success = await printer.execute();
    if (success) {
      return res.status(200).json({ status: 'printed' });
    } else {
      return res.status(500).json({ error: 'Failed to print' });
    }
  } catch (err) {
    console.error('❌ Print error:', err);
    return res.status(500).json({ error: 'Printer error', detail: err.message });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`🖨️ Print API ready at: http://localhost:${port}`);
});
