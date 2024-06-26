import Express from 'express';
import { AuthService } from './auth-service';
import { VideoService } from './video-service';
import multer from 'multer';
import path from 'path';
import { WatchDogService } from './watchdog-service';
const upload = multer({ dest: 'uploads/' })
const port = 3000; // MOVE TO .ENV

const app = Express();


app.get('/status', (req, res, next) => {
    if ((req.query['hash'] as string | undefined)) WatchDogService.PushDeviceHash(req.query['hash'] as string);
    res.send();
})

app.get('/video', (req, res, next) => {
    return res.json(VideoService.GetVideoList());
});

app.post('/video', upload.single('video'), (req, res, next) => {
    let pass = (req.body || {})['password'] as string | undefined;
    if (!AuthService.CheckPassword(pass || "")) {res.statusCode = 401; return res.send();}
    if (!req.file) {res.statusCode = 204; return res.send();}

    let b = req.file.originalname.split('.');
    b.pop();
    VideoService.UploadVideo(b.join('_'), req.file.mimetype, req.file.path);
    res.statusCode = 201;
    return res.send();
})

app.delete('/video/*', upload.none(), (req, res, next) => {
    let pass = (req.body || {})['password'];
    if (!AuthService.CheckPassword(pass || "")) {res.statusCode = 401; return res.send();}

    let ok = VideoService.RemoveVideo(req.url.split('/').pop() || "");

    res.statusCode = ok ? 204 : 404;
    return res.send();
})

app.get('/video/*', (req, res, next) => {
    let path = VideoService.GetVideoPath(req.url.split('/').pop() || "");
    if (!path) {
        res.statusCode = 404;
        return res.send();
    }
    return res.sendFile(path);
})

app.get('/*', (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'web', 'index.html'));
})

app.listen(port, () => {
    console.log(`[SERVER] Running at port ${port}`);
});