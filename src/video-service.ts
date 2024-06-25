import * as fs from 'node:fs';
import path from 'path';
import randstr from './rand';
import mime from 'mime-types';
const videoFolderPath = './web/videos';
const videoTypes = ['mp4', 'webm', 'mpeg', 'avi', 'ogv', 'mkv', 'mpg', 'amv', 'flv']

interface Video {
    [name: string]: string;
}

export module VideoService {
    export function GetVideoList(): string[] {
        let files: string[] = [];
        fs.readdirSync(videoFolderPath).forEach(el => videoTypes.includes(el.split('.').pop()!) ? files.push(el) : undefined);
        let allpaths = (files.map(el => {
            let r = el.split('\\').pop()!.split('.');
            r.pop();
            return r.join('.');
        })) || [];
        return allpaths;
    }

    export function GetVideoPathList(): Video {
        let files: string[] = fs.readdirSync(videoFolderPath);
        let videos: Video = {};
        files.forEach(el => {
            let r = el.split('\\').pop()!.split('.');
            r.pop();
            videos[r.join('.')] = path.join(videoFolderPath, el);
        });
        return videos;
    }

    export function UploadVideo(origname: string, type: string, pathtmp: string) {
        fs.copyFileSync(pathtmp, path.join(videoFolderPath, `${origname}.${randstr(10)}.${mime.extension(type)}`));
    }

    export function RemoveVideo(name: string) {
        let videos = GetVideoPathList();
        if (!videos[name]) return false;
        
        fs.rmSync(videos[name]);
        return true;
    }

    export function GetVideoPath(name: string) {
        let videos = GetVideoPathList();
        return videos[name] ? path.join(process.cwd(), videos[name]) : undefined;
    }
}