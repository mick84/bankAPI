import { updateAccount, getAccount, getAccounts } from "./utils.js";

/**
 * @param {string} accountID
 * @param {number} amount
 */
export const deposit = (accountID, amount) => {
  try {
    if (amount <= 0) {
      throw new Error("invalid amount to deposit. Must be positive number");
    }
    const account = getAccount(accountID);
    const data = { cash: account.cash + amount };

    return updateAccount(accountID, data);
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @param {string} accountID
 * @param {number} amount
 * @returns
 */
export const withdraw = (accountID, amount) => {
  try {
    if (amount <= 0) {
      throw new Error("invalid amount to withdraw. Must be positive number");
    }
    const account = getAccount(accountID);
    const maxWD = account.cash + account.credit;
    if (maxWD < amount) {
      throw new Error(
        `Operation impossible. Maximal withdraw amount possible is ${maxWD}`
      );
    }
    const data = { cash: account.cash - amount };
    return updateAccount(accountID, data);
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @param {[string,string]} accountIDsArr
 * @param {number} amount
 */
export const transfer = (accountIDsArr, amount) => {
  try {
    if (amount <= 0) {
      throw new Error(`Transfer amount must be positive number`);
    }
    const accounts = getAccounts().filter((ac) =>
      accountIDsArr.includes(ac.id)
    );
    const sender = accounts.find((ac) => ac.id === accountIDsArr[0]);
    const receiver = accounts.find((ac) => ac.id === accountIDsArr[1]);
    const maxSenderAmount = sender.cash + sender.availableCredit;
    if (amount > maxSenderAmount) {
      throw new Error(`Maximal amount to transfer is ${maxSenderAmount}`);
    }
    const creditChange = Math.max(amount - sender.cash, 0);
    const senderData = creditChange
      ? { cash: 0, availableCredit: sender.availableCredit - creditChange }
      : { cash: sender.cash - amount };
    const receiverData = { cash: receiver.cash + amount };
    const updatedSender = updateAccount(sender.id, senderData);
    const updatedReceiver = updateAccount(receiver.id, receiverData);
    return {
      updatedSender,
      updatedReceiver,
    };
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * @param {string} accountID
 * @param {number} amount
 */
export const freeCredit = (accountID, amount) => {
  try {
    if (amount < 0) {
      throw new Error("Invalid amount to free. Must be positive number.");
    }
    const account = getAccount(accountID);
    //this is maximal credit to free:
    const spentCredit = account.credit - account.availableCredit;
    if (spentCredit === 0) {
      throw new Error("Operation cancelled. The credit limit is free");
    }
    /*//client condition:
    if(amount>account.cash){
        throw new Error(`The account balance is $${account.cash}. Unable to free more than this`);
    }
    */
    if (amount > spentCredit) {
      throw new Error(`Maximal amount to free is $${spentCredit}`);
    }
    const data = { availableCredit: account.availableCredit + amount };
    return updateAccount(accountID, data);
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * @param {string} accountID
 * @param {number} newMaxCredit
 */
export const changeCreditLimit = (accountID, newMaxCredit) => {
  try {
    if (newMaxCredit < 0) {
      throw new Error(" Operation failed. Credit limit must be non-negative.");
    }
    const account = getAccount(accountID);
    const spentCredit = account.credit - account.availableCredit;
    if (spentCredit > newMaxCredit) {
      throw new Error(
        `Operation cancelled. The new max credit must be bigger than ${spentCredit}`
      );
    }
    return updateAccount(accountID, {
      credit: newMaxCredit,
      availableCredit: newMaxCredit - spentCredit,
    });
  } catch (error) {
    throw new Error(error);
  }
};
