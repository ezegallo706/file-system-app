const fs = require("fs/promises");
const path = require("path");

class JsonFileDAO {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async readAll() {
    const data = await fs.readFile(this.filePath, "utf8");
    const records = JSON.parse(data || "[]");
    return Array.isArray(records) ? records : [];
  }

  async writeAll(records) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(records, null, 2));
  }
}

module.exports = JsonFileDAO;