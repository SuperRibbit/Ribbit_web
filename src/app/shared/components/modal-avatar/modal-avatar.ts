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
    'assets/avatars/dog.svg',
    'assets/avatars/cat.svg',
    'assets/avatars/fox.svg',
    'assets/avatars/bear.svg',
    'assets/avatars/panda.svg',
    'assets/avatars/koala.svg',
    'assets/avatars/lion.svg',
    'assets/avatars/frog.svg',
    'assets/avatars/monkey.svg',
    'assets/avatars/rabbit.svg',
    'assets/avatars/pig.svg',
    'assets/avatars/tiger.svg',
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