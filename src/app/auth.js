import { redirect } from 'react-router-dom';


export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};


export async function protectedLoader() {
  if (!isAuthenticated()) {
    throw redirect('/');
  }
  return null;
}
