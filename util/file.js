const fs = require("fs");
const path = require("path");
const deleteFile = (filePath) => {
  fs.unlink(
    path.join(path.dirname(require.main.filename), filePath),
    (error) => {
      if (error) {
        throw error;
      }
    }
  );
};

exports.deleteFile = deleteFile;
