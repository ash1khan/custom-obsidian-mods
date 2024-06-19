/**
 * author: ash1kh
 * This script is a macro for quickAdd to insert habit task line into daily note
 * task habit line will be built on the fly from gathering all habit notes
 */

module.exports = async params => {
  const {
    quickAddApi: { suggester },
    variables: { getFilteredFiles, dailyFolder, writeToFile, openFileInLeaf },
  } = params;

  // daily note for this week from today's date
  const dailyNote = `${dailyFolder}/${moment().format("YYYY-MM-DD")}.md`;
  if (!(await params.app.vault.adapter.exists(dailyNote))) {
    throw new Notice(`File ${dailyNote} doesn't exist.`, 5e3);
  }

  // basename of all the files that contains the specified tags
  const { filesName, filesFrontmatter } = await getFilteredFiles(
    params,
    "Object/Effort/Habit",
    "tags"
  );

  // construct display name for selection
  const displayCategories = filesName.map(f => {
    return (
      filesFrontmatter.filter(fm => fm.aliases[0] === f)[0].ticker + " " + f
    );
  });

  // ask for category or get from selections
  const selectedCategory = await suggester(displayCategories, filesName);
  if (!selectedCategory) {
    throw new Notice("No category is selected", 5e3);
  }

  const selectedFileFrontmatter = filesFrontmatter.filter(
    f => f.aliases[0] === selectedCategory
  )[0];

  // construct the line on selected file (file.frontmatter.ticker, file.frontmatter.line)
  const habitText = `- [ ] #habit ${selectedFileFrontmatter.ticker} ${selectedFileFrontmatter.line}`;

  // write to appropriate section of daily note
  await writeToFile(app, dailyNote, "##", "🚴 Daily Habits", habitText);

  // open daily note if not already open
  await openFileInLeaf(app, dailyNote, `${moment().format("YYYY-MM-DD")}`);
};
