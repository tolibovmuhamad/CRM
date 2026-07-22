import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('вызывает onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>ОК</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'ОК' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('в состоянии loading задизейблен и помечен aria-busy', () => {
    render(<Button loading>ОК</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('не реагирует на клик, когда disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        ОК
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
