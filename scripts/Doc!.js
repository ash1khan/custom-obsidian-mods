const IDEA_FOLDER_PATH = "4-Desk/Notes/Ideas";
const ALL_TYPES = ["Improvement", "Project", "Blog", "Action", "Brainstorm"];
const BLOG_KANBAN_FILE = "5-Opr/Kanbans/🎛️ Blog Kanban.md";
const KANBAN_LANE = "Ideation";
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

function linkify(abs_file_path) {
  const fileNameWithExt = abs_file_path.split("/").pop();
  const fileName = fileNameWithExt
    .substring(0, fileNameWithExt.length - 3)
    .trim();

  const fileSub = ICONS.some(icon => fileName.includes(icon))
    ? fileName.substring(fileName.indexOf(" ") + 1).trim()
    : fileName.trim();
  return `[[${fileName}|${fileSub}]]`;
}
module.exports = async params => {
  const {
    quickAddApi: { inputPrompt, suggester, yesNoPrompt },
  } = params;
  const { update } = app.plugins.plugins["metaedit"].api;

  // REFACTOR: if reference page has idea section then apply hastag header on ref
  // REFACTOR: if has selection in the current active page then perform refactor

  const selection = false;

  if (selection) {
  }

  // title field also checks for no input
  const title = await inputPrompt("What is the idea ?");
  if (!title)
    throw (
      (notice("No idea title is given."), new Error("No idea title is given."))
    );
  // ref page
  const shouldRefCurrentPage = await yesNoPrompt("Reference to active page?");
  // type choice also checks for no choice
  const ideaType = await suggester(ALL_TYPES, ALL_TYPES);
  if (!ideaType)
    throw (notice("No choice selected."), new Error("No choice selected."));
  // calculated time
  const waitingPeriod = window.moment().add(14, "d").format(`"yyyy-MM-DD"`);
  // Full abs note name with path and template
  const ideaNote = `${IDEA_FOLDER_PATH}/💡 ${title}.md`;
  const ideaTemplate = `---
fileClass:
- ideaClass
uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
tags:
- Category/Idea
phase: Ideation
aliases:
- "${title}"
- "Idea- ${title}"
- "Idea- 💡 ${title}"
---
# [[💡 ${title}|${title}]]

> [!EXAMPLE]- [[🗃️ Ideas Database|Ideas Database]]
> - 🎗️ (type:: )
> - ↩️  (ref:: )
> - 📤 (applied_on::)
> - 🔔 @ (waiting_period::)
> - 🛩️ (maturity::)

## ✴ What am I thinking


## 〽 Roadblocks


## 🎖 Findings


## 🖨 Supported Resources

`;
  // note creation also check for duplicate file name
  !(await params.app.vault.adapter.exists(ideaNote))
    ? await params.app.vault.create(ideaNote, ideaTemplate)
    : new Notice(`File ${title} already exists.`, 5e3);

  // update the meta data
  await update("type", ideaType, ideaNote);
  await update("waiting_period", waitingPeriod, ideaNote);
  await update(
    "ref",
    shouldRefCurrentPage
      ? params.app.workspace.getActiveFile()
        ? linkify(params.app.workspace.getActiveFile().path)
        : new Notice("No active file", 5e3)
      : ``,
    ideaNote
  );
  // for blog type also add to kanban board ideation lane
  if (ideaType === "Blog") {
    const KTfile = app.vault.getAbstractFileByPath(BLOG_KANBAN_FILE);
    const cache = app.metadataCache.getFileCache(KTfile);
    const targetHeading = cache.headings.find(h => h.heading === KANBAN_LANE);
    const markdown = await app.vault.read(KTfile);

    const newContent = markdown
      .split("\n")
      .map(line => {
        if (line.startsWith("##") && line.contains(targetHeading.heading)) {
          return `${line}\n- [ ] ${linkify(ideaNote)}\r`;
        }
        return line;
      })
      .join("\n");

    await app.vault.modify(KTfile, newContent);
  }

  // also open the newly created file in new pane
  const newLeaf = params.app.workspace.getLeaf(true);
  await newLeaf.openFile(app.vault.getAbstractFileByPath(ideaNote));
};
