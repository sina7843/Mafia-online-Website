const ac = {};

ac.routeController = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.Role)) return next();
        else return res.status(403).send('Forbidden');
    }
}

module.exports = ac;