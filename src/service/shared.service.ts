import { Subject } from "rxjs";

export class SharedService{
    toolbarButtonClicked = new Subject<string>();

    getButtonClicked(){
        return this.toolbarButtonClicked.asObservable();
    }
}