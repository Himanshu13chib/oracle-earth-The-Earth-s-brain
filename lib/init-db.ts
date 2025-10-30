import { initializeDatabase, dbOperations } from './database';

// Initialize database and add sample data
export async function initializeOracleEarth() {
  console.log('Initializing Oracle Earth database...');
  
  // Create tables
  await initializeDatabase();
  
  // Add sample conflict data
  const sampleConflicts = [
    {
      country1: 'Russia',
      country2: 'Ukraine',
      probability: 85,
      factors: 'Territorial disputes, Military buildup, Historical tensions',
      lastUpdated: new Date().toISOString()
    },
    {
      country1: 'China',
      country2: 'Taiwan',
      probability: 65,
      factors: 'Sovereignty claims, Military exercises, Economic pressure',
      lastUpdated: new Date().toISOString()
    },
    {
      country1: 'India',
      country2: 'Pakistan',
      probability: 45,
      factors: 'Kashmir dispute, Border tensions, Nuclear capabilities',
      lastUpdated: new Date().toISOString()
    }
  ];

  for (const conflict of sampleConflicts) {
    try {
      await dbOperations.insertConflict(
        conflict.country1,
        conflict.country2,
        conflict.probability,
        conflict.factors,
        conflict.lastUpdated
      );
    } catch (error) {
      // Ignore duplicate entries
    }
  }

  // Add sample environment data
  const sampleEnvironment = [
    {
      region: 'Amazon Basin',
      type: 'deforestation',
      value: 15.2,
      unit: '% loss/year',
      coordinates: '-3.4653,-62.2159',
      timestamp: new Date().toISOString()
    },
    {
      region: 'Arctic',
      type: 'glacier',
      value: -8.5,
      unit: '% ice loss/year',
      coordinates: '71.0,-8.0',
      timestamp: new Date().toISOString()
    },
    {
      region: 'Global',
      type: 'co2',
      value: 421.3,
      unit: 'ppm',
      coordinates: '0,0',
      timestamp: new Date().toISOString()
    },
    {
      region: 'Global',
      type: 'temperature',
      value: 1.2,
      unit: '°C above baseline',
      coordinates: '0,0',
      timestamp: new Date().toISOString()
    }
  ];

  for (const env of sampleEnvironment) {
    try {
      await dbOperations.insertEnvironmentData(
        env.region,
        env.type as any,
        env.value,
        env.unit,
        env.coordinates,
        env.timestamp
      );
    } catch (error) {
      // Ignore duplicate entries
    }
  }

  // Add sample terrorism data
  const sampleTerrorism = [
    {
      country: 'Afghanistan',
      organization: 'Taliban',
      riskLevel: 'high',
      fundingSources: 'Drug trafficking, Illegal mining',
      lastActivity: '2024-01-15'
    },
    {
      country: 'Syria',
      organization: 'ISIS Remnants',
      riskLevel: 'medium',
      fundingSources: 'Oil smuggling, Extortion',
      lastActivity: '2024-01-10'
    },
    {
      country: 'Nigeria',
      organization: 'Boko Haram',
      riskLevel: 'high',
      fundingSources: 'Kidnapping, Cattle rustling',
      lastActivity: '2024-01-20'
    },
    {
      country: 'Somalia',
      organization: 'Al-Shabaab',
      riskLevel: 'critical',
      fundingSources: 'Piracy, Charcoal trade',
      lastActivity: '2024-01-25'
    }
  ];

  for (const terror of sampleTerrorism) {
    try {
      await dbOperations.insertTerrorismData(
        terror.country,
        terror.organization,
        terror.riskLevel as any,
        terror.fundingSources,
        terror.lastActivity
      );
    } catch (error) {
      // Ignore duplicate entries
    }
  }

  // Add sample economic data
  const sampleEconomic = [
    {
      country: 'United States',
      gdp: 26.9,
      inflation: 3.2,
      unemployment: 3.7,
      tradeBalance: -948.1,
      timestamp: new Date().toISOString()
    },
    {
      country: 'China',
      gdp: 17.7,
      inflation: 0.2,
      unemployment: 5.2,
      tradeBalance: 676.4,
      timestamp: new Date().toISOString()
    },
    {
      country: 'Japan',
      gdp: 4.9,
      inflation: 3.3,
      unemployment: 2.6,
      tradeBalance: -29.8,
      timestamp: new Date().toISOString()
    },
    {
      country: 'Germany',
      gdp: 4.3,
      inflation: 5.9,
      unemployment: 3.0,
      tradeBalance: 298.5,
      timestamp: new Date().toISOString()
    }
  ];

  for (const econ of sampleEconomic) {
    try {
      await dbOperations.insertEconomicData(
        econ.country,
        econ.gdp,
        econ.inflation,
        econ.unemployment,
        econ.tradeBalance,
        econ.timestamp
      );
    } catch (error) {
      // Ignore duplicate entries
    }
  }

  console.log('Oracle Earth database initialized with sample data!');
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeOracleEarth().catch(console.error);
}