/**
 * useStorageUser hook
 * Retrieves user data from localStorage
 */

import { storage } from '../utils/localStorage';

export const useStorageUser = () => {
    return storage.getUser();
};

export default useStorageUser;
