import { omit, get }                    from 'lodash';
import { FilterQuery, QueryOptions }    from 'mongoose';
import config                           from 'config';
import userModel, { User }              from '../models/user.model';
import { excludedFields }               from '../controllers/auth.controller';
import { signJwt }                      from '../helpers/jwt';
import redisClient                      from '../helpers/connectRedis';
import { DocumentType }                 from '@typegoose/typegoose';

/**
 * Service for communicating with the database
 */

// CreateUser service
export const createUser = async (input: Partial<User>) => {
    const user = await userModel.create(input);
    return omit(user.toJSON(), excludedFields);
};

// Find User by Id
export const findUserById = async (id: string) => {
    const user = await userModel.findById(id).lean();
    return omit(user, excludedFields);
};

// Find all users
export const findAllUsers = async () => {
    return await userModel.find();
};

// Find one user by any fields
export const findUser = async (
    query: FilterQuery<User>,
    options: QueryOptions = {}
) => {
    return await userModel.findOne(query, {}, options).select('+password');
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {

    //Sign the access token //not sure if need to convert user id to string?
    const accessToken = signJwt(
        { sub: user._id },
        {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        }
    );
    
    //Create a session with expiry time 60 * 60s = 1 hour
    redisClient.setEx(user._id.toString(), 60 * 60, JSON.stringify(user));

    //Return access token
    return { accessToken };
}