function createUserSession(user) {
    const userSessionObj = {
        _id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar ? user.avatar : "",
        subspacesJoined: user.subspacesJoined,
    };
    return userSessionObj;
}

export { createUserSession };