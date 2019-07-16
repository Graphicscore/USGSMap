var USGS_TimeSpan = {
    PAST_HOUR: 1,
    PAST_DAY: 2,
    PAST_SEVEN_DAYS: 3,
    PAST_THIRTY_DAYS: 4,
    properties: {
        1: { code: "hour" },
        2: { code: "day" },
        3: { code: "week" },
        4: { code: "month" }
    }
};

var USGS_Intensity = {
    ALL: 1,
    M1: 2, //More than Magnitute 1.0
    M2_5: 3, //More than Magnitute 2.5
    M4_5: 4, //More than Magnitute 4.0 
    SIGNIFICANT: 5,
    properties: {
        1: { code: "all" },
        2: { code: "1.0" },
        3: { code: "2.5" },
        4: { code: "4.5" },
        5: { code: "significant" }
    }
}

function requestUSGSData(usgs_timespan, usgs_intensity, onSuccess, onError) {
    var timespan = USGS_TimeSpan.properties[usgs_timespan].code;
    var intensity = USGS_Intensity.properties[usgs_intensity].code;
    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" + intensity + "_" + timespan + ".geojson";

    console.log("url : " + url);

    superagent.get(url)
        .then(onSuccess)
        .catch(onError);
}