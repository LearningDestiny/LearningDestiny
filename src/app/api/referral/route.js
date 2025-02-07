import axios from 'axios';

// Function to generate a referral code for a user
export const generateReferralCode = async (userId) => {
  try {
    const response = await axios.post('/api/generate-referral', { userId });
    return response.data.referralCode;
  } catch (error) {
    console.error('Error generating referral code:', error);
    throw error;
  }
};

// Function to get referral statistics for a user
export const getReferralStats = async (userId) => {
  try {
    const response = await axios.get(`/api/referral-stats?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    throw error;
  }
};