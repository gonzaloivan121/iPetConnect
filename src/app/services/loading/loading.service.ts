import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "src/app/loading/loading.component";

@Injectable({
    providedIn: "root",
})
export class LoadingService {
    protected modalRef: NgbModalRef;
    private _isLoading: boolean = false;

    constructor(protected modalService: NgbModal) {}

    public isLoading(): boolean {
        return this._isLoading;
    }

    public open() {
        this._isLoading = true;

        this.modalRef = this.modalService.open(LoadingComponent, {
            centered: true,
            fullscreen: true,
            windowClass: "loading-modal",
            animation: true,
            keyboard: false
        });
    }

    public close() {
        this._isLoading = true;

        if (this.modalRef) {
            this.modalRef.close();
        }
    }
}
