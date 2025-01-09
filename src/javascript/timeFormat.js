const formatDate = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Marc",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agus",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ];

  let day = date.getDate().toString().padStart(2, "0");
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  // let second = date.getSecond().toString();
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let hours = date.getHours().toString().padStart(2, "0");

  let formattedDate = `${day} ${month} ${year} ${hours}:${minutes} WIB`;
  return formattedDate;
};

const getRelativeTime = (targetDate) => {
  let now = new Date();
  let diffInSeconds = Math.floor((now - targetDate) / 1000);
  let diffInMinutes = Math.floor(diffInSeconds / 60);
  let diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} Seconds Ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} Minutes Ago`;
  } else if (diffInHours < 60) {
    return `${diffInHours} Hours Ago`;
  }
};

const getUpdateTimes = (created, updated) => {
  let now = new Date();
  let dateCreated = created.getDate() + created.getTime();
  let dateUpdated = updated.getDate() + updated.getTime();

  const secondsCreated = Math.floor((now - created) / 1000);
  const minutesCreated = Math.floor(secondsCreated / 60);
  const hoursCreated = Math.floor(minutesCreated / 60);

  const secondsUpdated = Math.floor((now - updated) / 1000);
  const minutesUpdated = Math.floor(secondsUpdated / 60);
  const hoursUpdated = Math.floor(minutesCreated / 60);

  if (dateCreated == dateUpdated) {
    if (secondsCreated < 60) {
      return `Post ${secondsCreated} Seconds Ago`;
    } else if (minutesCreated < 60) {
      return `Post ${minutesCreated} Minutes Ago`;
    } else if (hoursCreated < 60) {
      return `Post ${hoursCreated} Hours Ago`;
    }
  } else {
    if (secondsUpdated < 60) {
      return `Updated ${secondsUpdated} Seconds Ago`;
    } else if (minutesUpdated < 60) {
      return `Updated ${minutesUpdated} Minutes Ago`;
    } else if (hoursUpdated < 60) {
      return `Updated ${hoursUpdated} Hours Ago`;
    }
  }
  console.log(hoursCreated, minutesCreated, secondsCreated);
};

const formatDuration = (start, end) => {
  let dateStart = new Date(start.replaceAll("-", "/"));
  let dateend = new Date(end.replaceAll("-", "/"));

  let duration =
    dateend.getMonth() -
    dateStart.getMonth() +
    12 * (dateend.getFullYear() - dateStart.getFullYear());

  return duration;
};

const formatText = (text) => {
  let max = 70;

  if (text.length > max) {
    return `${text.substring(0, max)}...`;
  } else {
    return text;
  }
};
const formatTextT = (text) => {
  let max = 25;

  if (text.length > max) {
    return `${text.substring(0, max)}...`;
  } else {
    return text;
  }
};

module.exports = {
  formatDate,
  getRelativeTime,
  formatDuration,
  getUpdateTimes,
  formatText,
  formatTextT,
};
