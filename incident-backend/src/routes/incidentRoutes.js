const express = require("express");
const router = express.Router();

const incidentController = require("../controllers/incidentController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Citizen reports an incident
router.post("/", authMiddleware, incidentController.createIncident);
router.get("/", incidentController.getAllIncidents);
// Citizen upvotes an incident
router.post("/:id/upvote", authMiddleware, incidentController.upvoteIncident);

// Admin: get all incidents
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  incidentController.getAllIncidentsAdmin
);

// Admin: update incident status
router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  incidentController.updateIncidentStatus
);

// Admin: add admin note
router.post(
  "/admin/:id/note",
  authMiddleware,
  adminMiddleware,
  incidentController.addAdminNote
);


module.exports = router;
