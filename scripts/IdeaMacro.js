/**
 * author: ash1kh
 * This script is a macro for quickAdd to create an idea or convert a selected
 * text into idea
 */

module.exports = async params => {
  const {
    quickAddApi: { inputPrompt },
    variables: { getEditor, linkify },
  } = params;

  // ask idea title or get from selection
  const selectedText = getEditor(params).getSelection();
  const ideaTitle = selectedText
    ? selectedText
    : await inputPrompt("What is the Idea?");
  if (!ideaTitle) {
    throw new Notice("No title is given", 5e3);
  }

  // capitalize first word of title
  const idea = ideaTitle.charAt(0).toUpperCase() + ideaTitle.slice(1);

  // reference current file and populate related field
  const currentFile = params.app.workspace.getActiveFile();
  const refLink = selectedText ? await linkify(currentFile.path) : ` `;

  // replace selected text if exists with link (convert a text into idea)
  selectedText
    ? getEditor(params).replaceSelection(`[[💡 ${idea}|${idea}]]`)
    : null;

  // automatic date calculation and populate maturity filed
  const maturity = window.moment().add(20, "d").format("yyyy-MM-DD");

  params.variables = {
    idea,
    refLink,
    maturity,
  };
};
