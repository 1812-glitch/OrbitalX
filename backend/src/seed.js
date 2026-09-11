/**
 * OrbitalX Database Seed Script
 * Run: node src/seed.js
 *
 * Creates initial data: admin user, 5 satellites, 1 mission, 4 ground stations
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const { hashPassword } = require("./utils/password");

// Models
const User = require("./models/User");
const Satellite = require("./models/Satellite");
const Mission = require("./models/Mission");
const GroundStation = require("./models/GroundStation");
const Alert = require("./models/Alert");
const Notification = require("./models/Notification");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Satellite.deleteMany({}),
      Mission.deleteMany({}),
      GroundStation.deleteMany({}),
      Alert.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Cleared existing data.");

    // ========== USERS ==========
    const adminHash = await hashPassword("admin123");
    const operatorHash = await hashPassword("operator123");
    const viewerHash = await hashPassword("viewer123");

    const users = await User.insertMany([
      {
        name: "Elena Rostova",
        email: "admin@orbitalx.sys",
        passwordHash: adminHash,
        role: "admin",
        callsign: "Controller Alpha-7",
        clearanceLevel: 5,
        station: "Ground Control 01",
      },
      {
        name: "Marcus Vance",
        email: "operator@orbitalx.sys",
        passwordHash: operatorHash,
        role: "operator",
        callsign: "Operator-09",
        clearanceLevel: 3,
        station: "Ground Control 01",
      },
      {
        name: "Sarah Jenkins",
        email: "viewer@orbitalx.sys",
        passwordHash: viewerHash,
        role: "viewer",
        callsign: "Observer-12",
        clearanceLevel: 1,
        station: "Ground Control 01",
      },
    ]);
    console.log(`Created ${users.length} users.`);

    // ========== GROUND STATIONS ==========
    const groundStations = await GroundStation.insertMany([
      {
        name: "Ground Station Alpha",
        stationId: "GS-001",
        country: "India",
        location: "Bangalore, IND",
        latitude: 12.9716,
        longitude: 77.5946,
        status: "active",
        signalQuality: 98,
        connectedSatellites: ["SAT-001", "SAT-003"],
      },
      {
        name: "Ground Station Bravo",
        stationId: "GS-002",
        country: "USA",
        location: "Houston, USA",
        latitude: 29.7604,
        longitude: -95.3698,
        status: "degraded",
        signalQuality: 64,
        connectedSatellites: ["SAT-002"],
      },
      {
        name: "Ground Station Charlie",
        stationId: "GS-003",
        country: "France",
        location: "Toulouse, EUR",
        latitude: 43.6047,
        longitude: 1.4442,
        status: "active",
        signalQuality: 92,
        connectedSatellites: ["SAT-001", "SAT-004", "SAT-005"],
      },
      {
        name: "Ground Station Delta",
        stationId: "GS-004",
        country: "Australia",
        location: "Canberra, AUS",
        latitude: -35.2809,
        longitude: 149.1300,
        status: "active",
        signalQuality: 88,
        connectedSatellites: [],
      },
    ]);
    console.log(`Created ${groundStations.length} ground stations.`);

    // ========== SATELLITES ==========
    const satellites = await Satellite.insertMany([
      {
        name: "ORION",
        satelliteId: "SAT-001",
        noradId: "25544",
        status: "active",
        orbitType: "LEO",
        orbitRadius: 6771,
        orbitSpeed: 0.0012,
        inclination: 51.6,
        currentAngle: 0,
        satelliteClass: "6U CubeSat",
        launchDate: new Date("2023-06-15"),
        connectedGroundStation: groundStations[0]._id,
        currentTelemetry: {
          temperature: 42,
          speed: 7.52,
          altitude: 550,
          distanceFromEarth: 550,
          battery: 87,
          signal: -42,
          connectivity: "connected",
          latitude: 28.5,
          longitude: -80.6,
          health: 96,
        },
      },
      {
        name: "NOVA",
        satelliteId: "SAT-002",
        noradId: "48275",
        status: "active",
        orbitType: "MEO",
        orbitRadius: 26578,
        orbitSpeed: 0.0004,
        inclination: 55.0,
        currentAngle: 1.2,
        satelliteClass: "3U CubeSat",
        launchDate: new Date("2023-08-20"),
        connectedGroundStation: groundStations[1]._id,
        currentTelemetry: {
          temperature: 38,
          speed: 3.87,
          altitude: 20200,
          distanceFromEarth: 20200,
          battery: 100,
          signal: -55,
          connectivity: "connected",
          latitude: 15.2,
          longitude: 45.3,
          health: 100,
        },
      },
      {
        name: "AURORA",
        satelliteId: "SAT-003",
        noradId: "51993",
        status: "active",
        orbitType: "LEO",
        orbitRadius: 6778,
        orbitSpeed: 0.0011,
        inclination: 97.4,
        currentAngle: 2.5,
        satelliteClass: "6U CubeSat",
        launchDate: new Date("2023-03-10"),
        connectedGroundStation: groundStations[0]._id,
        currentTelemetry: {
          temperature: 145,
          speed: 7.61,
          altitude: 400,
          distanceFromEarth: 400,
          battery: 42,
          signal: -68,
          connectivity: "connected",
          latitude: -12.3,
          longitude: 120.7,
          health: 64,
        },
      },
      {
        name: "HORIZON",
        satelliteId: "SAT-004",
        noradId: "55102",
        status: "active",
        orbitType: "GEO",
        orbitRadius: 42164,
        orbitSpeed: 0.00007,
        inclination: 0.1,
        currentAngle: 4.0,
        satelliteClass: "Micro",
        launchDate: new Date("2022-12-01"),
        connectedGroundStation: groundStations[2]._id,
        currentTelemetry: {
          temperature: 25,
          speed: 3.07,
          altitude: 35786,
          distanceFromEarth: 35786,
          battery: 92,
          signal: -38,
          connectivity: "connected",
          latitude: 0.0,
          longitude: -75.2,
          health: 99,
        },
      },
      {
        name: "VEGA",
        satelliteId: "SAT-005",
        noradId: "56789",
        status: "maintenance",
        orbitType: "LEO",
        orbitRadius: 6871,
        orbitSpeed: 0.001,
        inclination: 45.0,
        currentAngle: 5.5,
        satelliteClass: "1U CubeSat",
        launchDate: new Date("2023-09-05"),
        connectedGroundStation: groundStations[2]._id,
        currentTelemetry: {
          temperature: 55,
          speed: 7.45,
          altitude: 500,
          distanceFromEarth: 500,
          battery: 68,
          signal: -72,
          connectivity: "intermittent",
          latitude: 35.6,
          longitude: 139.7,
          health: 74,
        },
      },
    ]);
    console.log(`Created ${satellites.length} satellites.`);

    // ========== MISSION ==========
    const missions = await Mission.insertMany([
      {
        name: "Sat-Deploy Vanguard",
        missionId: "ORB-992",
        description: "Deploy constellation of LEO monitoring satellites for environmental data collection.",
        status: "active",
        launchDate: new Date("2023-06-15"),
        launchSite: "Vandenberg SFB, CA",
        objective: "Deploy and commission 3 LEO observation satellites",
        assignedSatellites: [satellites[0]._id, satellites[2]._id, satellites[4]._id],
        createdBy: users[0]._id,
      },
      {
        name: "Lunar Relay Maintenance",
        missionId: "LUN-441",
        description: "Routine maintenance and firmware update for MEO relay satellites.",
        status: "completed",
        launchDate: new Date("2023-08-20"),
        launchSite: "Cape Canaveral, FL",
        objective: "Update navigation firmware and calibrate sensors",
        assignedSatellites: [satellites[1]._id],
        createdBy: users[0]._id,
      },
    ]);
    console.log(`Created ${missions.length} missions.`);

    // ========== ALERTS ==========
    const alerts = await Alert.insertMany([
      {
        satelliteId: "SAT-003",
        severity: "critical",
        type: "THERMAL_ANOMALY",
        title: "Thermal Anomaly Detected",
        message: "A sudden temperature spike was detected in Propulsion Thruster B assembly. Value exceeded operational threshold (310K).",
        metric: "temperature",
        value: 145,
        threshold: 100,
        subsystem: "Propulsion",
        acknowledged: false,
      },
      {
        satelliteId: "SAT-005",
        severity: "warning",
        type: "SIGNAL_DEGRADATION",
        title: "Signal Strength Degraded",
        message: "Uplink signal strength dropped below acceptable threshold. Auto-correction engaged.",
        metric: "signal",
        value: -72,
        threshold: -65,
        subsystem: "Communications",
        acknowledged: true,
        acknowledgedBy: users[1]._id,
        acknowledgedAt: new Date(),
      },
      {
        satelliteId: "SAT-005",
        severity: "warning",
        type: "LOW_BATTERY",
        title: "Low Power Reserve",
        message: "Battery levels dropped below 70%. Solar array charging rate nominal.",
        metric: "battery",
        value: 68,
        threshold: 70,
        subsystem: "Power",
        acknowledged: false,
      },
    ]);
    console.log(`Created ${alerts.length} alerts.`);

    // ========== NOTIFICATIONS ==========
    const notifications = await Notification.insertMany([
      {
        userId: users[0]._id,
        type: "alert",
        title: "THERMAL ANOMALY DETECTED",
        message: "Core temperature exceeding 90C",
        severity: "critical",
        satelliteId: "SAT-003",
      },
      {
        userId: users[0]._id,
        type: "alert",
        title: "LOW POWER RESERVE",
        message: "Battery levels dropped below 15%",
        severity: "warning",
        satelliteId: "SAT-005",
      },
      {
        userId: users[0]._id,
        type: "system",
        title: "ORBIT CORRECTION CONFIRMED",
        message: "Thruster burn complete",
        severity: "success",
        satelliteId: "SAT-001",
        read: true,
      },
      {
        userId: users[0]._id,
        type: "info",
        title: "UPLINK ESTABLISHED",
        message: "Handshake successful with GS-001",
        severity: "info",
        satelliteId: "SAT-001",
        read: true,
      },
    ]);
    console.log(`Created ${notifications.length} notifications.`);

    console.log("\n✅ Seed complete! Summary:");
    console.log(`   Users: ${users.length} (admin/operator/viewer)`);
    console.log(`   Satellites: ${satellites.length}`);
    console.log(`   Ground Stations: ${groundStations.length}`);
    console.log(`   Missions: ${missions.length}`);
    console.log(`   Alerts: ${alerts.length}`);
    console.log(`   Notifications: ${notifications.length}`);
    console.log("\n   Login credentials:");
    console.log("   Admin:    admin@orbitalx.sys    / admin123");
    console.log("   Operator: operator@orbitalx.sys / operator123");
    console.log("   Viewer:   viewer@orbitalx.sys   / viewer123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
