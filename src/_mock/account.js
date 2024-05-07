// ----------------------------------------------------------------------
const username = localStorage.getItem('username');
export const account = {
  displayName: username || '',
  // email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatars/avatar_25.jpg',
};
