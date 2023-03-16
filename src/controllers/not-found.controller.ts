const notFound = (_, response) => {
  response.status(404).send("Sorry, this page does not exist!");
};

export default notFound;
