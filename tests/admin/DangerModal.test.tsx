// tests/admin/DangerModal.test.tsx | Task: FE-005 | DangerModal confirmation tests
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock radix dialog to render inline
jest.mock('@radix-ui/react-dialog', () => {
  const actual = jest.requireActual('@radix-ui/react-dialog')
  return {
    ...actual,
    Root: ({ children, open }: any) => open ? <div>{children}</div> : null,
    Portal: ({ children }: any) => <div>{children}</div>,
    Overlay: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Content: ({ children, ...props }: any) => <div role="dialog" {...props}>{children}</div>,
    Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    Description: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    Close: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Trigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  }
})

jest.mock('@/lib/locale-context', () => ({
  useTranslation: () => ({
    locale: 'en',
    dictionary: {
      admin: {
        modal: {
          confirmPhrase: 'Type the confirmation phrase to continue',
          reason: 'Reason',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
      },
    },
  }),
}))

import { DangerModal } from '@/components/admin/DangerModal'

describe('DangerModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    title: 'Confirm Action',
    description: 'This is dangerous',
    confirmPhrase: 'DELETE',
    onConfirm: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<DangerModal {...defaultProps} />)
    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
  })

  it('confirm button is disabled until phrase is typed correctly', () => {
    render(<DangerModal {...defaultProps} />)

    const confirmBtn = screen.getByRole('button', { name: /confirm/i })
    expect(confirmBtn).toBeDisabled()

    const input = screen.getByPlaceholderText(/DELETE/i) || screen.getByDisplayValue('')
    fireEvent.change(input, { target: { value: 'DELETE' } })

    expect(confirmBtn).not.toBeDisabled()
  })

  it('calls onConfirm only after correct phrase', () => {
    render(<DangerModal {...defaultProps} />)

    const input = screen.getByPlaceholderText(/DELETE/i) || screen.getByDisplayValue('')
    fireEvent.change(input, { target: { value: 'WRONG' } })

    const confirmBtn = screen.getByRole('button', { name: /confirm/i })
    expect(confirmBtn).toBeDisabled()

    fireEvent.change(input, { target: { value: 'DELETE' } })
    fireEvent.click(confirmBtn)

    expect(defaultProps.onConfirm).toHaveBeenCalled()
  })

  it('requires reason when requireReason is set', () => {
    render(<DangerModal {...defaultProps} requireReason reasonMinLength={10} />)

    const phraseInput = screen.getByPlaceholderText(/DELETE/i) || screen.getAllByRole('textbox')[0]
    fireEvent.change(phraseInput, { target: { value: 'DELETE' } })

    // Confirm should still be disabled because reason is empty
    const confirmBtn = screen.getByRole('button', { name: /confirm/i })
    expect(confirmBtn).toBeDisabled()
  })
})
