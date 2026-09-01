import { IUser } from '@/modules/users/types/user.types';
export const mappedAuthenticatedUser = ({user}:{user:IUser
    
})=>({
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userName: user.userName,
    avatar: user.avatar,
    bio: user.bio,
    college: user.college,
    course: user.course,
    subjects: user.subjects,
    university: user.university,
    semester: user.semester,
    verificationStatus: user.verificationStatus,
    roles: user.roles,
    preferences: user.preferences,
    stats: user.stats,
    createdAt: user.createdAt,
    lastUpdatedAt:user.updatedAt
});