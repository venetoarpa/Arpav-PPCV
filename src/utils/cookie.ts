import Cookies from 'js-cookie';

export const setCookie = (key: string, value: string, expireAfter: number) => {
  const expires = expireAfter;
  const cookieSecuritySettings = {
    sameSite: 'None',
    secure: true
  }
  Cookies.set(key, value, {
    expires,
    path: '/',
    ...cookieSecuritySettings
  });
};

export const removeCookie = (key: string) => Cookies.remove(key);

export const getCookie = (key: string) => Cookies.get(key);
