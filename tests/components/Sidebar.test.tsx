// tests/components/Sidebar.test.tsx | Task: FE-005 | Sidebar role-based navigation tests
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock modules before importing Sidebar
const mockRole = { current: null as string | null }
const mockAuth = { current: { isAuthenticated: false, role: null as string | null, user: null, logout: jest.fn(), getToken: jest.fn(), login: jest.fn(), isLoading: false } }

jest.mock('@/lib/auth-context', () => ({
  useAuth: () => ({
    ...mockAuth.current,
    role: mockRole.current,
    isAuthenticated: mockRole.current !== null,
    user: mockRole.current ? { username: 'testuser', token: 'tok', role: mockRole.current } : null,
  }),
  UserRole: {},
}))

jest.mock('@/lib/locale-context', () => ({
  useTranslation: () => ({
    locale: 'en',
    dictionary: {
      sidebar: {
        results: 'Results',
        medalTable: 'Medal Table',
        sports: 'Sports',
        myDashboard: 'My Dashboard',
        myResults: 'My Results',
        newResult: 'New Result',
        reviewQueue: 'Review Queue',
        adminDashboard: 'Admin Dashboard',
        userManagement: 'User Management',
        resultManagement: 'Result Management',
        sportTemplates: 'Sport Templates',
        auditLog: 'Audit Log',
        medalAssets: 'Medal Assets',
        login: 'Login',
        logout: 'Logout',
      },
    },
  }),
}))

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) =>
    <a href={href} {...props}>{children}</a>
})

import { Sidebar } from '@/components/layout/Sidebar'

describe('Sidebar', () => {
  beforeEach(() => {
    mockRole.current = null
  })

  it('shows only public nav items for unauthenticated users', () => {
    mockRole.current = null
    render(<Sidebar />)

    // Sidebar renders both mobile + desktop, so elements appear twice
    expect(screen.getAllByText('Results')).toHaveLength(2)
    expect(screen.getAllByText('Medal Table')).toHaveLength(2)
    expect(screen.getAllByText('Sports')).toHaveLength(2)
    expect(screen.queryByText('My Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
  })

  it('shows judge nav items for judge role', () => {
    mockRole.current = 'judge'
    render(<Sidebar />)

    expect(screen.getAllByText('Results')).toHaveLength(2)
    expect(screen.getAllByText('My Dashboard')).toHaveLength(2)
    expect(screen.getAllByText('My Results')).toHaveLength(2)
    expect(screen.getAllByText('New Result')).toHaveLength(2)
    expect(screen.getAllByText('Review Queue')).toHaveLength(2)
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
  })

  it('shows all nav items for admin role', () => {
    mockRole.current = 'admin'
    render(<Sidebar />)

    expect(screen.getAllByText('Results')).toHaveLength(2)
    expect(screen.getAllByText('My Dashboard')).toHaveLength(2)
    expect(screen.getAllByText('Admin Dashboard')).toHaveLength(2)
    expect(screen.getAllByText('User Management')).toHaveLength(2)
    expect(screen.getAllByText('Audit Log')).toHaveLength(2)
  })

  it('shows login link for unauthenticated users', () => {
    mockRole.current = null
    render(<Sidebar />)

    expect(screen.getAllByText('Login')).toHaveLength(2)
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  it('shows logout button for authenticated users', () => {
    mockRole.current = 'judge'
    render(<Sidebar />)

    expect(screen.getAllByText('Logout')).toHaveLength(2)
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })
})
