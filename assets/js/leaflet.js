
Object.hasKey = function(obj,key){
  if(Object.keys(obj).indexOf(key) != -1)
    return true;
  else
    return false;
}

document.addEventListener('DOMContentLoaded',function(){

	// ------------------------------------------------------------------------------------------------------------------------------
	// DATA SETTINGS
	var arrCountries = [];
	var arrCountriesAvailable = [];
	var objContinents = {};
	var objCountries = {};
	var objMarkers = {};
	var objMap;

  var $map = document.querySelector('.mod_wem_locations_map');
  var $reset = document.querySelector('.mod_wem_locations_map .map__reset');
  var $content = document.querySelector('.mod_wem_locations_map .map__content');
  var $dropdowns = document.querySelector('.mod_wem_locations_map .map__dropdowns');

	objMapData.forEach(function(location,index){
		if(!Object.hasKey(objContinents, location.continent.code)){
		  objContinents[location.continent.code] = location.continent;
		  objContinents[location.continent.code].countries = {};
		}
		if(!Object.hasKey(objContinents[location.continent.code].countries, location.country.code)){
		  objContinents[location.continent.code].countries[location.country.code] = location.country;
		  objCountries[location.country.code] = location.country;
		  arrCountries.push(location.country.code);
		  arrCountriesAvailable.push(location.country.code);
		}
		objMarkers[location.aliasId]={
		  country: location.country.code,
		  continent: location.continent.code,
		  name: location.name,
		  latLng: L.latLng({lat: parseFloat(location.lat), lng: parseFloat(location.lng)})
		};
	});

	objMap = L.map(document.querySelector('.mod_wem_locations_map .map__container'));



	let objMapBounds = L.latLngBounds();
	for(let i in objMarkers) {
		objMapBounds.extend(objMarkers[i].latLng);

    let leafletMarker = L.marker(objMarkers[i].latLng,{
		  title: objMarkers[i].name,
      itemId: i,
		});

    leafletMarker.on('click', function(event) {
      let target = event.target.options.itemId;
      let element;
      /* remove active classes if any */
      if(document.querySelector(".map__content__item__active")) {
         document.querySelector(".map__content__item__active").classList.remove("map__content__item__active");
         document.querySelector(".map_content_wrapper").classList.remove(".item__is__active");
       }
      /* add active classes if found */
		  if(element = document.querySelector("[data-marker="+ target +"]")) {
        element.classList.add("map__content__item__active");
        if(!(document.querySelector(".map_content_wrapper").classList.contains(".item__is__active"))) {
          document.querySelector(".map_content_wrapper").classList.add(".item__is__active");
        }
      }
		});

    leafletMarker.addTo(objMap);
    objMarkers[i].marker = leafletMarker;
	}

  objMap.fitBounds(objMapBounds);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  minZoom: 1, maxZoom: 12 }).addTo(objMap);

	objMap.fitBounds(objMapBounds);

	//$map.appendChild($reset);
	//$map.appendChild($content);
	//$map.appendChild($dropdowns);
});
