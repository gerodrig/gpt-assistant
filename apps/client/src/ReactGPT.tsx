import { RouterProvider } from 'react-router-dom';
import { router } from './presentation/router/Router';

export const ReactGPT = () => {
  return (
    <RouterProvider router={ router } />
  )
}
