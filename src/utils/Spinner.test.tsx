import Spinner from './Spinner';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom';


describe('Spinner component', () => {
  it('renders correctly with default props', async () => {
    const dom = render(<Spinner />);
    expect(await dom.findByTestId('spinner')).toBeVisible();
  });

  it('renders correctly with default props', async () => {
    const dom = render(<Spinner width={10} height={10} color="text-blue-500" bgColor="bg-gray-300" />);
    expect(await dom.findByTestId('spinner')).toBeVisible();
  });
});

export {}