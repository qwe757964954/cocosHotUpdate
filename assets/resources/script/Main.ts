import { _decorator, Component, director, Node, SceneAsset, sys } from 'cc';
import { ResLoader } from './ResLoader';
import { HotUpdate } from './view/HotUpdate';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Node)
    public hotUpdateNode: Node = null;

    start() {
        if (sys.isNative) {
            this.hotUpdateNode.getComponent(HotUpdate).setCallFunc(()=>{
                ResLoader.instance.load("Test",SceneAsset,(err, sceneAsset) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    director.runScene(sceneAsset)
                })
            })
        }else{
            ResLoader.instance.load("Test",SceneAsset,(err, sceneAsset) => {
                if (err) {
                    console.log(err);
                    return;
                }
                director.runScene(sceneAsset)
            })
        }
        
    }

    update(deltaTime: number) {
        
    }
}


