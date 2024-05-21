import { error, native } from "cc";
import { ResLoader } from "../ResLoader";
const example_cdn_url = "http://192.168.1.113:5000";
export class ManifestFileMgr {
    private static s_minifestMgr: ManifestFileMgr = null;
    public static instance() {
        if (!this.s_minifestMgr) {
            this.s_minifestMgr = new ManifestFileMgr();
        }
        return this.s_minifestMgr;
    }

    private changeHostName(originalUrl:string,newDomain:string){
        // 提取原始URL中的域名部分
        const domainRegex = /^(https?:\/\/[^/]+)/;
        const match = originalUrl.match(domainRegex);
        console.log("修改前的URL:", originalUrl);
        if (match) {
            const originalDomain = match[1];
            // 使用新的域名替换原始URL中的域名部分
            const newUrl = originalUrl.replace(originalDomain, newDomain);
            console.log("修改后的URL:", newUrl);
            return newUrl;
        } else {
            console.log("URL格式不正确");
            return originalUrl;
        }
    }

    public checkLoadManifestPath(manifestUrl:string){
        let storagePath = `${native.fileUtils.getWritablePath()}hailang_hot_minifest`;
        let localManifestPath = `${storagePath}/project.manifest`;
        if(!native.fileUtils.isFileExist(localManifestPath)){
            return manifestUrl;
        }
        return localManifestPath;
    }

    public modifyProjectAppLoadUrlForManifestFile(){
        console.log("modifyProjectAppLoadUrlForManifestFile____________________________")
        let storagePath = `${native.fileUtils.getWritablePath()}hailang_hot_minifest`;
        let localManifestPath = `${storagePath}/project.manifest`;
        return new Promise<void>((resolve, reject) => {
            if(native.fileUtils.isFileExist(`${localManifestPath}`)){
                console.log("有Project下载的manifest文件");
                console.log("StoragePath for remote asset : ",storagePath);
                let loadManifest = native.fileUtils.getStringFromFile(localManifestPath)
                let projectManifest = JSON.parse(loadManifest);
                projectManifest.packageUrl = this.changeHostName(projectManifest.packageUrl,example_cdn_url);
                projectManifest.remoteManifestUrl = this.changeHostName(projectManifest.remoteManifestUrl,example_cdn_url);
                projectManifest.remoteVersionUrl = this.changeHostName(projectManifest.remoteVersionUrl,example_cdn_url);
                let saveManifest = JSON.stringify(projectManifest);
                console.log("saveManifest____________________________1",saveManifest);
                if(!native.fileUtils.isDirectoryExist(storagePath)){
                    native.fileUtils.createDirectory(storagePath);
                }
                let isWritten = native.fileUtils.writeStringToFile(saveManifest,localManifestPath);
                if(isWritten){
                    console.log("project manifest文件 写入成功");
                    resolve();
                }
            }else{
                console.log("无Project下载的manifest文件");
                ResLoader.instance.load('project', (err: Error | null, res: any) => {
                    if (err) {
                        error("【热更新界面】project缺少热更新配置文件");
                        return;
                    }
                    let manifestUrl = res.nativeUrl;
                    console.log('manifestUrl__________________: ',manifestUrl,storagePath);
                    let loadManifest = native.fileUtils.getStringFromFile(`${manifestUrl}`)
                    console.log('loadManifest__________________: ',loadManifest);
                    let projectManifest = JSON.parse(loadManifest);
                    projectManifest.packageUrl = this.changeHostName(projectManifest.packageUrl,example_cdn_url);
                    projectManifest.remoteManifestUrl = this.changeHostName(projectManifest.remoteManifestUrl,example_cdn_url);
                    projectManifest.remoteVersionUrl = this.changeHostName(projectManifest.remoteVersionUrl,example_cdn_url);
                    let saveManifest = JSON.stringify(projectManifest);
                    console.log("saveManifest____________________________2",saveManifest);
                    if(!native.fileUtils.isDirectoryExist(storagePath)){
                        native.fileUtils.createDirectory(storagePath);
                    }
                    let isWritten = native.fileUtils.writeStringToFile(saveManifest,localManifestPath);
                    if(isWritten){
                        console.log("project manifest文件 写入成功");
                        resolve();
                    }
                });
            }
        });
    }

    public modifyVersionAppLoadUrlForManifestFile(){
        console.log("modifyVersionAppLoadUrlForManifestFile____________________________")
        let storagePath = `${native.fileUtils.getWritablePath()}hailang_hot_minifest`;
        let localManifestPath = `${storagePath}/version.manifest`;
        return new Promise((resolve, reject) => {
            if(native.fileUtils.isFileExist(localManifestPath)){
                console.log("Version下载的manifest文件");
                console.log("StoragePath for remote asset : ",storagePath);
                let loadManifest = native.fileUtils.getStringFromFile(localManifestPath)
                let versionManifest = JSON.parse(loadManifest);
                versionManifest.packageUrl = this.changeHostName(versionManifest.packageUrl,example_cdn_url);
                versionManifest.remoteManifestUrl = this.changeHostName(versionManifest.remoteManifestUrl,example_cdn_url);
                versionManifest.remoteVersionUrl = this.changeHostName(versionManifest.remoteVersionUrl,example_cdn_url);
                let saveManifest = JSON.stringify(versionManifest);
                console.log("saveManifest____________________________1",saveManifest);
                let isWritten = native.fileUtils.writeStringToFile(saveManifest,localManifestPath);
                if(!native.fileUtils.isDirectoryExist(storagePath)){
                    native.fileUtils.createDirectory(storagePath);
                }
                if(isWritten){
                    console.log("Version manifest文件 写入成功");
                    resolve(localManifestPath);
                }else{
                    reject();
                }
            }else{
                console.log("无Version下载的manifest文件");
                ResLoader.instance.load('version', (err: Error | null, res: any) => {
                    if (err) {
                        error("【热更新界面】project缺少热更新配置文件");
                        return;
                    }
                    let manifestUrl = res.nativeUrl;
                    console.log('manifestUrl__________________: ',manifestUrl,storagePath);
                    let loadManifest = native.fileUtils.getStringFromFile(`${manifestUrl}`)
                    console.log('loadManifest__________________: ',loadManifest);
                    let versionManifest = JSON.parse(loadManifest);
                    versionManifest.packageUrl = this.changeHostName(versionManifest.packageUrl,example_cdn_url);
                    versionManifest.remoteManifestUrl = this.changeHostName(versionManifest.remoteManifestUrl,example_cdn_url);
                    versionManifest.remoteVersionUrl = this.changeHostName(versionManifest.remoteVersionUrl,example_cdn_url);
                    let saveManifest = JSON.stringify(versionManifest);
                    console.log("saveManifest____________________________2",saveManifest);
                    if(!native.fileUtils.isDirectoryExist(storagePath)){
                        native.fileUtils.createDirectory(storagePath);
                    }
                    let isWritten = native.fileUtils.writeStringToFile(saveManifest,localManifestPath);
                    if(isWritten){
                        console.log("Version manifest文件 写入成功");
                        resolve(localManifestPath);
                    }else{
                        reject();
                    }
                });
            }
        });
    }
}

