import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = path.join(process.cwd(), 'oracle-earth.db');
const db = createClient({
  url: `file:${dbPath}`
});

export interface ConflictData {
  id?: number;
  country1: string;
  country2: string;
  probability: number;
  factors: string;
  lastUpdated: string;
}

export interface EnvironmentData {
  id?: number;
  region: string;
  type: 'deforestation' | 'co2' | 'glacier' | 'temperature';
  value: number;
  unit: string;
  coordinates: string;
  timestamp: string;
}

export interface TerrorismData {
  id?: number;
  country: string;
  organization: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  fundingSources: string;
  lastActivity: string;
}

export interface EconomicData {
  id?: number;
  country: string;
  gdp: number;
  inflation: number;
  unemployment: number;
  tradeBalance: number;
  timestamp: string;
}

export interface ChatHistory {
  id?: number;
  question: string;
  answer: string;
  timestamp: string;
  category: string;
}

// Initialize database tables
export async function initializeDatabase() {
  // Enable foreign keys
  await db.execute('PRAGMA foreign_keys = ON');

  // Conflicts table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS conflicts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country1 TEXT NOT NULL,
      country2 TEXT NOT NULL,
      probability REAL NOT NULL,
      factors TEXT NOT NULL,
      lastUpdated TEXT NOT NULL
    )
  `);

  // Environment table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS environment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region TEXT NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      coordinates TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  // Terrorism table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS terrorism (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT NOT NULL,
      organization TEXT NOT NULL,
      riskLevel TEXT NOT NULL,
      fundingSources TEXT NOT NULL,
      lastActivity TEXT NOT NULL
    )
  `);

  // Economic data table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS economic (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT NOT NULL,
      gdp REAL NOT NULL,
      inflation REAL NOT NULL,
      unemployment REAL NOT NULL,
      tradeBalance REAL NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  // Chat history table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);
}

// Database operations
export const dbOperations = {
  // Conflicts
  async insertConflict(country1: string, country2: string, probability: number, factors: string, lastUpdated: string) {
    return await db.execute({
      sql: 'INSERT INTO conflicts (country1, country2, probability, factors, lastUpdated) VALUES (?, ?, ?, ?, ?)',
      args: [country1, country2, probability, factors, lastUpdated]
    });
  },
  
  async getConflicts() {
    const result = await db.execute('SELECT * FROM conflicts ORDER BY probability DESC');
    return result.rows;
  },
  
  async getConflictByCountries(country1: string, country2: string) {
    const result = await db.execute({
      sql: 'SELECT * FROM conflicts WHERE (country1 = ? AND country2 = ?) OR (country1 = ? AND country2 = ?)',
      args: [country1, country2, country2, country1]
    });
    return result.rows;
  },

  // Environment
  async insertEnvironmentData(region: string, type: string, value: number, unit: string, coordinates: string, timestamp: string) {
    return await db.execute({
      sql: 'INSERT INTO environment (region, type, value, unit, coordinates, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      args: [region, type, value, unit, coordinates, timestamp]
    });
  },
  
  async getEnvironmentData() {
    const result = await db.execute('SELECT * FROM environment ORDER BY timestamp DESC');
    return result.rows;
  },
  
  async getEnvironmentByType(type: string) {
    const result = await db.execute({
      sql: 'SELECT * FROM environment WHERE type = ? ORDER BY timestamp DESC',
      args: [type]
    });
    return result.rows;
  },

  // Terrorism
  async insertTerrorismData(country: string, organization: string, riskLevel: string, fundingSources: string, lastActivity: string) {
    return await db.execute({
      sql: 'INSERT INTO terrorism (country, organization, riskLevel, fundingSources, lastActivity) VALUES (?, ?, ?, ?, ?)',
      args: [country, organization, riskLevel, fundingSources, lastActivity]
    });
  },
  
  async getTerrorismData() {
    const result = await db.execute('SELECT * FROM terrorism ORDER BY riskLevel DESC');
    return result.rows;
  },

  // Economic
  async insertEconomicData(country: string, gdp: number, inflation: number, unemployment: number, tradeBalance: number, timestamp: string) {
    return await db.execute({
      sql: 'INSERT INTO economic (country, gdp, inflation, unemployment, tradeBalance, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      args: [country, gdp, inflation, unemployment, tradeBalance, timestamp]
    });
  },
  
  async getEconomicData() {
    const result = await db.execute('SELECT * FROM economic ORDER BY timestamp DESC');
    return result.rows;
  },

  // Chat history
  async insertChatHistory(question: string, answer: string, timestamp: string, category: string) {
    return await db.execute({
      sql: 'INSERT INTO chat_history (question, answer, timestamp, category) VALUES (?, ?, ?, ?)',
      args: [question, answer, timestamp, category]
    });
  },
  
  async getChatHistory() {
    const result = await db.execute('SELECT * FROM chat_history ORDER BY timestamp DESC LIMIT 50');
    return result.rows;
  }
};

export default db;