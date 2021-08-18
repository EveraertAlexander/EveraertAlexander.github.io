"use strict";
let map;
let issIcon;
let marker;
let prevMarker;
let coords;

let astronauts;
const baseURI = "http://api.open-notify.org";

let htmlCounter,
  htmlSpacepeople,
  htmlGeoLocation,
  htmlCenterButton,
  htmlExpandCheckbox,
  htmlExpandButton;
let SpacePeopleHeight;

//#region ***  DOM references ***
const getDOMElements = () => {
  htmlCounter = document.querySelector(".js-counter");
  htmlSpacepeople = document.querySelector(".js-spacepepole");
  htmlGeoLocation = document.querySelector(".js-geolocation");
  htmlCenterButton = document.querySelector(".js-center-button");
  htmlExpandCheckbox = document.querySelector(".js-expand-checkbox");
  htmlExpandButton = document.querySelector(".js-expand-button");
};

//#endregion

const createMap = () => {
  const view = [25, 10.5];
  map = L.map("issmap").setView(view, 3);

  // L.tileLayer(
  //   "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  //   {
  //     maxZoom: 20,
  //     attribution:
  //       '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  //   }
  // ).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  listenToClickCenterButton();
};

//#region ***  Callback-Visualisation - show___ ***
const showAstronauts = (jsonObject) => {
  if (jsonObject.number) {
    htmlCounter.innerHTML = `${jsonObject.number} People`;
  }

  let htmlString = "";
  astronauts = jsonObject.people;
  if (astronauts) {
    astronauts.map((a) => {
      htmlString += `<section class="c-spaceman">
                        <h3 class="c-spaceman__name">${a.name}</h3>
                        <span class="c-spaceman__desc">Aboard ${a.craft}</span>
                    </section>`;
    });
  }

  htmlSpacepeople.innerHTML = htmlString;

  //Save max height in CSS variable for smooth transition timing
  htmlSpacepeople.classList.remove("c-spacepeople--collapsed");
  const elementHeight = htmlSpacepeople.clientHeight;
  if (elementHeight >= 128) {
    showExpandBtn();
  }
  document.documentElement.style.setProperty(
    "--global-spacePeople-maxheight",
    `${elementHeight}px`
  );
  htmlSpacepeople.classList.add("c-spacepeople--collapsed");
  listenToWindowResize();
};



const showExpandBtn = () => {
  htmlExpandButton.classList.remove("c-btn-expand--invisible");
  listenToClickExpandBtn();
};



const showIssLocation = (jsonObject) => {
  if (jsonObject.message == "success") {
    const lat = jsonObject.iss_position.latitude;
    const lon = jsonObject.iss_position.longitude;

    if (!coords) {
      coords = [lat, lon];
      centerMap();
    }
    coords = [lat, lon];
    getCountryInformation(lat, lon);
    placeMarker(lat, lon, issIcon);
  }

  if (astronauts) {
    showPopup(astronauts);
  }
};

const showCountryInformation = (jsonObject) => {
  if (jsonObject.address) {
    htmlGeoLocation.innerHTML = `The International Space Station is currently above ${jsonObject.address.country}`;
  } else {
    htmlGeoLocation.innerHTML = `The International Space Station is currently zooming above the ocean`;
  }
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***

const apiError = (errMsg) => {
  console.log(errMsg);
};

//#endregion

//#region ***  Data Access - get___ ***

const getAstronauts = () => {
  handleData(`${baseURI}/astros.json`, showAstronauts, apiError);
};

const getIssLocation = () => {
  handleData(`${baseURI}/iss-now.json`, showIssLocation, apiError);
};

const getCountryInformation = (lat, lon) => {
  handleData(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`,
    showCountryInformation,
    apiError
  );
};

//#endregion

const placeMarker = (lat, lon, icon) => {
  if (marker) {
    var newLatLng = new L.LatLng(lat, lon);
    marker.setLatLng(newLatLng);
  } else {
    marker = L.marker([lat, lon], { icon: icon }).addTo(map);
  }
};

const showPopup = (astronauts) => {
  if (marker) {
    let namesHtml = "";
    astronauts.map((a) => {
      if (a.craft == "ISS") {
        namesHtml += `<li class="c-popup__listitem">${a.name}</li>`;
      }
    });

    marker.bindPopup(
      `
                        <p class="c-popup__title">Astronauts aboard ISS</p>
                        <ul class="c-popup__list">
                          ${namesHtml}
                        </ul>
                      `,
      { className: "c-popup" }
    );
  }
};

const centerMap = () => {
  map.panTo([coords[0], coords[1]]);
};

const createIcon = () => {
  issIcon = L.icon({
    iconUrl: "../img/space-station.png",
    shadowUrl: "../img/space-station-shadow.png",

    iconSize: [50, 50], // size of the icon
    shadowSize: [30, 30],
    shadowAnchor: [5, 0],
    popupAnchor: [0, -25],
    iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
  });
};

//#region *** Event Handlers ***
const handleExpandBtn = () => {
  htmlExpandCheckbox.checked
    ? htmlSpacepeople.classList.remove("c-spacepeople--collapsed")
    : htmlSpacepeople.classList.add("c-spacepeople--collapsed");
};

const handleWindowResize = () => {
  
  //Function to get a new maxHeight value for the SpacePeople DOM element when it's not collapsed, 
  //so the transition is still smooth and not buggy when the window is resized

  let collapsed = false;
  if(htmlSpacepeople.classList.contains('c-spacepeople--collapsed')){
    collapsed = true;
    htmlSpacepeople.classList.remove('c-spacepeople--collapsed');
  } 

  document.documentElement.style.setProperty(
    "--global-spacePeople-maxheight",
    `none`
  );

  const elementHeight = htmlSpacepeople.clientHeight;

  document.documentElement.style.setProperty(
    "--global-spacePeople-maxheight",
    `${elementHeight}px`
  );

  if(collapsed) htmlSpacepeople.classList.add('c-spacepeople--collapsed');
}

//#endregion

//#region ***  Event Listeners - listenTo___ ***
const listenToClickCenterButton = () => {
  htmlCenterButton.addEventListener("click", centerMap);
};

const listenToClickExpandBtn = () => {
  htmlExpandCheckbox.addEventListener("change", handleExpandBtn);
};

const listenToWindowResize = () => {
  window.addEventListener('resize', handleWindowResize);
}


//#endregion

//#region ***  INIT / DOMContentLoaded  ***
const init = () => {
  getDOMElements();
  getAstronauts();
  getIssLocation();
  setInterval(() => {
    getIssLocation();
  }, 5000);

  createMap();
  createIcon();
};
//#endregion

document.addEventListener("DOMContentLoaded", init);
