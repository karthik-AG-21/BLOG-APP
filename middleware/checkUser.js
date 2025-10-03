// middleware/checkUser.js
export const checkUser = function (req, res, next) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Attach email to request for controller
  req.user = { email };
  next();
};
