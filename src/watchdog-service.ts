import * as fs from 'fs';

interface Device {
    date: string;
    hash: string;
}
interface DeviceName {
    hash: string;
    name: string;
}

export module WatchDogService {
    const logFile = 'device.log';
    const deviceStoreFile = 'device_store.json';
    var deviceLog: Device[] = [];
    var deviceStore: DeviceName[] = [];

    function _pushLogFile(d: Device) {
        if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '', 'utf8');
        fs.appendFileSync(logFile, `${d.date}:${d.hash}\n`, 'utf8');
    }
    function _saveDeviceStore() {
        if (!fs.existsSync(deviceStoreFile)) fs.writeFileSync(deviceStoreFile, '', 'utf8');
        fs.writeFileSync(deviceStoreFile, JSON.stringify(deviceStore), 'utf8');
    }

    export function PushDeviceHash(hash: string) {
        let d = { date: new Date().toISOString(), hash};
        deviceLog.push(d);
        _pushLogFile(d);
    }

    export function GetTodayDeviceList() {

    }

    export function LoadDeviceList() {
        deviceLog = (fs.readFileSync(logFile, 'utf8').split('\n').map(el => {let d = el.trim().split(':'); return { date: d[0], hash: d[1] }})) || [];
        deviceStore = (JSON.parse(fs.readFileSync(deviceStoreFile, 'utf8'))) || [];
    }
}