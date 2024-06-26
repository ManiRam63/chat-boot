export const ResponseMessage = {
    AUTH: {
        LOGIN_SUCCESSFULLY: 'login successfully',
        REGISTRATION_SUCCESSFULLY: 'registration successfully',
        USER_ALREADY_EXIST: 'User already exist',
        USER_NOT_FOUND: 'User not found',
        INVALID_CREDENTIALS: 'Invalid credentials',
        INVALID_TOKEN: 'Invalid token',
        PASSWORD_REQUIRED: 'Password required',
        PASSWORD_MISMATCH: 'Password mismatch',
        SOME_ERROR_OCCURRED: 'Some error occurred',
        JWT_SECRET_KEY_NOT_FOUND: 'JWT secret key not found.'
    },
    USER: {
        USER_CREATED_SUCCESSFULLY: 'User created successfully',
        USER_UPDATED_SUCCESSFULLY: 'User updated successfully',
        USER_DELETED_SUCCESSFULLY: 'User deleted successfully',
        USER_FETCH_SUCCESSFULLY: ' User fetched successfully',
        USER_NOT_FOUND: 'User not found',
        SOME_ERROR_OCCURRED: 'Some error occurred',
        SOME_ERROR_OCCURRED_WHILE_CREATING_USER:
            'Some error occurred while creating user',
        SOME_ERROR_OCCURRED_ON_DELETING_USER:
            'Some error occurred while deleting the user',
        SOME_ERROR_OCCURRED_ON_UPDATING_USER:
            ' Some error occurred while updating the user ',
        USER_ID_REQUIRED: 'User ID required',
        DUPLICATE_EMAIL: 'Email is already exist',
        REQUIRED_PAYLOAD: 'Empty payload !',
        INVALID_ID: 'Invalid Id',
        USERNAME_ALREADY_EXIST: 'User name already exist!',
        OLD_PASSWORD_NOT_MATCHED: 'Old Password not matched.',
        PASSWORD_UPDATED_SUCCESSFULLY: 'Password updated successfully'
    },
    ROOM: {
        ROOM_CREATED_SUCCESSFULLY: 'Room created successfully',
        ROOM_UPDATED_SUCCESSFULLY: 'Room updated successfully',
        ROOM_DELETED_SUCCESSFULLY: 'Room deleted successfully',
        ROOM_FETCH_SUCCESSFULLY: 'Room fetch successfully ',
        ROOM_NOT_FOUND: 'Room not found',
        SOME_ERROR_OCCURRED: 'Some error occurred',
        ROOM_USER_ADDED_PARTIALLY: 'Room users added partially successfully.',
        ROOM_USER_ADDED_SUCCESSFULLY: 'Room users added successfully.',
        ROOM_AND_USER_COMBINATION: 'UserId and roomId combination not found',
        ROOM_ID_REQUIRED: ' Room id required',
        ROOM_USER_DELETED_SUCCESSFULLY: 'Room user deleted successfully',
        SOMETHING_WENT_WRONG: 'Something went wrong please try again',
        ROOM_NAME_ALREADY_EXIST: 'Room name already exist!',
        ROOM_JOINED_SUCCESSFULLY: 'User has Joined the room'
    },
    CHAT: {
        CHAT_CREATED_SUCCESSFULLY: 'Chat created successfully',
        CHAT_UPDATED_SUCCESSFULLY: 'Chat updated successfully',
        CHAT_DELETED_SUCCESSFULLY: 'Chat deleted successfully',
        CHAT_NOT_FOUND: 'Chat not found',
        SOME_ERROR_OCCURRED: ' Some error occurred',
        CHAT_FETCH_SUCCESSFULLY: ' Chat fetch successfully.',
        SOME_ERROR_OCCURRED_ON_CREATING_CHAT:
            ' Some error occurred while creating chat message '
    }
};
