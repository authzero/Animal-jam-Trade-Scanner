const LineByLine = require('n-readlines');

class FileHelper {
  constructor(filePath) {
    this.filePath = filePath;
    this.lineByLine = new LineByLine(filePath);
  }

  next() {
    const lineBuffer = this.lineByLine.next();
    if (!lineBuffer) {
      return null; // End of file
    }
    return lineBuffer.toString('ascii');
  }

  close() {
    this.lineByLine.close();
  }
}

module.exports = FileHelper;