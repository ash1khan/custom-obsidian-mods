/**
 * This script is a macro for quickAdd to add a shopping item
 * into quick add heading of any selected shopping note.
 * author: ash1kh
 */

module.exports = async params => {
  const {
    quickAddApi: { inputPrompt, suggester },
    variables: { getEditor, openFileInLeaf, writeToFile, filterFiles },
  } = params;

  // ask shopping item name
  const selectedText = getEditor(params).getSelection();
  const shoppingTitle = selectedText
    ? selectedText
    : await inputPrompt("What is the shopping item?");
  if (!shoppingTitle) {
    throw new Notice("No title is given", 5e3);
  }
  const estimatePrice = await inputPrompt("Price? (Number)");
  if (!estimatePrice) {
    throw new Notice("No Price is given", 5e3);
  }
  // shopping category selection
  const categories = [
    "Groceries",
    "Equipments",
    "Computer",
    "Clothing",
    "Furniture",
  ];
  const selectedCategory = await suggester(categories, categories);
  if (!selectedCategory) {
    throw new Notice("No category is selected", 5e3);
  }
  const filteredFileNames = await filterFiles(params, selectedCategory);

  const selectedFile = await suggester(filteredFileNames, filteredFileNames);
  if (!selectedFile) {
    throw new Notice("No file is selected", 5e3);
  }

  const file = `Calendar/Shopping/${selectedFile}.md`;

  // TODO: add more according to other formats of the shopping categories

  category = {
    Groceries: `- [ ] ${shoppingTitle}`,
    Computer: `- [ ] \$ ${estimatePrice}\n\t- **Item**: ${shoppingTitle} \n\t- Link: \n`,
  };

  await writeToFile(app, file, "##", "Items", category[selectedCategory]);
  await openFileInLeaf(app, file, selectedFile);
};
