module.exports = async params => {};



// calculting total days took from starting days to end date
// took:: `$= Math.round(DateTime.fromISO(!dv.current().end ? DateTime.now() : dv.current().end).diff(DateTime.fromISO(!dv.current().start ? DateTime.now() : dv.current().start)) /(1000 * 60 * 60 * 24))`


// file weeklyTask!.js

// const WEEKLY_TASK_FOLDER = "4-Desk/Tasks/Weekly";
// module.exports = async params => {
//   if (params.variables["taskChoice"] === "weekly") {
//     const { update } = app.plugins.plugins["metaedit"].api;

//     const title = `Week ${moment().week()}, ${moment().year()}`;
//     const weeklyTaskNote = `${WEEKLY_TASK_FOLDER}/📋 ${title}.md`;

//     // template
//     const weeklyTaskTemplate = `---
// fileClass:
// - tasksClass
// uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
// created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
// updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
// tags:
// - Category/Tasks
// aliases:
// - "Tasks- Week <% tp.date.now('ww, YYYY') %>"
// - "Tasks- 📋 ${title}"
// ---
// # [[📋 ${title}|${title}]]

// > [!EXAMPLE]- [[🗃️ Tasks Database|Tasks Database]]
// > - 📆 (for:: [[<%tp.date.now('YYYY')%>-W<%tp.date.now('ww')%>]])
// > - (category::) (type::)

// ## Monday

// ## Tuesday

// ## Wednesday

// ## Thursday

// ## Friday

// ## Saturday

// `;

//     // note creation
//     !(await params.app.vault.adapter.exists(weeklyTaskNote))
//       ? await params.app.vault.create(weeklyTaskNote, weeklyTaskTemplate)
//       : new Notice(`File ${title} already exists.`, 5e3);

//     // update meta data
//     await update("category", "weekly", weeklyTaskNote);
//     await update("type", "tasks", weeklyTaskNote);

//     // open the newly created file in new pane
//     const newLeaf = params.app.workspace.getLeaf(true);
//     await newLeaf.openFile(app.vault.getAbstractFileByPath(weeklyTaskNote));
//   }
// };

// file TaskCreationMacro.js
// const TASK_CHOICE = ["Weekly", "Project", "Chore"];
// const TASK_TYPE = ["general", "misc", "tasks", "subtasks"];
// const WEEKLY_TASK_FOLDER = "4-Desk/Tasks/Weekly";
// const CHORE_TASK_FOLDER = "4-Desk/Tasks/Chore";
// const PROJECT_TASK_FOLDER = "4-Desk/Tasks/Project";
// const ICONS = [
//   "📚",
//   "💼",
//   "💡",
//   "🎛️",
//   "🗃️",
//   "📋",
//   "👤",
//   "📦",
//   "🎓",
//   "⚙️",
//   "📜",
//   "📝",
// ];

// async function createNote(params, update, metadata, template, title, folder) {
//   const note = `${folder}/📋 ${title}.md`;

//   // note creation
//   !(await params.app.vault.adapter.exists(note))
//     ? await params.app.vault.create(note, template)
//     : new Notice(`File ${title} already exists.`, 5e3);

//   // update meta data
//   await update("category", `${metadata["category"]}`, note);
//   await update("type", `${metadata["type"]}`, note);
//   await update("for", metadata["for"], note);

//   // open the newly created file in new pane
//   const newLeaf = params.app.workspace.getLeaf(true);
//   await newLeaf.openFile(app.vault.getAbstractFileByPath(note));
// }

// function linkify(abs_file_path) {
//   const fileNameWithExt = abs_file_path.split("/").pop();
//   const fileName = fileNameWithExt
//     .substring(0, fileNameWithExt.length - 3)
//     .trim();

//   const fileSub = ICONS.some(icon => fileName.includes(icon))
//     ? fileName.substring(fileName.indexOf(" ") + 1).trim()
//     : fileName.trim();
//   return `[[${fileName}|${fileSub}]]`;
// }

// // -----------------------------------------------------------------------------------

// module.exports = async params => {
//   const {
//     quickAddApi: { suggester, inputPrompt },
//   } = params;
//   const { update } = app.plugins.plugins["metaedit"].api;

//   // get selection
//   const currentLeaf = params.app.workspace.activeLeaf;
//   if (!currentLeaf || !currentLeaf.view) {
//     new Notice("No active file", 5e3);
//   }
//   const currentFile = params.app.workspace.getActiveFile();
//   const editor = currentLeaf.view.editor;
//   const selectedText = editor.getSelection();

