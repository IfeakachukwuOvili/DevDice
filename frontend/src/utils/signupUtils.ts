export const passwordRequirements = [
  {
    text: 'At least 8 characters',
    regex: /^.{8,}$/,
  },
  {
    text: 'At least one uppercase letter',
    regex: /[A-Z]/,
  },
  {
    text: 'At least one lowercase letter',
    regex: /[a-z]/,
  },
  {
    text: 'At least one number',
    regex: /[0-9]/,
  },
  {
    text: 'At least one special character (!@#$%^&*)',
    regex: /[!@#$%^&*]/,
  },
];