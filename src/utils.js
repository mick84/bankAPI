import { readFileSync, writeFileSync } from "fs";
import uniqid from "uniqid";

const PATHS = {
  USERS: "./src/db/users.json",
  ACCOUNTS: "./src/db/accounts.json",
  TRANSACTIONS: "./src/db/transactions.json",
};
const getData = (dataPath) => {
  try {
    return JSON.parse(readFileSync(dataPath).toString());
  } catch (error) {
    throw new Error(error);
  }
};
const saveData = (filepath, data) => {
  try {
    writeFileSync(filepath, JSON.stringify(data));
  } catch (error) {
    throw new Error(error);
  }
};
const saveUsers = saveData.bind(null, PATHS.USERS);
const saveAccounts = saveData.bind(null, PATHS.ACCOUNTS);
const saveTransactions = saveData.bind(null, PATHS.TRANSACTIONS);
export const getUsers = getData.bind(null, PATHS.USERS);
export const getAccounts = getData.bind(null, PATHS.ACCOUNTS);
export const getTransactions = getData.bind(null, PATHS.TRANSACTIONS);
export const getUser = (id) => {
  try {
    const users = getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new Error(`user with id ${id} does not exist`);
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};
export const addUser = (userData) => {
  const allowedDataFields = ["passportID", "fullName"];
  try {
    const users = getUsers();
    const existingIndex = users.findIndex(
      (user) => user.passportID === userData.passportID
    );
    if (existingIndex !== -1) {
      throw new Error(
        `User with passport ID ${userData.passportID} already exists!`
      );
    }
    if (allowedDataFields.some((field) => !(field in userData))) {
      throw new Error(`Some of required user data was  not provided!`);
    }
    if (Object.keys(userData).some((k) => !allowedDataFields.includes(k))) {
      throw new Error(
        `Some fields of user data are unnecessary!
         In order to create a new user, provide data in exact needed format.`
      );
    }
    const user = { id: uniqid(), accountIDs: [], ...userData };
    saveUsers(users.concat(user));
    return user;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateUser = (id, data) => {
  try {
    const users = getUsers();
    let indexToUpdate = users.findIndex((user) => user.id === id);
    if (indexToUpdate === -1) {
      throw new Error("no user to update");
    }
    users[indexToUpdate] = { ...users[indexToUpdate], ...data };
    saveUsers(users);
    return users[indexToUpdate];
  } catch (error) {
    throw new Error(error);
  }
};
export const deleteUser = (id) => {
  try {
    const users = getUsers();
    const indexToDelete = users.findIndex((user) => user.id === id);
    if (indexToDelete === -1) {
      throw new Error(`User with ID ${id} does not exist`);
    }
    const userToDelete = users[indexToDelete];
    userToDelete.accountIDs.forEach(deleteAccount);
    users.splice(indexToDelete, 1);
    saveUsers(users);
    return userToDelete;
  } catch (error) {
    throw new Error(error);
  }
};
export const getAccount = (id) => {
  try {
    const accounts = getAccounts();
    const result = accounts.find((ac) => ac.id === id);
    if (!result) {
      throw new Error(`Account with id ${id} does not exist!`);
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const getUserAccounts = (userID) => {
  try {
    const accounts = getAccounts();
    const userAccounts = accounts.filter((ac) => ac.ownerPassportID === userID);
    if (!userAccounts) {
      throw new Error(`User does not have an accountIDs field!`);
    }
    return userAccounts;
  } catch (error) {
    throw new Error(error);
  }
};
export const createAccount = (passportID, accountData) => {
  const allowedDataFields = ["cash", "credit", "availableCredit"];
  try {
    const users = getUsers();
    const currentUserIndex = users.findIndex(
      (user) => user.passportID === passportID
    );
    if (currentUserIndex === -1) {
      throw new Error(`User with passport ID ${passportID} does not exist!`);
    }
    if (
      Object.keys(accountData).some(
        (field) => !allowedDataFields.includes(field)
      )
    ) {
      throw new Error(
        `Account data must contain only ${allowedDataFields.join(
          ", "
        )}, and nothing more!`
      );
    }
    const newAccountID = uniqid();
    users[currentUserIndex].accountIDs.push(newAccountID);
    saveUsers(users);
    const accounts = getAccounts();
    const newAccount = {
      id: newAccountID,
      ownerPassportID: users[currentUserIndex].passportID,
      cash: 0,
      credit: 0,
      availableCredit: 0,
      ...accountData,
    };
    saveAccounts(accounts.concat(newAccount));
    return newAccount;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateAccount = (accountID, data) => {
  try {
    const accounts = getAccounts();
    const indexToUpdate = accounts.findIndex((ac) => ac.id === accountID);
    if (indexToUpdate === -1) {
      throw new Error(`Account with id ${accountID} does not exist!`);
    }
    accounts[indexToUpdate] = { ...accounts[indexToUpdate], ...data };
    saveAccounts(accounts);
    return accounts[indexToUpdate];
  } catch (error) {
    throw new Error(error);
  }
};
export const deleteAccount = (accountID) => {
  try {
    const accounts = getAccounts();
    const indexToDelete = accounts.findIndex((ac) => ac.id === accountID);
    if (indexToDelete === -1) {
      throw new Error(`Account with id ${accountID} does not exist!`);
    }
    const [deletedAccount] = accounts.splice(indexToDelete, 1);
    saveAccounts(accounts);
    const users = getUsers();
    const userIndex = users.findIndex(
      (user) => user.passportID === deletedAccount.ownerPassportID
    );
    if (userIndex === -1) {
      throw new Error(
        `failed to find user with passport ID ${deletedAccount.ownerPassportID} for deleting his account #${accountID}`
      );
    }
    const accountIndex = users[userIndex].accountIDs.indexOf(accountID);
    users[userIndex].accountIDs.splice(accountIndex, 1);
    saveUsers(users);

    return deletedAccount;
  } catch (error) {
    throw new Error(error);
  }
};
export const addTransaction = (transaction) => {
  try {
    const transactions = getTransactions();
    saveTransactions(transactions.concat(transaction));
  } catch (error) {
    throw new Error(error);
  }
};
export const findUserByAccountID = (accountID) => {
  try {
    const users = getUsers();
    const userToFind = users.find((user) =>
      user.accountIDs.includes(accountID)
    );
    if (!userToFind) {
      throw new Error(`User with account #${accountID} does not exist!`);
    }
    return userToFind;
  } catch (error) {
    throw new Error(error);
  }
};
