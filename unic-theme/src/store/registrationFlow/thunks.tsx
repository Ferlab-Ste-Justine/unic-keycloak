import { createAsyncThunk } from '@reduxjs/toolkit';
import qs from 'qs';

import { RootState } from 'store/types';

import { TUser } from './types';

const userLogin = createAsyncThunk<
  void,
  {
    userInfo: TUser;
    url: string;
    redirectUrl: string;
  },
  { rejectValue: string; state: RootState }
>('user/login', async (args, thunkAPI) => {
  console.log('[userLogin] with fetch args=', JSON.stringify(args, null, 2));
  try {
    const response = await fetch(args.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(args.userInfo, { arrayFormat: 'repeat' }),
      redirect: 'manual', // ⬅️ Prevent browser from automatically following redirects
    });

    console.log('[userLogin] First response:', response);

    if (response.status === 302) {
      const redirectedUrl = response.headers.get('Location');
      console.log('[userLogin] First redirect to:', redirectedUrl);
      // Manually follow the redirect
      if (redirectedUrl) {
        try {
          const secondResponse = await fetch(redirectedUrl, {
            method: 'GET',
            redirect: 'manual', // ⬅️ Prevent browser from following the second redirect
          });

          console.log('[userLogin] Second response:', secondResponse);

          if (secondResponse.status === 302) {
            const secondRedirectUrl = secondResponse.headers.get('Location');
            console.log('[userLogin] Redirecting browser to:', secondRedirectUrl);
            if (secondRedirectUrl) {
              window.location.href = secondRedirectUrl;
            }
          }
        } catch (secondError) {
          console.error('[userLogin] Error in second redirect:', secondError);
        }
      }
    }
  } catch (err) {
    console.error('[userLogin] First request error:', err);
    console.log('[userLogin] Redirecting to fallback:', args.redirectUrl);
    // window.location.href = args.redirectUrl;
  }
});

export { userLogin };
