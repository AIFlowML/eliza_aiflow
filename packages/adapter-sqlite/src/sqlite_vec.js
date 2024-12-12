import * as sqliteVec from "sqlite-vec";
import { elizaLogger } from "@ai16z/eliza";
// Loads the sqlite-vec extensions into the provided SQLite database
export function loadVecExtensions(db) {
    try {
        // Load sqlite-vec extensions
        sqliteVec.load(db);
        elizaLogger.log("sqlite-vec extensions loaded successfully.");
    }
    catch (error) {
        elizaLogger.error("Failed to load sqlite-vec extensions:", error);
        throw error;
    }
}
/**
 * @param db - An instance of better - sqlite3 Database
 */
export function load(db) {
    loadVecExtensions(db);
}
//# sourceMappingURL=sqlite_vec.js.map