//   // task choice
//   const taskChoice = await suggester(TASK_CHOICE, TASK_CHOICE);
//   if (!taskChoice) {
//     new Notice("No choice is given. Task creation cancel", 5e3);
//     return;
//   }

//   let title;
//   let template;
//   let metadata = {};

//   switch (taskChoice) {
//     case "Weekly":
//       // note setup
//       title = `Tasks- Week ${moment().week()}, ${moment().year()}`;
//       metadata["for"] = `[[${moment().year()}-W${moment().week()}]]`;
//       // metadata["category"] = "weekly";
//       metadata["type"] = "tasks";
//       template = `---
// fileClass:
// - tasksClass
// uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
// created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
// updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
// tags:
// - Category/Tasks
// aliases:
// - "Tasks- Week <% tp.date.now('ww, YYYY') %>"
// - "Tasks- 📋 ${title}"
// ---
// # [[📋 ${title}|${title}]]

// > [!command]- [[🗃️ Tasks Database|TasksDB]]
// > 📆 (for::)
// > 🎗️ (category::) (type::)

// ## Monday

// ## Tuesday

// ## Wednesday

// ## Thursday

// ## Friday

// ## Saturday

// `;
//       // note creation
//       createNote(params, update, metadata, template, title, WEEKLY_TASK_FOLDER);
//       break;
//     case "Chore":
//       if (!currentLeaf || !currentLeaf.view) {
//         new Notice("No active file", 5e3);
//       }

//       // get if anything is selected
//       const selectedText = editor.getSelection();

//       // reference page absolute path
//       const ref = selectedText
//         ? currentFile
//           ? linkify(currentFile.path)
//           : new Notice("No active file", 5e3)
//         : ``;

//       // note setup
//       selectedText
//         ? (title = selectedText)
//         : (title = await inputPrompt("Title for the chore ?"));

//       if (!title) {
//         new Notice("No title is given. Task creation cancel", 5e3);
//         return;
//       }
//       `Chore- 📋 ${title}`;
//       selectedText
//         ? (metadata["for"] = linkify(currentFile.path))
//         : (metadata["for"] = "");
//       metadata["category"] = "chore";
//       metadata["type"] = await suggester(TASK_TYPE, TASK_TYPE);
//       if (!metadata["type"]) {
//         new Notice("No type is choosen. Task creation cancel", 5e3);
//         return;
//       }

//       // template
//       const CHORE_TEMPLATE = `---
// fileClass:
// - tasksClass
// uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
// created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
// updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
// tags:
// - Category/Tasks
// aliases:
// - "Chore- ${title}"
// - "Chore- 📋 ${title}"
// ---
// # [[📋 ${title}|${title}]]

// > [!portal]- [[🗃️ Tasks Database|Tasks Database]]
// > ↩️ (for::)
// > 🎗️ (category::) (type::)

// `;

//       // replace the selection with links
//       selectedText ? editor.replaceSelection(`[[📋 ${title}]]`) : null;

//       // create note
//       createNote(
//         params,
//         update,
//         metadata,
//         CHORE_TEMPLATE,
//         title,
//         CHORE_TASK_FOLDER
//       );
//       break;
//     case "Project":
//       // get selection
//       // ask for task type
//       // ask for title or use selectedText
//       // create the note
//       // place the note to kanban
//       break;
//     default:
//       break;
//   }

// };

// file TaskConvertMacro.js
// const TASK_CHOICE = ["Weekly", "Chore", "Project"];
// const DAY_CHOICE = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];
// const TASK_TYPE = ["general", "misc", "tasks", "subtasks"];
// const WEEKLY_TASK_FOLDER = "4-Desk/Tasks/Weekly";
// const CHORE_TASK_FOLDER = "4-Desk/Tasks/Chore";
// const PROJECT_TASK_FOLDER = "4-Desk/Tasks/Project";
// const ICONS = [
//   "📚",
//   "💼",
//   "💡",
//   "🎛️",
//   "🗃️",
//   "📋",
//   "👤",
//   "📦",
//   "🎓",
//   "⚙️",
//   "📜",
//   "📝",
// ];

// async function createNote(params, update, metadata, template, title, folder) {
//   const note = `${folder}/📋 ${title}.md`;

//   // note creation
//   !(await params.app.vault.adapter.exists(note))
//     ? await params.app.vault.create(note, template)
//     : new Notice(`File ${title} already exists.`, 5e3);

