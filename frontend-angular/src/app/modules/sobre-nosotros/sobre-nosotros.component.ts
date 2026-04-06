import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent {
  themeToggle = false;

  toggleTheme(): void {
    this.themeToggle = !this.themeToggle;
    document.body.classList.toggle('dark-mode');
  }
}
