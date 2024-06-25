import { sha256 } from "./hash";
import randstr from "./rand";
import * as fs from 'fs';

export module AuthService {
    export function ReadPassword() {
        let blocks = fs.readFileSync('./admin.hash', 'utf8').split(':'); 
        if (blocks[0].length != 16 || blocks[1].length != 16 || blocks[2].length != 64) return ResetPassword();
        return blocks;
    }
    export function ResetPassword(pass: string = randstr(12)) {
        let salt1 = randstr(16);
        let salt2 = randstr(16);
        let passhash = sha256([salt1, pass, salt2].join(''));

        fs.writeFileSync('./admin.hash', [salt1, salt2, passhash].join(':'));
        return [salt1, salt2, passhash];
    }

    export function CheckPassword(pass: string) {
        let blocks = ReadPassword();

        return sha256([blocks[0], pass, blocks[1]].join('')) === blocks[2];
    }
}