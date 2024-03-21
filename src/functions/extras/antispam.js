const usedCommand = new Set();

const isSpam = (sender) => !!usedCommand.has(sender);

const addFilter = (sender) => {
  usedCommand.add(sender);
  setTimeout(() => usedCommand.delete(sender), 5000);
};

module.exports = {
  usedCommand,
  isSpam,
  addFilter,
};
