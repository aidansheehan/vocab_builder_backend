export default {
    port: 8000,
    accessTokenExpiresIn: 20,       //minutes until accessToken expiry TODO how does this tie in with EX set on redis? Can we have SST on this?
    refreshTokenExpiresIn: 43200,   //minutes until refreshToken expiry
    origin: [ 'https://dictaglot.com', 'https://vocab-builder-framework.vercel.app', 'http://localhost:8080' ]
}