// const pool = require("../config/db");

// exports.getAdminStats = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     const result = await pool.query(`
//       SELECT
//         COUNT(*) AS total,
//         COUNT(*) FILTER (WHERE status='UNVERIFIED') AS unverified,
//         COUNT(*) FILTER (WHERE status='VERIFIED') AS verified,
//         COUNT(*) FILTER (WHERE status='IN_PROGRESS') AS in_progress,
//         COUNT(*) FILTER (WHERE status='RESOLVED') AS resolved,
//         COUNT(*) FILTER (WHERE severity='HIGH') AS high
//       FROM incidents
//     `);

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Dashboard error" });
//   }
// };
