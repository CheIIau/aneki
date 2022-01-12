export function changeTheme() {
  this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  if (this.$vuetify.theme.dark === true) {
    localStorage.setItem('darkTheme', true);
    return;
  }
  localStorage.setItem('darkTheme', false);
}
