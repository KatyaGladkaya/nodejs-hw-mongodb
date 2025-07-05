import * as authService from '../services/auth.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await authService.register({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.login({ email, password });

  res
  .cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 15 * 60 * 1000,
  })
    .cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

export const refreshSession = async (req, res) => {
    const { refreshToken } = req.cookies;
  
    const { accessToken } = await authService.refreshSession(refreshToken);
  
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
};
  
export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
  
    if (!refreshToken) {
      return res.status(204).send();
    }
  
    await authService.logout(refreshToken);
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  
    res.status(204).send();
  };
