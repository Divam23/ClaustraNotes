import { DecodedIdToken } from 'firebase-admin/auth';
import User from '@/modules/users/models/users.model';
import { fullNameToFirstNameAndLastName } from '@/shared/helpers/fullNameSplitter.helper';
import { generateDefaultUserName } from '@/shared/helpers/generateDefaultUsername.helper';
import { ApiError } from '@/shared/utils/ApiError';

const findOrCreateUser = async (decodedUser: DecodedIdToken) => {
    let user = await User.findOne({
        firebaseUid: decodedUser.uid,
    });
    if (!user) {
        const { firstName, lastName } = fullNameToFirstNameAndLastName(decodedUser.name || '');
        let generartedUsername = generateDefaultUserName(firstName);

        let existingUsername = await User.findOne({ userName: generartedUsername }).lean();

        //check until unique username is found
        while (existingUsername) {
            generartedUsername = generateDefaultUserName(firstName);

            existingUsername = await User.findOne({ userName: generartedUsername }).lean();
        }
        if (!decodedUser.email) {
            throw new ApiError(404, 'Email not found in token');
        }

        user = await User.create({
            firebaseUid: decodedUser.uid,
            email: decodedUser.email || '',
            firstName: firstName,
            lastName: lastName,
            userName: generartedUsername,
            avatar: {
                url: decodedUser.picture || '',
                storagePath: '',
            },
        });
    }
    return user;
};

const getCurrentUser = async (decodedUser: DecodedIdToken) => {
    const user = await User.findOne({
        firebaseUid: decodedUser.uid,
    });

    return user;
};

export { findOrCreateUser, getCurrentUser };
