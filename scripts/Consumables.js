/**
 * author: ash1kh
 * General helper script to facilititate common tasks
 */

module.exports = (params) => {
  params.variables["weeklyFolder"] = "Calendar/Timeline/2024/Weekly";
  params.variables["dailyFolder"] = "Calendar/Timeline/2024/Daily";
  params.variables["getEditor"] = getEditor;
  params.variables["openFileInLeaf"] = openFileInLeaf;
  params.variables["writeToFile"] = writeToFile;
  params.variables["getFilteredFiles"] = getFilteredFiles;
  params.variables["filterFiles"] = filterFiles;
  params.variables["linkify"] = linkify;
  params.variables["getHledgerAccounts"] = getHledgerAccounts;
};

/**
 * function to get editor
 * @param {object} _params - parameters passed to the function
 * @returns {object|undefined} the editor object or undefined
 */
function getEditor(_params) {
  const currentLeaf = _params.app.workspace.activeLeaf;
  if (!currentLeaf || !currentLeaf.view) {
    new Notice("No active file", 5e3);
  }
  return currentLeaf.view.editor;
}

/**
 * funtion to open a file on a seperate leaf or set leaf active if already open
 * @param {object} _app - global app object
 * @param {string} _filePath - absolute path for the file
 * @param {string} _fileDisplayName - file name without extension for display
 */

async function openFileInLeaf(_app, _filePath, _fileDisplayName) {
  let isOpen = false;
  let leafCount = 0;
  let iteratedLeaves = 0;

  await _app.workspace.iterateAllLeaves((_leaf) => {
    leafCount++;
  });

  await new Promise((resolve) => {
    _app.workspace.iterateAllLeaves((leaf) => {
      iteratedLeaves++;
      if (leaf.getDisplayText().includes(_fileDisplayName)) {
        _app.workspace.setActiveLeaf(leaf);
        isOpen = true;
      }
      if (iteratedLeaves === leafCount) {
        resolve();
      }
    });
  });

  if (!isOpen) {
    const newLeaf = _app.workspace.getLeaf(true);
    await newLeaf.openFile(_app.vault.getAbstractFileByPath(_filePath));
  }
}

/**
 * function to insert text into a heading of a file
 * @param {object} _app global app object
 * @param {string} _filePath absolute file path
 * @param {string} _headingTag markdown heading tag like '#' or '##'
 * @param {string} _headingToFind exact string of the heading to find
 * @param {string} _newLine new text to insert into the file
 */
async function writeToFile(
  _app,
  _filePath,
  _headingTag,
  _headingToFind,
  _newLine,
) {
  const KTfile = _app.vault.getAbstractFileByPath(_filePath);
  const cache = _app.metadataCache.getFileCache(KTfile);
  const targetHeading = cache.headings.find(
    (h) => h.heading === _headingToFind,
  );
  // write to specific day line
  const markdown = await _app.vault.read(KTfile);
  const newContent = markdown
    .split("\n")
    .map((line) => {
      if (
        line.startsWith(_headingTag) &&
        line.contains(targetHeading.heading)
      ) {
        return `${line}\n${_newLine}\r`;
      }
      return line;
    })
    .join("\n");

  await _app.vault.modify(KTfile, newContent);
}

/**
 * function to get filtered files based on frontmatter properties
 * @param {object} _params - Parameters object containing the app and vault properties
 * @param {string} _filter - The exact string to match files by
 * @param {string} _propertyType - Type of filtering in frontmatter (tags/others) default="tags"
 * @returns {object} An object containing filesName[string] | filesFrontmatter[object] | filesObj[object]
 */
async function getFilteredFiles(_params, _filter, _propertyType = "tags") {
  // Get all markdown files
  const files = _params.app.vault.getMarkdownFiles();

  // Initialize an array to hold files that match the specified property
  let filesObj = [];
  let filesName = [];
  let filesFrontmatter = [];

  // Iterate over each file to safely check for the existence of frontmatter
  files.forEach((file) => {
    if (file.extension !== "md") return; // exclued non md files

    const cache = _params.app.metadataCache.getFileCache(file); // Retrieve the file's metadata cache

    // Check if the file has frontmatter and if it contains the specified tags
    if (_propertyType === "tags") {
      if (cache && cache.frontmatter && cache.frontmatter.tags) {
        if (cache.frontmatter.tags.includes(_filter)) {
          filesName.push(file.basename);
          filesObj.push(file);
          filesFrontmatter.push(cache.frontmatter);
        }
      }
    }
  });

  // Return the list of files that contain the specified tags
  return { filesName, filesObj, filesFrontmatter };
}

/**
 * transform the filename into a link
 * @param {string} _filePath - absolute path of the file
 * @returns {string} - link to the file
 */
async function linkify(_filePath) {
  const ICONS = [
    "📚",
    "💼",
    "💡",
    "🎛️",
    "🗃️",
    "📋",
    "👤",
    "📦",
    "🎓",
    "⚙️",
    "📜",
    "📝",
  ];
  const fileNameWithExt = _filePath.split("/").pop();
  const fileName = fileNameWithExt
    .substring(0, fileNameWithExt.length - 3)
    .trim();

  // if file has icons then exclude it
  const fileSub = ICONS.some((icon) => fileName.includes(icon))
    ? fileName.substring(fileName.indexOf(" ") + 1).trim()
    : fileName.trim();
  return `[[${fileName}|${fileSub}]]`;
}

async function filterFiles(_params, _filter, _property) {
  // Get all markdown files
  const files = _params.app.vault.getMarkdownFiles();

  let filteredFiles;

  // Iterate over each file to safely check for the existence of frontmatter and the specified property
  files.forEach((file) => {
    const cache = _params.app.metadataCache.getFileCache(file);
    if (cache && cache.frontmatter && _property in cache.frontmatter) {
      const propertyValue = cache.frontmatter[_property];
      // Check if the specified property includes the filter
      if (propertyValue && propertyValue.includes(_filter)) {
        if (!filteredFiles) {
          filteredFiles = [];
        }
        filteredFiles.push(file);
      }
    }
  });

  if (filteredFiles) {
    return filteredFiles.map((file) => file.basename);
  } else {
    console.log("No files matched the filter criteria.");
    return [];
  }
}

async function getHledgerAccounts(_params, _hledger_accounts_file_path) {
  if (!(await _params.app.vault.adapter.exists(_hledger_accounts_file_path))) {
    throw new Notice(`Hledger Accounts file is not found.`, 5e3);
  }

  var accounts_content = await this.app.vault.adapter.read(
    _hledger_accounts_file_path,
  );
  var accounts = [];
  var lines = accounts_content.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("account")) {
      var account_name = lines[i].replace("account ", "");
      if (account_name.split(";").length > 1) {
        account_name = account_name.split(";")[0];
      }
      accounts.push(account_name.trim());
    }
  }
  // console.log(accounts);
  return accounts;
}
