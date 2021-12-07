const auth = (req, res, next) => {
  //   let origin = req.get("origin");
  //   if (origin != "https://api.cleverkitties.io")
  //     return res.json({
  //       status: false,
  //       data: "api call from invalid origin",
  //     });
  //   else next();
  next();
};

module.exports = auth;
