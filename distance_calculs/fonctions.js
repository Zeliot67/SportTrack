/**
 * Calcule la distance entre deux points GPS
 * @param {float} lat1 - Latitude du premier point GPS
 * @param {float} long1 - Longitude du premier point GPS
 * @param {float} lat2 - Latitude du second point GPS
 * @param {float} long2 - Longitude du second point GPS
 * @returns {float} La distance entre les deux points GPS
 */
function calculDistance2PointsGPS(lat1, long1, lat2, long2) {
  const r = 6378.137; // Earth's radius in km
  return (
    r *
    Math.acos(
      Math.sin(degreeToRadian(lat2)) * Math.sin(degreeToRadian(lat1)) +
        Math.cos(degreeToRadian(lat2)) *
          Math.cos(degreeToRadian(lat1)) *
          Math.cos(degreeToRadian(long2) - degreeToRadian(long1)),
    )
  );
}

/**
 * Conversion d'un angle de degrées en radians
 * @param {float} degree - L'angle en degrées
 * @returns {float} L'angle en radians
 */
function degreeToRadian(degree) {
  return (degree * Math.PI) / 180;
}

/**
 * Calcule la distance d'un parcours.
 * @param {Array} parcours - Un tableau contenant l'ensemble des points GPS du parcours.
 * @returns {float} La distance du parcours.
 */
function calculDistanceTrajet(parcours) {
  let distance = 0;
  for (let i = 0; i < parcours.length - 1; i++) {
    distance += calculDistance2PointsGPS(
      parcours[i].latitude,
      parcours[i].longitude,
      parcours[i + 1].latitude,
      parcours[i + 1].longitude,
    );
  }
  return distance;
}

const activity = {
  activity: {
    date: "01/09/2022",
    description: "IUT -> RU",
  },
  data: [
    {
      time: "13:00:00",
      cardio_frequency: 99,
      latitude: 47.644795,
      longitude: -2.776605,
      altitude: 18,
    },
    {
      time: "13:00:05",
      cardio_frequency: 100,
      latitude: 47.64687,
      longitude: -2.778911,
      altitude: 18,
    },
    {
      time: "13:00:10",
      cardio_frequency: 102,
      latitude: 47.646197,
      longitude: -2.78022,
      altitude: 18,
    },
    {
      time: "13:00:15",
      cardio_frequency: 100,
      latitude: 47.646992,
      longitude: -2.781068,
      altitude: 17,
    },
    {
      time: "13:00:20",
      cardio_frequency: 98,
      latitude: 47.647867,
      longitude: -2.781744,
      altitude: 16,
    },
    {
      time: "13:00:25",
      cardio_frequency: 103,
      latitude: 47.64851,
      longitude: -2.780145,
      altitude: 16,
    },
  ],
};

const result = calculDistanceTrajet(activity.data);

console.log(result);
