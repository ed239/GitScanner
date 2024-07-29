import axios from 'axios';
// import jwt from 'jsonwebtoken';


// const secretKey = 'k3yG3n3r4t0r_1n5ecur3_k3y'

export default async function handler(req, res) {
  const { code } = req.query;
  const { NEXT_PUBLIC_CLIENT_ID, NEXT_PUBLIC_CLIENT_SECRET, NEXTAUTH_URL } = process.env;

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: NEXT_PUBLIC_CLIENT_ID,
        client_secret: NEXT_PUBLIC_CLIENT_SECRET,
        code,
        redirect_uri: NEXTAUTH_URL,
      },
      {
        headers: {
          Accept: 'application/json',
          AccessControlAllowOrigin: '*',
          Authorization: ''
        },
      }
    );

    const token = response.data.access_token;
    //const encodedToken = jwt.sign({token}, secretKey, { expiresIn: '1h'});
    // res.setHeader('Set-Cookie', `token=${encodedToken}; HttpOnly`);
    // console.log(encodedToken, 'encoded Token')
    res.redirect(`/success?token=${token}`);
  } catch (error) {
    console.error('Error exchanging code for token', error);
    res.status(500).send('Error exchanging code for token');
  }
}


