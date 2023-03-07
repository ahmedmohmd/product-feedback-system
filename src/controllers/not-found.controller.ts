const notFound = (_, res) => {
  res.status(404).send("Sorry, this page does not exist!");
};

export default notFound;