//   // update meta data
//   await update("category", `${metadata["category"]}`, note);
//   await update("type", `${metadata["type"]}`, note);
//   await update("for", metadata["for"], note);

//   // open the newly created file in new pane
//   const newLeaf = params.app.workspace.getLeaf(true);
//   await newLeaf.openFile(app.vault.getAbstractFileByPath(note));
// }

// function linkify(abs_file_path) {
//   const fileNameWithExt = abs_file_path.split("/").pop();
//   const fileName = fileNameWithExt
//     .substring(0, fileNameWithExt.length - 3)
//     .trim();

//   const fileSub = ICONS.some(icon => fileName.includes(icon))
//     ? fileName.substring(fileName.indexOf(" ") + 1).trim()
//     : fileName.trim();
//   return `[[${fileName}|${fileSub}]]`;
// }

// module.exports = async params => {
//   const {
//     quickAddApi: { suggester, inputPrompt },
//   } = params;
//   const { update } = app.plugins.plugins["metaedit"].api;

//   // get selection
//   const currentLeaf = params.app.workspace.activeLeaf;
//   if (!currentLeaf || !currentLeaf.view) {
//     new Notice("No active file", 5e3);
//   }
//   const currentFile = params.app.workspace.getActiveFile();
//   const editor = currentLeaf.view.editor;
//   const selectedText = editor.getSelection();

//   // task choice
//   const taskChoice = await suggester(TASK_CHOICE, TASK_CHOICE);
//   if (!taskChoice) {
//     new Notice("No choice is given. Task creation cancel", 5e3);
//     return;
//   }

//   let title;
//   let folder;
//   let metadata = {};

//   switch (taskChoice) {
//     case "Weekly":
//       // suggester to select a day
//       const dayChoice = await suggester(DAY_CHOICE, DAY_CHOICE);

//       // if selected then add that line to file
//       const title = selectedText
//         ? selectedText
//         : await inputPrompt("Task title?");
//       if (!title) {
//         new Notice("No title is given. Task creation cancel", 5e3);
//         return;
//       }
//       const dateChoice =
//         moment().format("yyyy") +
//         "-" +
//         moment().format("MM") +
//         "-" +
//         moment(moment().day(dayChoice)).format("DD");

//       // add to current weekly task note
//       const currentWeeklyNote = `${WEEKLY_TASK_FOLDER}/📋 Tasks- Week ${moment().week()}, ${moment().year()}.md`;
//       const KTfile = app.vault.getAbstractFileByPath(currentWeeklyNote);
//       const cache = app.metadataCache.getFileCache(KTfile);
//       const targetHeading = cache.headings.find(h => h.heading === dayChoice);
//       const markdown = await app.vault.read(KTfile);

//       // write to current weekly task note
//       const newContent = markdown
//         .split("\n")
//         .map(line => {
//           if (line.startsWith("##") && line.contains(targetHeading.heading)) {
//             return `${line}\n- [ ] #task ${title} ⏳ ${dateChoice}\r`;
//           }
//           return line;
//         })
//         .join("\n");

//       await app.vault.modify(KTfile, newContent);
//       break;
//     case "Chore":
//       if (!currentLeaf || !currentLeaf.view) {
//         new Notice("No active file", 5e3);
//       }

//       // get if anything is selected

//       // reference page absolute path
//       const ref = selectedText
//         ? currentFile
//           ? linkify(currentFile.path)
//           : new Notice("No active file", 5e3)
//         : ``;

//       // note setup
//       selectedText
//         ? (title = selectedText)
//         : (title = await inputPrompt("Title for the chore ?"));

//       if (!title) {
//         new Notice("No title is given. Task creation cancel", 5e3);
//         return;
//       }
//       `Chore- 📋 ${title}`;
//       selectedText
//         ? (metadata["for"] = linkify(currentFile.path))
//         : (metadata["for"] = "");
//       metadata["category"] = "chore";
//       metadata["type"] = await suggester(TASK_TYPE, TASK_TYPE);
//       if (!metadata["type"]) {
//         new Notice("No type is choosen. Task creation cancel", 5e3);
//         return;
//       }

//       // template
//       const CHORE_TEMPLATE = `---
// fileClass:
// - tasksClass
// uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
// created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
// updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
// tags:
// - Category/Tasks
// aliases:
// - "Chore- ${title}"
// - "Chore- 📋 ${title}"
// ---
// # [[📋 ${title}|${title}]]

