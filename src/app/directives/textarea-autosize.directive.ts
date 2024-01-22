import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[autosize]'
})
export class TextareaAutosizeDirective implements OnInit {

    private initialHeight: string;

    constructor(
        private elementRef: ElementRef
    ) {}

    @HostListener(':input')
    onInput() {
        this.resize();
    }

    ngOnInit() {
        this.initialHeight = this.elementRef.nativeElement.style.height;
        this.resize();
    }

    resize() {
        this.elementRef.nativeElement.style.height = this.initialHeight;
        this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.scrollHeight + 'px';
    }

}
