export const generateVerificationToken = (req) => {
    let user = req.user;

    const verificationToken = jwt.sign(
        { id: user.dataValues.id, email: user.dataValues.email },
        process.env.VERIFICATION_TOKEN,
        { expiresIn: "7d" }
    );
    user.verificationToken = verificationToken

    return verificationToken;
};