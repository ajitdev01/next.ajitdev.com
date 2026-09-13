import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "todos.json");

// Ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

/**
 * Read all todos from local JSON storage
 */
export function readLocalTodos() {
  try {
    ensureDataFile();
    const content = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("Error reading local todos:", error);
    return [];
  }
}

/**
 * Write all todos to local JSON storage
 */
export function writeLocalTodos(todos) {
  try {
    ensureDataFile();
    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing local todos:", error);
    return false;
  }
}

/**
 * Helper to generate unique ID
 */
export function generateId() {
  return "td_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
