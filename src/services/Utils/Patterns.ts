export const Patterns = {
  email: /^$|^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i,
  // number only regex
  numbers: /^\d+$/,
  // password requires minimum of 7 characters and 1 number
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]*$/,
  username: /^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![_\s-]{5,}.*)$/,
}
