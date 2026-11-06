const fs = require("fs/promises");

class JsonFileDao {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async readAll() {
    const data = await fs.readFile(this.filePath, "utf-8");
    const parsed = JSON.parse(data || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }

  async writeAll(records) {
    await fs.writeFile(this.filePath, JSON.stringify(records, null, 2));
  }
}

module.exports = JsonFileDao;