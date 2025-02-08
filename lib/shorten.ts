import { customAlphabet } from 'nanoid/non-secure';

const generateShortId = customAlphabet('123456789abcdefghjkmnpqrstuvwxyz', 6)

export const generateId = () => generateShortId();