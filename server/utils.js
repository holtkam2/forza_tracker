const _ = require('lodash');

const getGearTime = (gear, dashboardData, analyticsObj) => {
  if (isNaN(analyticsObj.currentLapData[`gear${gear}Time`])) {
    return 0;
  } else {
    if (dashboardData.gear === gear) {
      return analyticsObj.currentLapData[`gear${gear}Time`] + 1;
    } else {
      return analyticsObj.currentLapData[`gear${gear}Time`];
    }
  }
}

// updates all properties of the passed in analytics object.
const updateAnalyticsObj = (dashboardData, analyticsObj) => {

  // if there is a new lap, record previous lap data in analytics Obj and reset currentLapData.
  if (analyticsObj.currentLapNo < dashboardData.lapNumber) {
    analyticsObj[`lap${dashboardData.lapNumber}`] =  { ...analyticsObj.currentLapData };
    analyticsObj[`lap${dashboardData.lapNumber}`].lapTime = dashboardData.lastLap
    analyticsObj.currentLapNo++;

    for (const key in analyticsObj.currentLapData) {
      analyticsObj.currentLapData[key] = 0;
    }
  }

  // update analyticsObj
  analyticsObj.currentLapData = {
    dataPointsCount: analyticsObj.currentLapData.dataPointsCount + 1,
    totalRPMs: analyticsObj.currentLapData.totalRPMs + dashboardData.rpmCurrent,
    totalSpeed: analyticsObj.currentLapData.totalSpeed + dashboardData.speedMPH,
    averageSpeed: analyticsObj.currentLapData.totalSpeed / analyticsObj.currentLapData.dataPointsCount,
    averageRPMs: analyticsObj.currentLapData.totalRPMs / analyticsObj.currentLapData.dataPointsCount,
    totalFrictionFL: analyticsObj.currentLapData.totalFrictionFL + dashboardData.tireFrictionFL,
    averageFrictionFL: analyticsObj.currentLapData.totalFrictionFL / analyticsObj.currentLapData.dataPointsCount,
    totalFrictionFR: analyticsObj.currentLapData.totalFrictionFR + dashboardData.tireFrictionFR,
    averageFrictionFR: analyticsObj.currentLapData.totalFrictionFR / analyticsObj.currentLapData.dataPointsCount,
    totalFrictionBL: analyticsObj.currentLapData.totalFrictionBL + dashboardData.tireFrictionBL,
    averageFrictionBL: analyticsObj.currentLapData.totalFrictionBL / analyticsObj.currentLapData.dataPointsCount,
    totalFrictionBR: analyticsObj.currentLapData.totalFrictionBR + dashboardData.tireFrictionBR,
    averageFrictionBR: analyticsObj.currentLapData.totalFrictionBR / analyticsObj.currentLapData.dataPointsCount,
    gear1Time: getGearTime(1, dashboardData, analyticsObj),
    gear2Time: getGearTime(2, dashboardData, analyticsObj),
    gear3Time: getGearTime(3, dashboardData, analyticsObj),
    gear4Time: getGearTime(4, dashboardData, analyticsObj),
    gear5Time: getGearTime(5, dashboardData, analyticsObj),
    gear6Time: getGearTime(6, dashboardData, analyticsObj),
    gear7Time: getGearTime(7, dashboardData, analyticsObj),
    gear8Time: getGearTime(8, dashboardData, analyticsObj),
    lapTime: dashboardData.raceCurrentLap
  }

  return analyticsObj;
}

const buildDataObj = (packet) => {

  return {
    // telemetry data
    rpmMax: packet.slice(8, 12).readFloatLE(0), // f32
    rpmIdle: packet.slice(12, 16).readFloatLE(0), // f32
    rpmCurrent: packet.slice(16, 20).readFloatLE(0), // f32
    speedMPH: packet.slice(244, 248).readFloatLE(0) * 2.23, // f32
    power: packet.slice(248, 252).readFloatLE(0), // f32
    torque: packet.slice(252, 256).readFloatLE(0), // f32
    fuel: packet.slice(276, 280).readFloatLE(0), // f32

    /* todo: find the correct data to get current gear */
    gear: packet.slice(307, 308).readInt8(0), // u8

    // tire friction
    tireFrictionFL: packet.slice(180,184).readFloatLE(0), // f32
    tireFrictionFR: packet.slice(184,188).readFloatLE(0), // f32
    tireFrictionBL: packet.slice(188,192).readFloatLE(0), // f32
    tireFrictionBR: packet.slice(192,196).readFloatLE(0), // f32

    // car stats
    carOrdinal: packet.slice(212, 216).readUInt16LE(0), // s32
    carClass: packet.slice(216, 220).readUInt16LE(0),// s32
    carPerformanceIndex: packet.slice(220, 224).readUInt16LE(0), // s32
    drivetrainType: packet.slice(224, 228).readUInt16LE(0), // s32
    numCylinders: packet.slice(228, 232).readUInt16LE(0), // s32
    
    // race stats
    raceBestLap: packet.slice(284, 288).readFloatLE(0), // f32
    lastLap: packet.slice(288,292).readFloatLE(0), // f32
    raceCurrentLap: packet.slice(292, 296).readFloatLE(0), // f32
    lapNumber: packet.slice(300, 302).readUInt16LE(0), // u16

  };
}

const generateDummyData = (analyticsObj) => {
  return {
    rpmMax: 7500,
    rpmIdle: 800,
    rpmCurrent: Math.random(0, 1) * 1000,
    speedMPH: Math.random(0, 1),
    power: Math.random(0, 1),
    torque: Math.random(0, 1),
    gear: 4,
    tireFrictionFL: Math.random(0, 1),
    tireFrictionFR: Math.random(0, 1),
    tireFrictionBL: Math.random(0, 1),
    tireFrictionBR: Math.random(0, 1),
    carOrdinal: Math.random(0, 1),
    carClass: Math.random(0, 1),
    carPerformanceIndex: Math.random(0, 1),
    drivetrainType: Math.random(0, 1),
    numCylinders: Math.random(0, 1),
    raceBestLap: Math.random(0, 1),
    lastLap: Math.random(0, 1),
    raceCurrentLap: Math.random(0, 1),
    lapNumber: Math.random(0, 1),
    analytics: analyticsObj
  }
}

module.exports = {
  buildDataObj, 
  generateDummyData,
  updateAnalyticsObj
}