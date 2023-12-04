import {render} from '@testing-library/react'
import '@testing-library/jest-dom';
import { PrimaryButton } from './PrimaryButton';

describe('Primary Button component', () => {
  it('renders correctly with default props', async () => {
    const dom = render(<PrimaryButton onClick={jest.fn()} >hi </PrimaryButton>);
    expect(await dom.findByRole('button')).toBeVisible();
  });
});

export {}