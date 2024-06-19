/**
 * This script is a macro for quickAdd to insert a task
 * into current weekly note based on current day.
 * author: ash1kh
 */

module.exports = async params => {
  const {
    quickAddApi: { inputPrompt },
    variables: { getEditor, openFileInLeaf, writeToFile, weeklyFolder },
  } = params;

  // weekly note for this week from today's date
  const weeklyNote = `${weeklyFolder}/${moment().year()}-W${moment().format(
    "WW"
  )}.md`;
  if (!(await params.app.vault.adapter.exists(weeklyNote))) {
    throw new Notice(`File ${weeklyNote} doesn't exist.`, 5e3);
  }

  // ask for title or get from selections
  const selectedText = getEditor(params).getSelection();
  const taskTitle = selectedText
    ? selectedText
    : await inputPrompt("What is the task ?");
  if (!taskTitle) {
    throw new Notice("No title is given", 5e3);
  }
  // write to appropriate section of weekly note
  writeToFile(
    app,
    weeklyNote,
    "###",
    moment().format("dddd"),
    `- [ ] #task ${taskTitle} ⏳ ${moment().format("YYYY-MM-DD")}`
  );

  // open weekly note if not already open
  await openFileInLeaf(
    app,
    weeklyNote,
    `${moment().year()}-W${moment().week()}`
  );
};
