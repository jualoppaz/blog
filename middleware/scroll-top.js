export default () => {
  if (!process.server) {
    const main = window.document.getElementById('main');
    if (main) main.scrollTop = 0;
  }
};
