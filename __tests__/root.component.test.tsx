/**
 * @jest-environment jsdom
*/

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Setup from '../src/app/Setup/page';
import { DataProvider } from "../src/app/data-context";
import nextRouterMock from 'next-router-mock';

/*jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(() => nextRouterMock),
  };
});*/

jest.mock("next/navigation", () => ({ useRouter: jest.fn().mockReturnValue({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn(), pathname: "/", query: {}, asPath: "/", }), usePathname: jest.fn(() => "/"), useSearchParams: jest.fn(() => ({})), }));

function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    }),
  );
}

describe('Page', () => {
  it('renders a heading', () => {
    window.fetch = mockFetch({});
  
    nextRouterMock.push('/');

    render(<body suppressHydrationWarning><DataProvider><Setup /></DataProvider></body>);

    screen.getByText('Create new Account').click();
 
    //const generatedPassword = generateRandomPassword();
    //const heading = screen.getByRole('heading', { level: 1 })
 
    //expect(heading).toBeInTheDocument()
  })
})