// > [!portal]- [[🗃️ Tasks Database|Tasks Database]]
// > ↩️ (for::)
// > 🎗️ (category::) (type::)

// `;

//       // replace the selection with links
//       selectedText ? editor.replaceSelection(`[[📋 ${title}]]`) : null;

//       // create note
//       createNote(
//         params,
//         update,
//         metadata,
//         CHORE_TEMPLATE,
//         title,
//         CHORE_TASK_FOLDER
//       );
//       break;
//     case "Project":
//       // get selection
//       // ask for task type
//       // ask for title or use selectedText
//       // create the note
//       // place the note to kanban
//       break;
//     default:
//       break;
//   }

//   // template
//   const template = `---
// fileClass:
// - tasksClass
// uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
// created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
// updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
// tags:
// - Category/Tasks
// aliases:
// - "Tasks- Week <% tp.date.now('ww, YYYY') %>"
// - "Tasks- 📋 ${title}"
// ---
//   # [[📋 ${title}|${title}]]

//   > [!portal]- [[🗃️ Tasks Database|Tasks Database]]
//   > 📆 (for::)
//   > 🎗️ (category::) (type::)

//   ## Monday

//   ## Tuesday

//   ## Wednesday

//   ## Thursday

//   ## Friday

//   ## Saturday

//   `;
// };


// IdeaMacro.js
/**
 * QuickAdd macro to create a new idea
 * @function createNote - create a new note and open the created file in new pane
 * @function linkify - get absolute path of a file from folder + fileName
 */

// TODO: reform how i will capture idea

// globals --------------------------------------------------------------------------
// const BRAINSTORM_IDEA_FOLDER_PATH = "4-Desk/Notes/Ideas/Brainstrom";
// const BLOG_IDEA_FOLDER_PATH = "4-Desk/Notes/Ideas/Blog";
// const IMPROVEMENT_IDEA_FOLDER_PATH = "4-Desk/Notes/Ideas/Improvement";
// const PROJECT_IDEA_FOLDER_PATH = "4-Desk/Notes/Ideas/Project";
// const IDEA_TYPES = ["Blog", "Brainstorm", "Improvement", "Project"];
// const BLOG_KANBAN_FILE = "5-Opr/Kanbans/🎛️ Blog Kanban.md";
// const KANBAN_LANE = "Ideation";
// const ICONS = [
//   "📚",
//   "💼",
//   "💡",
//   "🎛️",
//   "🗃️",
//   "📋",
//   "👤",
//   "📦",
//   "🎓",
//   "⚙️",
//   "📜",
//   "📝",
// ];

// /**
//  * create a new note and open the created file in new pane
//  * @param {object} params - params object comes from quickAdd api
//  * @param {function} update - update function comes from metadata api
//  * @param {object} metadata - an object containing keys for updating metadata
//  * @param {string} template - string literal for the template to use
//  * @param {string} title - get from selectedText or input
//  * @param {string} folder - global const for the folder path
//  */
// async function createNote(params, update, metadata, template, title, folder) {
//   const note = `${folder}/💡 ${title}.md`;

//   // note creation
//   !(await params.app.vault.adapter.exists(note))
//     ? await params.app.vault.create(note, template)
//     : new Notice(`File ${title} already exists.`, 5e3);

//   // update meta data
//   await update("type", `${metadata["type"]}`, note);
//   await update("waiting_period", `${metadata["waiting_period"]}`, note);
//   await update("ref", metadata["ref"], note);

//   // open the newly created file in new pane
//   const newLeaf = params.app.workspace.getLeaf(true);
//   await newLeaf.openFile(app.vault.getAbstractFileByPath(note));
// }

// /**
//  * transform the filename into a link
//  * @param {string} abs_file_path - folder + filename
//  * @returns {string} - link to the file
//  */
// function linkify(abs_file_path) {
//   const fileNameWithExt = abs_file_path.split("/").pop();
//   const fileName = fileNameWithExt
//     .substring(0, fileNameWithExt.length - 3)
//     .trim();

//   // if file has icons then exclude it
//   const fileSub = ICONS.some(icon => fileName.includes(icon))
//     ? fileName.substring(fileName.indexOf(" ") + 1).trim()
//     : fileName.trim();
//   return `[[${fileName}|${fileSub}]]`;
// }

// // -----------------------------------------------------------------------------------

// module.exports = async params => {
//   const {
//     quickAddApi: { inputPrompt, suggester, yesNoPrompt },
//   } = params;
//   const { update } = app.plugins.plugins["metaedit"].api;

