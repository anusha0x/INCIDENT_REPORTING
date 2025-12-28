const pool = require("../config/db");

exports.createIncident = async (req, res) => {
  try {
    const {
      type, description, latitude, longitude, severity
    } = req.body;

    if (!type || !description || !latitude || !longitude || !severity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const reportedBy = req.user.id; // from JWT middleware

    const result = await pool.query(
      `INSERT INTO incidents 
       (type, description, latitude, longitude, severity ,created_by)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [type, description,latitude, longitude,severity.toUpperCase(), reportedBy]
    );

    res.status(201).json({
      message: "Incident reported successfully",
      incident: result.rows[0],
    });
  } catch (error) {
   console.error("Create incident error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllIncidents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        type,
        description,
        latitude,
        longitude,
        severity,
        status,
        upvote_count,
        created_at
      FROM incidents
      ORDER BY
        CASE status
          WHEN 'VERIFIED' THEN 1
          ELSE 2
        END,
        CASE severity
          WHEN 'HIGH' THEN 1
          WHEN 'MEDIUM' THEN 2
          ELSE 3
        END,
        created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get incidents error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.upvoteIncident = async (req, res) => {
  const incidentId = req.params.id;
  const userId = req.user.id;

  try {
    // 1. Check if incident exists
    const incidentResult = await pool.query(
      "SELECT * FROM incidents WHERE id = $1",
      [incidentId]
    );

    if (incidentResult.rows.length === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // 2. Insert upvote (unique constraint prevents duplicates)
    await pool.query(
      "INSERT INTO upvotes (user_id, incident_id) VALUES ($1, $2)",
      [userId, incidentId]
    );

    // 3. Increase upvote count
    const updatedIncident = await pool.query(
      "UPDATE incidents SET upvote_count = upvote_count + 1 WHERE id = $1 RETURNING *",
      [incidentId]
    );

    const incident = updatedIncident.rows[0];

    // 4. Auto-verify if upvotes >= 5
    if (incident.upvote_count >= 5 && incident.status === "UNVERIFIED") {
      await pool.query(
        "UPDATE incidents SET status = 'VERIFIED' WHERE id = $1",
        [incidentId]
      );
    }

    res.status(200).json({
      message: "Incident upvoted successfully",
      upvotes: incident.upvote_count + 1
    });

  } catch (error) {
    // Duplicate upvote error
    if (error.code === "23505") {
      return res.status(400).json({ message: "You already upvoted this incident" });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllIncidentsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM incidents ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateIncidentStatus = async (req, res) => {
  const incidentId = req.params.id;
  const { status } = req.body;

  const allowedStatus = [
    "UNVERIFIED",
    "VERIFIED",
    "IN_PROGRESS",
    "RESOLVED"
  ];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await pool.query(
      "UPDATE incidents SET status = $1 WHERE id = $2 RETURNING *",
      [status, incidentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({
      message: "Incident status updated",
      incident: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addAdminNote = async (req, res) => {
  const incidentId = req.params.id;
  const adminId = req.user.id;
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ message: "Note is required" });
  }

  try {
    await pool.query(
      "INSERT INTO admin_notes (incident_id, admin_id, note) VALUES ($1, $2, $3)",
      [incidentId, adminId, note]
    );

    res.status(201).json({ message: "Admin note added" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

