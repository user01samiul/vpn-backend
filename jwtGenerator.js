import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({
  path: "./.env"
})

const payload = {
  sub:"API Access",
  device_id:"3bff3c1717269275",
  ip:"104.133.219.42",
  // iat:1739520443,
  // exp:1771701546
};

// const payload = {
//   device_id= "3bff3c1717269275",
//   id,
//   city,
//   country,
//   ip,
//   is_premium = "disabled",
//   is_banned = "disabled",
//   last_active,
//   premium_buy_time,
//   premium_end_time,
//   is_admin_mailed_premium,
//   payment_method,
//   referer,
//   refer_code,
//   total_refer_claim,
//   register_time,
//   crash_report,
//   is_rooted,
//   email,
//   name,
//   last_connected_server,
//   last_review,
//   last_connection_duration,
//   fcm,
//   created_at,
//   updated_at,
// }

const expiresIn = 60 * 60 *24*7;

const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

console.log(token);
