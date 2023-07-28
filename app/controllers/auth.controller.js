const jwt = require("jsonwebtoken");
const models = require("../models");
const argon2 = require("argon2");
const {errorHandler, withTransaction} = require("../util");
const {HttpError} = require("../error");

// create account
const signup = errorHandler(withTransaction(async (req, res, session) => {
    const userDoc = models.User({
        username: req.body.username,
        // user argon2 to encode pass, then use argon2.verfy to decode it
        password: await argon2.hash(req.body.password),
        // for normal signup, user permission will be 1, for admin, it will be 0
        permission: req.body.permission === undefined ? 1 : 0
    });
    const refreshTokenDoc = models.RefreshToken({
        owner: userDoc.id,
        permission: userDoc.permission
    });

    await userDoc.save({session});
    await refreshTokenDoc.save({session});

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id, userDoc.permission);
    const accessToken = createAccessToken(userDoc.id);

    return {
        id: userDoc.id,
        accessToken,
        refreshToken,
        permission: userDoc.permission
    };
}));

const login = errorHandler(withTransaction(async (req, res, session) => {
    const userDoc = await models.User
        .findOne({username: req.body.username})
        .select('+password')
        .exec();
    if (!userDoc) {
        throw new HttpError(401, 'Wrong username or password');
    }
    await verifyPassword(userDoc.password, req.body.password);

    const refreshTokenDoc = models.RefreshToken({
        owner: userDoc.id,
        permission: userDoc.permission
    });

    await refreshTokenDoc.save({session});

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id, userDoc.permission);
    const accessToken = createAccessToken(userDoc.id);

    return {
        id: userDoc.id,
        accessToken,
        refreshToken,
        permission: userDoc.permission
    };
}));

const newRefreshToken = errorHandler(withTransaction(async (req, res, session) => {
    const currentRefreshToken = await validateRefreshToken(req.body.refreshToken);
    const refreshTokenDoc = models.RefreshToken({
        owner: currentRefreshToken.userId,
        permission: currentRefreshToken.permission
    });

    await refreshTokenDoc.save({session});
    await models.RefreshToken.deleteOne({_id: currentRefreshToken.tokenId}, {session});

    const refreshToken = createRefreshToken(currentRefreshToken.userId, refreshTokenDoc.id, refreshTokenDoc.permission);
    const accessToken = createAccessToken(currentRefreshToken.userId);

    return {
        id: currentRefreshToken.userId,
        accessToken,
        refreshToken
    };
}));

const newAccessToken = errorHandler(async (req, res) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    const accessToken = createAccessToken(refreshToken.userId);

    return {
        id: refreshToken.userId,
        accessToken,
        refreshToken: req.body.refreshToken
    };
});

const logout = errorHandler(withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await models.RefreshToken.deleteOne({_id: refreshToken.tokenId}, {session});
    return {success: true};
}));

const logoutAll = errorHandler(withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await models.RefreshToken.deleteMany({owner: refreshToken.userId}, {session});
    return {success: true};
}));

function createAccessToken(userId) {
    return jwt.sign({
        userId: userId
    }, process.env.ACCESS_TOKEN_SECRET, {
       expiresIn: '10m'
    });
}

function createRefreshToken(userId, refreshTokenId, permission) {
    return jwt.sign({
        userId: userId,
        tokenId: refreshTokenId,
        permission: permission
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d'
    });
}

const verifyPassword = async (hashedPassword, rawPassword) => {
    if (await argon2.verify(hashedPassword, rawPassword)) {
        // password matches
    } else {
        throw new HttpError(401, 'Wrong username or password');
    }
};

const validateRefreshToken = async (token) => {
    const decodeToken = () => {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch(err) {
            // err
            throw new HttpError(401, 'Unauthorised');
        }
    }

    const decodedToken = decodeToken();
    const tokenExists = await models.RefreshToken.exists({_id: decodedToken.tokenId, owner: decodedToken.userId});
    if (tokenExists) {
        return decodedToken;
    } else {
        throw new HttpError(401, 'Unauthorised');
    }
};

module.exports = {
    signup,
    login,
    newRefreshToken,
    newAccessToken,
    logout,
    logoutAll
};