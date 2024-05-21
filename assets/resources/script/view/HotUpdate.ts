
import { Component, Label, Node, ProgressBar, _decorator, game, sys } from "cc";
import { AlertView } from "./AlertView";
import { Hot, HotOptions } from "./Hot";

const { ccclass, property } = _decorator;

/** 热更新界面控制脚本 */
@ccclass('HotUpdate')
export class HotUpdate extends Component {
    /** 热更新业务管理对象 */
    private hot = new Hot();

    @property(Node)
    public alertNode: Node = null;

    @property(Label)
    public tips_text:Label = null;

    @property(ProgressBar)
    public progress_bar:ProgressBar = null;

    private _onComplete:()=>void = null;


    async onLoad() {
        if (sys.isNative) {
            this.tips_text.string = "检查更新中.....";
            // await ManifestFileMgr.instance().modifyProjectAppLoadUrlForManifestFile();
            // await ManifestFileMgr.instance().modifyVersionAppLoadUrlForManifestFile();
            this.startHotUpdate();
        }
    }

    /** 开始热更新 */
    private startHotUpdate() {
        let options = new HotOptions();
        options.onVersionInfo = (data: any) => {
            // console.log(`【热更新界面】本地版本:${data.local},远程版本:${data.server}`);
        };
        options.onUpdateProgress = (event: jsb.EventAssetsManager) => {
            // 进度提示字
            let pc = event.getPercent();
            let _total = event.getTotalBytes();
            let _have = event.getDownloadedBytes();

            let total: string, have: string;
            if (_total < 1048576) {                              // 小于1m，就显示kb
                _total = Math.ceil(_total / 1024)
                total = _total + 'K'
            }
            else {                                               // 显示m
                total = (_total / (1024 * 1024)).toFixed(1);
                total = total + 'M'
            }

            if (_have < 1048576) {                               // 小于1m，就显示kb
                _have = Math.ceil(_have / 1024)
                have = _have + 'K'
            }
            else {                                               // 显示m
                have = (_have / (1024 * 1024)).toFixed(1);
                have = have + 'M'
            }

            if (total == '0K') {
                this.tips_text.string = "检查更新中.....";
                // this.lv.data.prompt = oops.language.getLangByID("update_tips_check_update");
            }
            else {
                let str = "更新中:"  + have + '/' + total + ' (' + parseInt(pc * 100 + "") + '%)';
                console.log(str);
            }

            // 进度条
            if (!isNaN(event.getPercent())) {
                console.log("finished....",event.getDownloadedFiles());
                console.log("total....",event.getTotalFiles());
                console.log("progress....",(event.getPercent() * 100).toFixed(2));

                this.progress_bar.progress = (event.getPercent());
            }
        };
        options.onNeedToUpdate = (data: any, totalBytes: number) => {
            this.tips_text.string = "发现新版本资源....";
            let total: string = "";
            if (totalBytes < 1048576) {                                 // 小于1m，就显示kb
                // totalBytes = Math.ceil(totalBytes / 1024);
                // total = total + 'KB';
                total = Math.ceil(totalBytes / 1024) + 'KB';
            }
            else {
                total = (totalBytes / (1024 * 1024)).toFixed(1);
                total = total + 'MB';
            }

            // 提示更新
            this.checkForceUpdate(() => {
                // 非 WIFI 环境提示玩家
                this.showUpdateDialog(total, () => {
                    this.hot.hotUpdate();
                })
            });
        };
        options.onNoNeedToUpdate = () => {
            this.tips_text.string = "当前版本与远程版本一致且无须更新";
            if(this._onComplete){
                this._onComplete()
            }
        };
        options.onUpdateFailed = () => {
            this.tips_text.string = "更新失败.....";
            this.hot.checkUpdate();
        };
        options.onUpdateSucceed = () => {
            console.log("更新成功.....",100);
            this.progress_bar.progress = 1;
            setTimeout(() => {
                game.restart();
            }, 1000);
        };

        this.hot.init(options);
    }

    setCallFunc(callback:()=>void){
        this._onComplete = callback;
    }

    /** 检查是否强制更新信息 */
    private checkForceUpdate(callback: Function) {
        let operate: any = {
            title: '系统提示',
            content: "当前版本过旧，需要下载新的安装包才能进行游戏，是否更新？",
            okWord: '确定',
            cancelWord: '取消',
            okFunc: () => {
                this.alertNode.active = false;
                this.hot.clearHotUpdateStorage();
                callback();
            },
            cancelFunc: () => {
                this.alertNode.active = false;
                game.end();
            },
            needCancel: true
        };
        this.alertNode.active = true;
        this.alertNode.getComponent(AlertView).showAlert(operate);
        // oops.gui.open(UIID.Window, operate);
    }

    /** 非 WIFI 环境提示玩家 */
    private showUpdateDialog(size: string, callback: Function) {
        if (sys.getNetworkType() == sys.NetworkType.LAN) {
            callback();
            return;
        }
        let operate: any = {
            title: '更新wifi提示',
            content: "当前为非wifi，需要下载新的安装包才能进行游戏，更新包大小" + size,
            okWord: '确定',
            cancelWord: '取消',
            okFunc: () => {
                this.alertNode.active = false;
                callback();
            },
            cancelFunc: () => {
                this.alertNode.active = false;
                callback();
            },
            needCancel: true
        };
        this.alertNode.active = true;
        this.alertNode.getComponent(AlertView).showAlert(operate);
    }
}