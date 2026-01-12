const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../common/utils/jwt');

const prisma = new PrismaClient();

/**
 * Login Controller
 * POST /api/auth/login
 * Single login endpoint for all roles
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    // Find user by email
    const user = await prisma.User.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials.',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Account is deactivated. Contact administrator.',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return token and role as per API contract
    return res.status(200).json({
      token,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Logout Controller (optional - for token blacklisting if implemented)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  // Since JWT is stateless, logout is handled on frontend by removing token
  // This endpoint can be used for token blacklisting if needed in future
  return res.status(200).json({
    message: 'Logged out successfully.',
  });
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  login,
  logout,
  getMe,
};
