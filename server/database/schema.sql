
-- ==========================================
-- PRODUCTION DATABASE SCHEMA
-- Purpose: Real-time Emergency Reporting
-- ==========================================

-- 1. EXTENSIONS
-- Required for location radius filtering (Requirement #2)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. TABLES
-- Persistent storage for history (Technical Expectation)
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, 
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unverified', -- Distinction for Requirement #3
    severity VARCHAR(20) DEFAULT 'Medium', -- Requirement #2
    upvotes INTEGER DEFAULT 0,
    location GEOGRAPHY(Point, 4326), -- Requirement: Location Radius Filtering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Production-ready timezone support
    CONSTRAINT check_status CHECK (status IN ('unverified', 'verified', 'responding', 'resolved'))
);

-- Indices for handling concurrent users and high-speed queries (Requirement #5)
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);

CREATE TABLE IF NOT EXISTS incident_votes (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE, -- Reliable data cleanup
    voter_device_id VARCHAR(255),
    voter_location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(incident_id, voter_device_id) -- Requirement #3: Prevent duplicates
);

CREATE TABLE IF NOT EXISTS responders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50), 
    availability_status BOOLEAN DEFAULT TRUE,
    last_location GEOGRAPHY(Point, 4326)
);

-- 3. FUNCTIONS & TRIGGERS (Logic Layer)

-- Logic for Verification & De-duplication (Requirement #3)
CREATE OR REPLACE FUNCTION cast_proximity_vote(
    target_id INTEGER,
    device_id VARCHAR,
    v_lng DOUBLE PRECISION,
    v_lat DOUBLE PRECISION
) RETURNS TEXT AS $$
DECLARE
    incident_loc GEOGRAPHY;
BEGIN
    SELECT location INTO incident_loc FROM incidents WHERE id = target_id;
    
    -- Geofencing: Only allow upvotes within 500m for real-world reliability
    IF ST_DWithin(incident_loc, ST_MakePoint(v_lng, v_lat)::geography, 500) THEN
        INSERT INTO incident_votes (incident_id, voter_device_id, voter_location)
        VALUES (target_id, device_id, ST_MakePoint(v_lng, v_lat));
        
        UPDATE incidents SET upvotes = upvotes + 1 WHERE id = target_id;
        RETURN 'Success';
    ELSE
        RETURN 'Too far to verify';
    END IF;
EXCEPTION WHEN unique_violation THEN
    RETURN 'Already voted';
END;
$$ LANGUAGE plpgsql;

-- Auto-Verification Trigger
CREATE OR REPLACE FUNCTION check_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Threshold for demo verification
    IF NEW.upvotes >= 5 THEN
        NEW.status := 'verified';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER auto_verify_trigger
BEFORE UPDATE ON incidents
FOR EACH ROW EXECUTE FUNCTION check_verification();

-- 4. VIEWS (Requirement #4: Responder/Admin View)
CREATE OR REPLACE VIEW priority_dashboard AS
SELECT *,
    CASE 
        WHEN status = 'verified' AND severity = 'High' THEN 1
        WHEN status = 'verified' AND severity = 'Medium' THEN 2
        WHEN status = 'unverified' AND severity = 'High' THEN 3
        ELSE 4
    END as priority_rank
FROM incidents
WHERE status != 'resolved'
ORDER BY priority_rank ASC, created_at DESC;