const TASK_TYPE = ["epic", "story", "tasks", "subtasks"];
const BACKLOG_FOLDER = "4-Desk/Tasks/Backlog";
const TASKS_FOLDER = "4-Desk/Tasks/Tasks";

// FIX: get project file names and path not working
async function getAllfiles(suggester) {
  const files = app.metadataCache
    .getCachedFiles()
    .map((file) =>
      app.metadataCache.getFileCache(app.vault.getAbstractFileByPath(file))
    )
    .filter((file) => file?.frontmatter?.tags?.contains("Category/Project"));
  //.filter((file) =>
  //  app.metadataCache.getFileCache(
  //    app.vault.getAbstractFileByPath(file).path.contains("(Template)")
  //  )
  //);
  console.log(files);
  const refLink = await suggester(files, files);
  if (!refLink) return;
  return refLink;
}

module.exports = async (params) => {
  if (params.variables["taskChoice"] === "assignment") {
    const {
      quickAddApi: { inputPrompt, suggester, yesNoPrompt },
    } = params;
    const { update } = app.plugins.plugins["metaedit"].api;
    const title = await inputPrompt("Task title ?");
    if (!title) {
      throw (new Notice("No title is given"), new Error("No title is given"));
    }
    const taskType = await suggester(TASK_TYPE, TASK_TYPE);
    if (!taskType) {
      throw (
        (new Notice("Task type not choosen"),
        new Error("Task type not choosen"))
      );
    }
    const ref = await yesNoPrompt("Link current active page ?");
    const assignmentTaskNote =
      taskType === "story" || taskType === "epic"
        ? `${BACKLOG_FOLDER}/📋 ${title}.md`
        : `${TASKS_FOLDER}/📋 ${title}`;

    const assignmentTaskTemplate = `---
fileClass:
- tasksClass
uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
tags:
- Category/Tasks
aliases:
- "${title}"
- "${taskType === "story"}-📋 ${title}"
---
# [[📋 ${title}|${title}]]

> [!EXAMPLE]- [[🗃️ Tasks Database|Tasks Database]]
> - 📆 (for:: [[<%tp.date.now('YYYY')%>-W<%tp.date.now('ww')%>]])
> - (category::) (type::)
> - ↩️ (ref::)

`;
    // note creation also check for duplicate file name
    !(await params.app.vault.adapter.exists(assignmentTaskNote))
      ? await params.app.vault.create(
          assignmentTaskNote,
          assignmentTaskTemplate
        )
      : new Notice(`File ${title} already exists.`, 5e3);
    // update the metadata
    await update("category", "assignment", assignmentTaskNote);
    await update("type", taskType, assignmentTaskNote);
    await update(
      "ref",
      ref
        ? params.app.workspace.getActiveFile()
          ? linkify(params.app.workspace.getActiveFile().path)
          : new Notice("No active file", 5e3)
        : ``,
      assignmentTaskNote
    );
    // also open the newly created file in new pane
    const newLeaf = params.app.workspace.getLeaf(true);
    await newLeaf.openFile(app.vault.getAbstractFileByPath(assignmentTaskNote));
  }
};
