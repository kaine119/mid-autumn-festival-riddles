var domain = process.env.DOMAIN || "http://localhost:3000"

module.exports = {
	clientID: process.env.OAUTH_CLIENTID,
	clientSecret: process.env.OAUTH_CLIENTSECRET,
	callbackURL: domain + "/auth/google/callback"
}
