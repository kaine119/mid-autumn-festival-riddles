var domain = process.env.DOMAIN || "localhost:3000"

module.exports = {
	clientID: "888665451730-237678ts3vp6g648hjpr1ml9io7oaucl.apps.googleusercontent.com",
	clientSecret: "Tz71J63i0noLVSumyDFw1ZmK",
	callbackURL: "http://" + domain + "/auth/google/callback"
}