import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {CategoryService} from "../../service/category.service";
import {TokenService} from "../../service/token.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent {

    constructor(protected route : ActivatedRoute,
                protected router: Router,
                private authService: AuthService,
                private categoryService: CategoryService,
                private tokenService: TokenService,
                private toastr: ToastrService) {
    }
}
