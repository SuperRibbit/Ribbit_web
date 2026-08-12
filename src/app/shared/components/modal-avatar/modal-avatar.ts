import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButton } from '../custom-button/custom-button';

@Component({
  selector: 'app-modal-avatar',
  standalone: true,
  imports: [CommonModule, CustomButton],
  templateUrl: './modal-avatar.html',
  styleUrl: './modal-avatar.css',
})
export class ModalAvatar {
  @Input() avatarAtual: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() avatarSelected = new EventEmitter<string>();

  avatares: string[] = [
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f436.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f431.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f98a.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f43b.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f43c.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f428.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f981.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f438.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f435.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f430.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f437.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f42f.png"
  ];

  selecionado = signal<string>('');

  ngOnInit() {
    this.selecionado.set(this.avatarAtual);
  }

  selecionarAvatar(avatar: string) {
    this.selecionado.set(avatar);
  }

  confirmarSelecao() {
    if (this.selecionado()) {
      this.avatarSelected.emit(this.selecionado());
    }
    this.fecharModal();
  }

  fecharModal() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.fecharModal();
    }
  }
}