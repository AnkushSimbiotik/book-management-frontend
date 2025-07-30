import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../users.service';
import { CustomerInterface } from '../../../interface/customer.interface';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-user.html',
  styleUrls: ['./view-user.scss'],
})
export class ViewUser implements OnInit {
  user: CustomerInterface | null = null;
  error: string | null = null;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private userService: Users) {}

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUser(id).subscribe({
        next: (response) => {
          this.user = response.data || null;
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.message || 'An error occurred';
          this.loading = false;
        },
      });
    }
  }
}
