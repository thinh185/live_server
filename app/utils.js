const moment = require('moment-timezone');
let mp4FilePath = '';
const bcrypt = require('bcrypt');
const saltRounds = 10;

const rootMedia = '../media'

const getMp4FilePath = () => {
  return mp4FilePath;
};

const setMp4FilePath = path => {
  mp4FilePath = path;
};

const getCurrentDateTime = () => {
  const a = moment().tz('Asia/Ho_Chi_Minh');
  const currentDateTime = a.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return currentDateTime;
};

const formResponse = (code , data) => {
  return { code, result: { data } }
}

const encryptPw = async (pw) => {
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(pw, salt)
}

const checkPw = async (pw, hash) => {
  return await bcrypt.compare(pw, hash)
}

const getLastestVideo = async (folder) => {
  var files = fs.readdirSync(dir);
  files.sort((a, b) => {
    return fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime();
  });
  return files[0]
}

module.exports = {
  getMp4FilePath,
  setMp4FilePath,
  getCurrentDateTime,
  formResponse,
  encryptPw,
  checkPw,
  getLastestVideo,
};
