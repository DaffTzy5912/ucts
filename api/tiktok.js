const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Masukkan username' });

  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}`);
    const html = response.data;
    const $ = cheerio.load(html);
    const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
    const parsedData = JSON.parse(scriptData);

    const userDetail = parsedData.__DEFAULT_SCOPE__?.['webapp.user-detail'];
    if (!userDetail) throw new Error('User tidak ditemukan');

    const userInfo = userDetail.userInfo?.user;
    const stats = userDetail.userInfo?.stats;

    const metadata = {
      id: userInfo?.id,
      username: userInfo?.uniqueId,
      nama: userInfo?.nickname,
      avatar: userInfo?.avatarLarger,
      bio: userInfo?.signature,
      verifikasi: userInfo?.verified,
      totalfollowers: stats?.followerCount,
      totalmengikuti: stats?.followingCount,
      totaldisukai: stats?.heart,
      totalvideo: stats?.videoCount,
      totalteman: stats?.friendCount,
    };

    res.status(200).json(metadata);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
