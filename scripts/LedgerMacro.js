/**
 * This script is a macro for quickAdd to insert a hledger
 * transaction.
 * author: ash1kh
 */

// constants for hledger
const DEFAULT_COMMODITY = "BDT";
const HLEDGER_FOLDER = "Atlas/Finance";
const HLEDGER_ACCOUNT_FILE = "accounts.md";
const HLEDGER_ACCOUNT_FILE_PATH = HLEDGER_FOLDER + "/" + HLEDGER_ACCOUNT_FILE;

// used for formatting transaction line
const DEFAULT_TX_LINE_WITH = 70;

module.exports = async (params) => {
  const {
    quickAddApi: { inputPrompt, yesNoPrompt },
    variables: { getHledgerAccounts },
  } = params;

  // get all the accounts list
  let account_data_list = [];
  await getHledgerAccounts(params, HLEDGER_ACCOUNT_FILE_PATH).then((data) => {
    account_data_list = data;
  });

  // get current date
  const current_date = moment().format("YYYY-MM-DD");
  // get description and prompt input
  const description = await inputPrompt("Description of the TX");
  if (description === undefined || description.length === 0) {
    throw new Notice("No description is given !", 5e3);
  }
  // TODO: get amount and reformat it or convert if needed
  const amount = await inputPrompt("Amounts (Number)");
  if (amount === undefined || amount === NaN || amount === 0) {
    throw new Notice("Invalid Amounts !", 5e3);
  }
  // TODO: prompts accounts to pay to
  // TODO: prompts accounts from where to pay
  // TODO: prompts commodity
  // TODO: write to hledger files
  // TODO: ask to add another iteration or finish
  console.log(description);
};