//   // get selection
//   const currentLeaf = params.app.workspace.activeLeaf;
//   if (!currentLeaf || !currentLeaf.view) {
//     new Notice("No active file", 5e3);
//   }
//   const currentFile = params.app.workspace.getActiveFile();
//   const editor = currentLeaf.view.editor;
//   const selectedText = editor.getSelection();

//   // title for the idea
//   const title = selectedText
//     ? selectedText
//     : await inputPrompt("What is the idea ?");

//   if (!title) {
//     new Notice("No title is given. Idea creation cancel", 5e3);
//     return;
//   }

//   // metadata and folder
//   const metadata = {};
//   let folder;

//   // absulute path of the reference file
//   const ref = selectedText
//     ? currentFile
//       ? linkify(currentFile.path)
//       : new Notice("No active file", 5e3)
//     : (await yesNoPrompt("Reference to current page?"))
//     ? currentFile
//       ? linkify(currentFile.path)
//       : new Notice("No active file", 5e3)
//     : ``;

//   // idea type choice
//   const ideaType = await suggester(IDEA_TYPES, IDEA_TYPES);
//   if (!ideaType) {
//     new Notice("No choice selected. Idea creation cancel", 5e3);
//     return;
//   }

//   // template
//   const template = `---
// fileClass:
// - ideaClass
// uuid: <% tp.date.now("YYYYMMDDHHmmss") %>
// created: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
// updated: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ss") %>
// tags:
// - Category/Idea
// phase: Ideation
// aliases:
// - "${title}"
// - "Idea- ${title}"
// - "Idea- 💡 ${title}"
// ---
// # [[💡 ${title}|${title}]]

// > [!portal]- [[🗃️ Ideas Database|Ideas Database]]
// > - 🎗️ (type:: )
// > - ↩️  (ref:: )
// > - 📤 (applied_on::)
// > - 🔔 @ (waiting_period::)
// > - 🛩️ (maturity::)

// ## ✴ What am I thinking


// ## ⛰ Roadblocks


// ## 🖉 Notes


// `;

//   switch (ideaType) {
//     case "Blog":

//       metadata["waiting_period"] = window
//         .moment()
//         .add(6, "d")
//         .format(`"yyyy-MM-DD"`);
//       metadata["type"] = "Blog";
//       metadata["ref"] = ref;
//       folder = BLOG_IDEA_FOLDER_PATH;

//       // add to kanban
//       const ideaNote = `${folder}/💡 ${title}.md`;
//       const KTfile = app.vault.getAbstractFileByPath(BLOG_KANBAN_FILE);
//       const cache = app.metadataCache.getFileCache(KTfile);
//       const targetHeading = cache.headings.find(h => h.heading === KANBAN_LANE);
//       const markdown = await app.vault.read(KTfile);

//       // write to kanvan lane
//       const newContent = markdown
//         .split("\n")
//         .map(line => {
//           if (line.startsWith("##") && line.contains(targetHeading.heading)) {
//             return `${line}\n- [ ] ${linkify(ideaNote)}\r`;
//           }
//           return line;
//         })
//         .join("\n");

//       await app.vault.modify(KTfile, newContent);
//       break;
//     case "Brainstorm":
//       metadata["waiting_period"] = window
//         .moment()
//         .add(14, "d")
//         .format(`"yyyy-MM-DD"`);
//       metadata["type"] = "Brainstorm";
//       metadata["ref"] = ref;
//       folder = BRAINSTORM_IDEA_FOLDER_PATH;
//       break;
//     case "Improvement":
//       metadata["waiting_period"] = window
//         .moment()
//         .add(20, "d")
//         .format(`"yyyy-MM-DD"`);
//       metadata["type"] = "Improvement";
//       metadata["ref"] = ref;
//       folder = IMPROVEMENT_IDEA_FOLDER_PATH;
//       break;
//     case "Project":
//       metadata["waiting_period"] = window
//         .moment()
//         .add(3, "d")
//         .format(`"yyyy-MM-DD"`);
//       metadata["type"] = "Project";
//       metadata["ref"] = ref;
//       folder = PROJECT_IDEA_FOLDER_PATH;
//       break;
//     default:
//       break;
//   }

//   // replace selected text if exists
//   selectedText ? editor.replaceSelection(`[[💡 ${title}|${title}]]`) : null;
//   // create note
//   createNote(params, update, metadata, template, title, folder);
// };
