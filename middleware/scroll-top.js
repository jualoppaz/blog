export default () => {
  if (!process.server) {
    window.document.getElementById('main').scrollTop = 0;
  }
};
