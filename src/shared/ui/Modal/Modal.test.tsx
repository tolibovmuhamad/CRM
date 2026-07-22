import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@/shared/i18n';
import { Modal } from './Modal';

describe('Modal', () => {
  it('рендерит диалог, когда open', () => {
    render(
      <Modal open onClose={() => {}} title="Заголовок">
        <p>тело</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('тело')).toBeInTheDocument();
  });

  it('ничего не рендерит, когда закрыт', () => {
    render(
      <Modal open={false} onClose={() => {}} ariaLabel="x">
        <p>тело</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('закрывается по Esc', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Заголовок">
        <p>тело</p>
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
