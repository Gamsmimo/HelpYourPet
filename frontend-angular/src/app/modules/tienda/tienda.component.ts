import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit, OnDestroy {
  selectedStoreId: number | null = null;
  selectedCategory = 'all';
  selectedSort = 'featured';
  searchTerm = '';
  activeSlide = 0;
  isCartOpen = false;
  isEmergenciaOpen = false;
  isDarkMode = false;
  isProcessingPayment = false;

  private carouselIntervalId: ReturnType<typeof setInterval> | null = null;

  stores = [
    { id: 1, nombre: 'PetShop Centro', direccion: 'Duitama Centro', icono: 'fa-store' },
    { id: 2, nombre: 'PetShop Norte', direccion: 'Duitama Norte', icono: 'fa-shop' },
    { id: 3, nombre: 'PetShop Sur', direccion: 'Duitama Sur', icono: 'fa-paw' }
  ];

  slides = [
    {
      titulo: '¡Bienvenidos a Nuestra PetShop!',
      subtitulo: 'Tu mascota merece lo mejor, nosotros te lo ofrecemos',
      imagen:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='480'%3E%3Crect fill='%23ffd1dc' width='1400' height='480'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='46' x='50%25' y='50%25' text-anchor='middle'%3EPerro feliz%3C/text%3E%3C/svg%3E"
    },
    {
      titulo: 'Productos de Calidad',
      subtitulo: 'Encuentra todo lo que tu mascota necesita',
      imagen:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='480'%3E%3Crect fill='%23d1ecff' width='1400' height='480'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='46' x='50%25' y='50%25' text-anchor='middle'%3EGato jugando%3C/text%3E%3C/svg%3E"
    },
    {
      titulo: 'Ofertas Especiales',
      subtitulo: 'Descuentos exclusivos cada semana',
      imagen:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='480'%3E%3Crect fill='%23d6ffd1' width='1400' height='480'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='46' x='50%25' y='50%25' text-anchor='middle'%3EMascotas felices%3C/text%3E%3C/svg%3E"
    }
  ];

  products = [
    { id: 1, nombre: 'Concentrado Premium', categoria: 'food', precio: 95000, destacado: true, imagen: '', stock: 12 },
    { id: 2, nombre: 'Collar Ajustable', categoria: 'accessories', precio: 28000, destacado: true, imagen: '', stock: 40 },
    { id: 3, nombre: 'Vitaminas Caninas', categoria: 'medicine', precio: 45000, destacado: false, imagen: '', stock: 18 },
    { id: 4, nombre: 'Arena para Gatos', categoria: 'food', precio: 38000, destacado: true, imagen: '', stock: 22 },
    { id: 5, nombre: 'Shampoo Hipoalergénico', categoria: 'medicine', precio: 32000, destacado: false, imagen: '', stock: 15 },
    { id: 6, nombre: 'Juguete Mordedor', categoria: 'accessories', precio: 22000, destacado: true, imagen: '', stock: 30 }
  ];

  cart: Array<{ id: number; nombre: string; precio: number; cantidad: number }> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('tienda-theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyThemeClass();
    }
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  get selectedStoreName(): string {
    return this.stores.find((s) => s.id === this.selectedStoreId)?.nombre || '';
  }

  get hasStoreSelected(): boolean {
    return this.selectedStoreId !== null;
  }

  get filteredProducts(): Array<{ id: number; nombre: string; categoria: string; precio: number; destacado: boolean; imagen: string; stock: number }> {
    let data = [...this.products];

    if (this.selectedCategory !== 'all') {
      data = data.filter((p) => p.categoria === this.selectedCategory);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter((p) => p.nombre.toLowerCase().includes(term));
    }

    switch (this.selectedSort) {
      case 'price-low':
        data.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-high':
        data.sort((a, b) => b.precio - a.precio);
        break;
      case 'name':
        data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        data.sort((a, b) => Number(b.destacado) - Number(a.destacado));
        break;
    }

    return data;
  }

  get featuredProducts(): Array<{ id: number; nombre: string; categoria: string; precio: number; destacado: boolean; imagen: string; stock: number }> {
    return this.filteredProducts.filter((p) => p.destacado);
  }

  get cartCount(): number {
    return this.cart.reduce((acc, item) => acc + item.cantidad, 0);
  }

  get subtotal(): number {
    return this.cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  selectStore(storeId: number): void {
    this.selectedStoreId = storeId;
  }

  backToStoreSelection(): void {
    this.selectedStoreId = null;
    this.searchTerm = '';
  }

  onCategoryChange(value: string): void {
    this.selectedCategory = value;
  }

  onSortChange(value: string): void {
    this.selectedSort = value;
  }

  applySearch(): void {
    // El filtrado se aplica de forma reactiva con searchTerm.
  }

  addToCart(product: { id: number; nombre: string; precio: number }): void {
    const existing = this.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.cantidad += 1;
      return;
    }
    this.cart.push({ ...product, cantidad: 1 });
  }

  increaseQty(productId: number): void {
    const item = this.cart.find((p) => p.id === productId);
    if (item) {
      item.cantidad += 1;
    }
  }

  decreaseQty(productId: number): void {
    const item = this.cart.find((p) => p.id === productId);
    if (!item) {
      return;
    }
    if (item.cantidad <= 1) {
      this.removeFromCart(productId);
      return;
    }
    item.cantidad -= 1;
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item.id !== productId);
  }

  openCart(): void {
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  checkout(): void {
    if (!this.cart.length || this.isProcessingPayment) {
      return;
    }

    this.isProcessingPayment = true;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
    const payload = {
      currency: 'cop',
      successUrl: `${origin}/tienda?payment=success`,
      cancelUrl: `${origin}/tienda?payment=cancel`,
      items: this.cart.map((item) => ({
        name: item.nombre,
        price: Math.round(item.precio),
        quantity: item.cantidad
      }))
    };

    this.http
      .post<{ url: string; sessionId: string }>(`${environment.apiUrl}/pagos/stripe/checkout-session`, payload)
      .subscribe({
        next: (response) => {
          if (response?.url && typeof window !== 'undefined') {
            window.location.href = response.url;
            return;
          }
          this.isProcessingPayment = false;
          alert('No se recibió la URL de pago de Stripe.');
        },
        error: (error) => {
          console.error('Error al iniciar checkout Stripe:', error);
          this.isProcessingPayment = false;
          const backendMessage =
            error?.error?.message && typeof error.error.message === 'string'
              ? error.error.message
              : 'No se pudo iniciar el pago.';
          alert(`${backendMessage} Verifica la configuración de Stripe en backend.`);
        }
      });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyThemeClass();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tienda-theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  openEmergencias(): void {
    this.isEmergenciaOpen = true;
  }

  cerrarModal(): void {
    this.isEmergenciaOpen = false;
  }

  redirigirVideollamada(): void {
    if (typeof window !== 'undefined') {
      window.open('https://meet.google.com/', '_blank');
    }
  }

  redirigirWhatsApp(): void {
    if (typeof window !== 'undefined') {
      window.open('https://wa.me/573001112233', '_blank');
    }
  }

  redirigirWhatsApp2(): void {
    if (typeof window !== 'undefined') {
      window.open('https://wa.me/573001112233?text=Necesito%20primeros%20auxilios%20para%20mi%20mascota', '_blank');
    }
  }

  prevSlide(): void {
    this.activeSlide = (this.activeSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.activeSlide = index;
  }

  getProductImage(productName: string): string {
    const encoded = encodeURIComponent(productName);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='360'%3E%3Crect fill='%23ececec' width='500' height='360'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='28' x='50%25' y='50%25' text-anchor='middle'%3E${encoded}%3C/text%3E%3C/svg%3E`;
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  }

  private startCarousel(): void {
    this.stopCarousel();
    this.carouselIntervalId = setInterval(() => this.nextSlide(), 5000);
  }

  private stopCarousel(): void {
    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
      this.carouselIntervalId = null;
    }
  }

  private applyThemeClass(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('tienda-dark-mode', this.isDarkMode);
    }
  }
}
