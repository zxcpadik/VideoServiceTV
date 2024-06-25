import * as crypto from 'crypto';
export function sha256(data: string) { return crypto.createHash('sha256').update(data).digest("hex")}
export function md5(data: string) { return crypto.createHash('md5').update(data).digest("hex")}