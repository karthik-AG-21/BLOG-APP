import nodemailer from 'nodemailer';

let otpStore = {}; // for demo, store OTP in memory

const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
  return otp;
};

const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It expires in 5 minutes.`
  });
};

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  try {
    await sendEmailOTP(email, otp);
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ success: false, message: 'No OTP requested' });
  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (record.otp === otp) {
    delete otpStore[email];
    return res.json({ success: true, message: 'OTP verified' });
  }

  return res.status(400).json({ success: false, message: 'Invalid OTP' });
};
