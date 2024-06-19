// ProjectID = Category + Type Shortcode + (count + 1 [3 digits]) + Year
// PMS001-23

// TODO: reform and should be name as efforts

const PRIORITY = ["⏫ Urgent", "🔼 High", "⏺️ Normal", "🔽 Low"];
const CATEGORY = ["Personal", "Client", "Experimental"];
const TYPE = [
  "WB - Web",
  "BC - Blockchain",
  "DO - DevOps",
  "OS - OpenSource",
  "MS - Misc",
  "3D - 3D",
  "UX - UX",
  "GD - Games",
];

module.exports = async params => {
  const {
    quickAddApi: { inputPrompt, suggester },
  } = params;

  const projectName = await inputPrompt("Project name:");
  if (!projectName) {
    new Notice("No Project name given! Project creation cancel", 5e3);
    return;
  }

  const priority = await suggester(PRIORITY, PRIORITY);
  if (!priority) {
    new Notice("No Priority choosen! Project creation cancel", 5e3);
    return;
  }

  const category = await suggester(CATEGORY, CATEGORY);
  if (!category) {
    new Notice("No Category choosen! Project creation cancel", 5e3);
    return;
  }
  const projectCategory = category.charAt(0);

  const typeChoice = await suggester(TYPE, TYPE);
  if (!typeChoice) {
    new Notice("No Type choosen! Project creation cancel", 5e3);
    return;
  }
  const type = typeChoice.split("-")[1].trim();
  const projectType = typeChoice.split("-")[0].trim();

  const tag = "Category/Project";
  const cache = params.app.metadataCache;
  const files = params.app.vault.getMarkdownFiles();
  const counts = [];
  files.forEach(file => {
    const fileCache = cache.getFileCache(file);
    const fileTags = fileCache.frontmatter?.tags;
    if (fileTags) {
      if (fileTags.includes(tag)) {
        counts.push(file);
      }
    }
  });
  const projectNumberStr = (counts.length + 1).toString();
  const projectNumberStrZero = "0".repeat(3 - projectNumberStr.length);
  const projectNumber = projectNumberStrZero + projectNumberStr;
  const date = window.moment().format("gg");

  const projectID = `${projectCategory}${projectType}${projectNumber}-${date}`;

  params.variables = {
    projectName: projectName,
    priority: priority,
    category: category,
    type: type,
    projectID: projectID,
  };
};
