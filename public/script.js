// DOM
const iconSwarzedz = document.querySelector("#iconSwarzedz");
const iconSroda = document.querySelector("#iconSroda");
const iconWroclaw = document.querySelector("#iconWroclaw");
const lastUpdate = document.querySelector("#lastUpdate");
// console.log({ iconSwarzedz, iconSroda, iconWroclaw, lastUpdate });

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
// console.log({ tooltipTriggerList, tooltipList, bootstrap });

// Time offset in seconds
const timeOffset = (time_1, time_2) => {
  if (time_2 === undefined) {
    return "black";
  }
  const offset = (new Date(time_1) - new Date(time_2)) / 1000;
  // console.log("new Date(time_1):", new Date(time_1));
  // console.log("new Date(time_2):", new Date(time_2));
  // console.log({ offset });
  if (offset < 121) {
    return "green";
  } else if (offset >= 121 && offset < 241) {
    return "yellow";
  } else {
    return "red";
  }
};

// Fetching the API
const fetchApi = () => {
  fetch("/api")
    .then((response) => response.json())
    .then((data) => {
      // console.log({ data });

      const timeNow = Date.now();
      // console.log({ timeNow });
      const inOneHour = timeNow + 3601 * 1000;
      // console.log({ inOneHour });
      const inOneHourString = new Date(inOneHour).toUTCString();
      // console.log({ inOneHourString });

      const SwarzedzTimes = data.timesObject.TC_Swarzedz.filter((time) => time !== "No Data");
      const SrodaTimes = data.timesObject.TC_Sroda.filter((time) => time !== "No Data");
      const WroclawTimes = data.timesObject.GPS_Wroclaw.filter((time) => time !== "No Data");
      // console.log({ SwarzedzTimes, SrodaTimes, WroclawTimes });

      const SwarzedzLastTime = SwarzedzTimes.at(-1);
      const SrodaLastTime = SrodaTimes.at(-1);
      const WroclawLastTime = WroclawTimes.at(-1);
      // console.log({ SwarzedzLastTime, SrodaLastTime, WroclawLastTime });
      const SwarzedzOffset = timeOffset(inOneHourString, SwarzedzLastTime);
      const SrodaOffset = timeOffset(inOneHourString, SrodaLastTime);
      const WroclawOffset = timeOffset(inOneHourString, WroclawLastTime);
      // console.log({ SwarzedzOffset, SrodaOffset, WroclawOffset });

      iconSwarzedz.style.fill = SwarzedzOffset;
      iconSroda.style.fill = SrodaOffset;
      iconWroclaw.style.fill = WroclawOffset;
      lastUpdate.style.color = "gray";
      lastUpdate.innerText = new Date(timeNow).toLocaleString();
      setTimeout(function () {
        lastUpdate.style.color = "black";
      }, 250);
    });
};

function updateData() {
  // console.log("Now is:", new Date().toLocaleString());
  fetchApi();
}

window.onload = () => {
  setTimeout(fetchApi, 1000);

  setTimeout(function () {
    setInterval(updateData, 60000);
  }, 1000);
};
