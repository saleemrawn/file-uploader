const getStatusCode = (err) => {
  if (err.code === "P2002") return 409;
  return Number(err.statusCode) || err.status || 500;
};

const getErrorMessage = (err) => {
  if (err.code === "ENOENT") return "No such file or directory";
  if (err.code === "P2002") {
    const field = err.meta?.modelName ?? "field";
    return `A record with that ${field} already exists`;
  }

  return err.message || "Oops, something went wrong";
};

const errorController = (err, req, res, next) => {
  console.error(err);

  const statusCode = getStatusCode(err);
  const message = getErrorMessage(err);

  res.status(statusCode).render("customError", {
    title: `${statusCode} | ${message}`,
    error: { statusCode, message },
  });
};
module.exports = errorController;
