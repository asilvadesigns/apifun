const _generalMessage = (res, code, message) => {
  return res.status(code).json(message);
}

module.exports = {
  generalMessage: _generalMessage
}