module.exports.SuccessRes = (message, data) => {
  return {
    message,
    status: "Success",
    data,
  };
};

module.exports.ErrorRes = (message, error) => {
  return {
    message,
    status: "Failed",
    error,
  };
};
