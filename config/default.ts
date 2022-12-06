export default {
    port: 8000,
    accessTokenExpiresIn: 15,   //TOOD how does this tie in with EX set on redis? Can we have SST on this?
    refreshTokenExpiresIn: 59,
    origin: 'http://localhost:8080'
}