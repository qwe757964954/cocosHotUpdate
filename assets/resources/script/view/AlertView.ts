import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AlertView')
export class AlertView extends Component {

    @property(Label)
    public title: Label = null;

    @property(Label)
    public content: Label = null;

    @property(Label)
    public cancel_text: Label = null;

    @property(Label)
    public sure_text: Label = null;

    private _okFunc:()=>void = null;
    private _cancelFunc:()=>void = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
    // title: '更新wifi提示',
    //         content: "当前为wifi，需要下载新的安装包才能进行游戏，更新包大小" + size,
    //         okWord: '确定',
    //         cancelWord: '取消',
    // okFunc: () => {
    //     this.alertNode.active = false;
    //     callback();
    // },
    // cancelFunc: () => {
    //     this.alertNode.active = false;
    //     callback();
    // },
    showAlert(data: any) {

        this.title.string = data.title;
        this.content.string = data.content;
        this.cancel_text.string = data.cancelWord;
        this.sure_text.string = data.okWord;
        this._okFunc = data.okFunc;
        this._cancelFunc = data.cancelFunc;
    }

    onClickSure(){
        if(this._okFunc){
            this._okFunc();
        }
    }

    onClickCancel(){
        if(this._cancelFunc){
            this._cancelFunc();
        }
    }

}


