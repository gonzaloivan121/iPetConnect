import { Component, OnInit } from '@angular/core';
import { ITeamMember } from 'src/app/interfaces';

@Component({
    selector: "app-the-team",
    templateUrl: "./the-team.component.html",
    styleUrls: ["./the-team.component.css"],
})
export class TheTeamComponent implements OnInit {
    team: ITeamMember[] = [
        {
            id: 1,
            name: "Gonzalo Chaparro",
            position: "UX Designer",
            aptitudes: {
                business: "Dedicated entrepreneur",
                leisure: "Outdoors lover",
                personal: "Super friendly support team",
            },
            image: "assets/img/team/Gonzalo.jpg",
        },
        {
            id: 2,
            name: "Gonzalo Chaparro",
            position: "Team Lead",
            aptitudes: {
                business: "Dedicated entrepreneur",
                leisure: "Gamer",
                personal: "Able to get good at everything",
            },
            image: "assets/img/team/Gonzalo.jpg",
        },
        {
            id: 3,
            name: "Gonzalo Chaparro",
            position: "Content Creator",
            aptitudes: {
                business: "High quality publication",
                leisure: "Storytelling",
                personal: "Master of words qualification",
            },
            image: "assets/img/team/Gonzalo.jpg",
        },
    ];

    constructor() {}

    ngOnInit(): void {}
}
