import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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
  console.log('[userLogin] args1=', JSON.stringify(args, null, 2));
  try {
    const response = await axios({
      maxRedirects: 0,
      validateStatus: (status) => status === 302 || status < 400, // Allow 302 responses
      url: args.url,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
      },
      data: qs.stringify(args.userInfo, { arrayFormat: 'repeat' }),
    });
    if (response.status === 302) {
      console.log('[userLogin] First redirect=', response.headers.location);
      // Manually follow the redirect
      const redirectedUrl = response.headers.location;
      if (redirectedUrl) {
        const secondResponse = await axios.get(redirectedUrl, {
          maxRedirects: 0,
          validateStatus: (status) => status === 302 || status < 400, // Allow 302 responses
        });
        console.log('[userLogin] Second redirect=', secondResponse.headers.location);
        if (response.status === 302) {
          window.location.href = secondResponse.headers.location;
        }
      }
    }
  } catch (err) {
    //XHR forced to follow redirect 302, which results at the end in a CORS error.Only way to catch this, its to verify if response is undefined.
    console.log('[userLogin] err1=', JSON.stringify(err, null, 2));
    if (axios.isAxiosError(err)) {
      console.log(
        '[userLogin] err.response?.request=',
        JSON.stringify(err.response?.request, null, 2),
      );
      if (!err.response) {
        console.log('[userLogin] !err.response, window.location.href to ', args.redirectUrl);
        window.location.href = args.redirectUrl;
        return;
      }
      thunkAPI.dispatch(userLogin.rejected(new Error(err.message), err.message, args));
    }
  }
});

export { userLogin };
