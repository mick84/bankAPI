export const changeInput = (event, setState) => {
  setState((st) => ({ ...st, [event.target.name]: event.target.value }));
};
