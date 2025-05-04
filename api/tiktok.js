const axios = require('axios');

module.exports = async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Masukkan username TikTok' });
  }

  try {
    const apikey = 'ayakaviki'; // Ganti dengan API key kamu jika perlu
    const result = await axios.get(`https://api.lolhuman.xyz/api/stalktiktok/${encodeURIComponent(username)}?apikey=${apikey}`);
    const data = result.data;

    if (data.status !== 200) {
      return res.status(data.status).json({ error: `Gagal mengambil data dari API. Status code: ${data.status}` });
    }

    const user = data.result;

    const metadata = {
      username: user.username,
      nickname: user.nickname,
      bio: user.bio,
      followers: user.followers,
      followings: user.followings,
      likes: user.likes,
      video: user.video,
      picture: user.user_picture
    };

    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
