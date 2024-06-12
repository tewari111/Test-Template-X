// ----------------------------------------------------------------------
const email = localStorage.getItem('email');

const account = {
  displayName: '',
  photoURL: '/assets/images/avatars/avatar_25.jpg',
};

if (email) {
  // Extract the part before the "@" symbol
  const usernamePart = email.split('@')[0];

  // Extract the part before the first "." if it exists
  const username = usernamePart.split('.')[0];

  account.displayName = username || '';
}

export { account };
