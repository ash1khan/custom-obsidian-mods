// TODO: redo all the callout system

// list out all the callout available

// determine selection

// if no selection then create one
// give the choice of callout types and fold or unfold
// any title
// default content

// else selected with no callout
// repeat the creation process but replace the content with selection

// else selected with callout
// remove the callout

// global variables ------------------------------------------------------------------
const CALLOUT_CHOICE = [
  "Note",
  "Abstract / Summery / Tldr",
  "Info",
  "Todo",
  "Tip / Hint / Important",
  "Success / Check / Done",
  "Question / Help / Faq",
  "Warning / Caution / Attention",
  "Failure / Fail / Missing",
  "Danger / Error",
  "Bug",
  "Example",
  "Quote / Cite",
];

const CALLOUT_EXPAND_CHOICE = ["Folded", "Not Folded"];
// -----------------------------------------------------------------------------------

module.exports = async params => {
  const {
    quickAddApi: { suggester, inputPrompt },
  } = params;

  // get active leaf
  const currentLeaf = params.app.workspace.activeLeaf;
  if (!currentLeaf || !currentLeaf.view) {
    new Notice("No active file", 5e3);
    return;
  }

  // get editor and current cursor position
  const editor = currentLeaf.view.editor;
  const cursorPos = editor.getCursor();

  // get if anything is selected
  const selectedText = editor.getSelection();

  // quickAdd related blocks ----------------------------------------------------------

  let calloutName = "";

  // callout selection
  const selectedCallout = await suggester(CALLOUT_CHOICE, CALLOUT_CHOICE);
  if (!selectedCallout) {
    new Notice("Callout creation cancel", 5e3);
    return;
  }
  calloutName = selectedCallout;

  // additional variant selection if available
  if (selectedCallout.includes(" ")) {
    const calloutVariant = await suggester(
      selectedCallout.split("/"),
      selectedCallout.split("/")
    );
    if (!calloutVariant) {
      new Notice("Callout creation cancel", 5e3);
      return;
    }
    calloutName = calloutVariant;
  }

  // mode selection
  const selectedMode = await suggester(
    CALLOUT_EXPAND_CHOICE,
    CALLOUT_EXPAND_CHOICE
  );
  if (!selectedMode) {
    new Notice("Callout creation cancel", 5e3);
    return;
  }
  const mode = selectedMode === "Folded" ? "-" : "";

  // title for the input
  const title = "";
  const calloutTitle = selectedText
    ? (title = selectedText)
    : (title = await inputPrompt("Callout headline (Optional) ?"));

  if (!title) {
    new Notice("No title is provided", 5e3);
    return;
  }
  // ----------------------------------------------------------------------------------

  // template
  const t = `
>[!${calloutName.toLowerCase().trim()}]${mode} ${calloutTitle}
> 
`;

  // Insert template with a new line from the current cursor position
  editor.replaceSelection(`\n${t}`);

  // Set the cursor position inside the template
  const newCursorPos = { line: cursorPos.line + 3, ch: 2 };

  // if any text is selected replace them inside the template
  selectedText
    ? editor.replaceRange(selectedText, newCursorPos)
    : editor.setCursor(newCursorPos);
};
