import {Component, OnDestroy, OnInit} from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import {ChatService} from "../../service/chat.service";
import {AuthService} from "../../service/auth.service";
import {environment} from "../../environment";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cskh',
  templateUrl: './cskh.component.html',
  styleUrls: ['./cskh.component.css']
})
export class CskhComponent implements OnInit, OnDestroy {

    loggedUser = this.authService.getUserFromLocalStorage();
    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private chatService: ChatService,) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    chatLink(){
        this.router.navigate(['chat'], {relativeTo: this.route});
    }

    protected readonly environment = environment;
}
