const CHORE_TASK_FOLDER = "4-Desk/Tasks/Chore";
const TASK_TYPE = ["epic", "story", "tasks", "subtasks"];

module.exports = async (params) => {
  if (params.variables["taskChoice"] === "chore") {
    const {
      quickAddApi: { inputPrompt, suggester },
    } = params;
    const { update } = app.plugins.plugins["metaedit"].api;
    const title = await inputPrompt("Chore title ?");
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
    const choreTaskNote = `${CHORE_TASK_FOLDER}/📋 ${title}.md`;
    const choreTaskTemplate = `---
fileClass:
- tasksClass
uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
tags:
- Category/Tasks
aliases:
- "Chore- ${title}"
- "📋 ${title}"
---
# [[📋 ${title}|${title}]]

> [!EXAMPLE]- [[🗃️ Tasks Database|Tasks Database]]
> - 📆 (for:: [[<%tp.date.now('YYYY')%>-W<%tp.date.now('ww')%>]])
> - (category::) (type::)

`;
    // note creation also check for duplicate file name
    !(await params.app.vault.adapter.exists(choreTaskNote))
      ? await params.app.vault.create(choreTaskNote, choreTaskTemplate)
      : new Notice(`File ${title} already exists.`, 5e3);
    // update the metadata
    await update("category", "chore", choreTaskNote);
    await update("type", taskType, choreTaskNote);
    // also open the newly created file in new pane
    const newLeaf = params.app.workspace.getLeaf(true);
    await newLeaf.openFile(app.vault.getAbstractFileByPath(choreTaskNote));
  }
};
