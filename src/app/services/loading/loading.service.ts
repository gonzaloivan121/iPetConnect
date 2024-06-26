import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "src/app/loading/loading.component";

@Injectable({
    providedIn: "root",
})
export class LoadingService {
    protected modalRef: NgbModalRef;

    constructor(protected modalService: NgbModal) {}

    public open() {
        this.modalRef = this.modalService.open(LoadingComponent, {
            centered: true,
            fullscreen: true,
            windowClass: "loading-modal",
            animation: true,
            keyboard: false
        });
    }

    public close() {
        if (this.modalRef) {
            this.modalRef.close();
        }
    }
}
