import jwt, { SignOptions } from 'jsonwebtoken';
import config               from 'config';

/**
 * Utility functions for handling signing and verifiying JWTs
 */

//Function to sign a Jason Web Token
export const signJwt = (payload: Object, options: SignOptions = {}) => {

    //Convert base 64 private key to ASCII string
    const privateKey = Buffer.from(
        config.get<string>('accessTokenPrivateKey'),
        'base64'
    ).toString('ascii');

    //Sign JWT
    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
};

// Generic function to verify a Jason Web token - returns null if token invalid or expired
export const verifyJwt = <T>(token: string): T | null => {

    try {

        //Convert base 64 public key to ASCII string
        const publicKey = Buffer.from(
            config.get<string>('accessTokenPublicKey'),
            'base64'
        ).toString('ascii');

        //Verify JWT
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        console.log('error: ', error);
        return null;
    }
};