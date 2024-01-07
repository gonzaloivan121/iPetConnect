import { EmailService } from 'src/app/services';
import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { IEmail } from "src/app/interfaces";

@Component({
    selector: "app-newsletter",
    templateUrl: "./newsletter.component.html",
    styleUrls: ["./newsletter.component.css"],
})
export class NewsletterComponent implements OnInit {
    newsletterForm: UntypedFormGroup;

    focusEmail: boolean;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private emailService: EmailService
    ) {}

    ngOnInit(): void {
        this.newsletterForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }

    get email() {
        return this.newsletterForm.get("email");
    }

    onSubmit() {
        const formData = this.newsletterForm.value;

        const data: IEmail = {
            email: formData.email,
            name: "Newsletter",
            message: "Newsletter Subscription for " + formData.email
        };

        this.emailService.Send(data).then((response: any) => {
            console.log(response);
        })
    }
}
