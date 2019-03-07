'use strict';
const GPS = require('gps');
require('mongoose');
const Spot = require('../models/spot');
//https://stackoverflow.com/questions/30273993/javascript-best-way-to-structure-helpers-functions-in-nodejs
// so lotRoutes for how to import functions
const distance = GPS.Distance(45.5, 75.56, 40.71, 74);  // Montreal to N.Y
const ACCEPTABLE_RANGE = 1; // 1 kilometer

const get_remainingSpots = (spots, closest, cheapest) => {
    // check if parking space is within acceptable distance
    const spots_remaining = [];
    for(let i=0; i<spots.length; i++) {
        if (spots[i]._id !== closest._id && spots[i]._id !== cheapest._id) {
            spots_remaining.push(spots[i]);
        }
    }
    return spots_remaining;
};

const reduceLists = (list1, list2) => {
    let toggle = 1;
    while (true) {
        if (toggle % 2 !== 0) {
            if (list1.length === 1) {
                return list1[0];
            }
            toggle += 1;
            list2 = [];
            let j = 0;
            if (list1.length % 2 !== 0) {
                list2.push(list1[0]);
                j = 1;
            }
            for (j; j < list1.length -1; j += 2) {
                list2.push(best(list1[j], list1[j+1]));
            }
        } else {
            // toggle is even, reset list1 empty and reduce list2
            if (list2.length === 1) {
                return list2[0];
            }
            toggle += 1;
            list1 = [];
            let g = 0;
            if (list2.length % 2 !== 0) {
                list1.push(list2[0]);
                g = 1;
            }
            for (g; g < list2.length -1; g += 2) {
                list1.push(best(list2[g], list2[g+1]));
            }
        }
    }
};

const best = (spot1, spot2) => {
    // check if parking space is within acceptable distance
    //let price_diff = spot1.price
    const clearWinner = clear_winner(spot1, spot2);
    if (clearWinner.clear) {
        return clearWinner.spot;
    }
    return winner(spot1, spot2)


};

// clear winner if closer and cheaper
const clear_winner = (spot1, spot2) => {
    if(spot1.distance < spot2.distance && spot1.price < spot2.price) {
        return {
            clear: true,
            spot: spot1
        };
    } else if (spot1.distance > spot2.distance && spot1.price > spot2.price) {
        return {
            clear: true,
            spot: spot2
        };
    } else {
        return { clear: false };
    }
};

const winner = (spot1, spot2) => {
    const price = percentDifference(spot1.price, spot2.price);
    const distance = percentDifference(spot1.distance, spot2.distance);
    if (price > distance) { // make decision based on price
        return spot1.price < spot2.price ? spot1 : spot2;
    } else {  // make decision based on distance
        return spot1.distance < spot2.distance ? spot1 : spot2;
    }
};

const percentDifference = (first, second) => {
    let avg = (first + second)/2;
    return Math.abs(first - second)/avg;
};

module.exports = {
    closestParking: (user_lat, user_long, spots) => {  // todo if isWithinRange() ..
        let closest = spots[0];
        //console.log(`closest: ${closest}`);
        //let min = Infinity;
        let old_distance = GPS.Distance(user_lat, user_long, closest.latitude, closest.longitude);
        //console.log(`old_distanceP: ${old_distance}`);
        Object.keys(spots).forEach(key => {
            let spot = spots[key];
            const new_distance = GPS.Distance(user_lat, user_long, spot.latitude, spot.longitude);
            //console.log(`spot: ${spot._id} distance: ${new_distance}`);
            if(new_distance < old_distance){
                closest = spot;
                old_distance = new_distance;
            }
        }); // Object.keys
        let closest_distance = old_distance;
        //console.log(`closest: ${closest}`);
        return {closest, closest_distance };
    },
    cheapestParking: (spots) => {  // todo if isWithinRange() ..
        spots = Object.values(spots);
        //console.log(`spots type: ${typeof spots} spots: ${spots}`);
        let cheapest = spots[0];
        let old_price  = cheapest.price_minute;
        Object.keys(spots).forEach(key => {
            let spot = spots[key];
            const new_price = spot.price_minute;
            if (new_price < old_price) {
                cheapest = spot;
                old_price = new_price;
            }
        });
        return cheapest;
    },

    bestParking: (lat, long, cheapest, closest, spots) => {
        // get only the spots not including cheapest, closest
        const spots_remaining = get_remainingSpots(spots, cheapest, closest);
        // if there's only 1 return it
        if (spots_remaining.length === 1) {
            return spots_remaining[0];
        } else if (spots_remaining.length === 0){
          return cheapest;
        }
        let list1 = [];
        for (let i = 0; i < spots_remaining.length; i++) {
            let dist = GPS.Distance(lat, long, spots_remaining[i].latitude, spots_remaining[i].longitude);
            list1.push({
                spot: spots_remaining[i],
                price: spots_remaining[i].price_minute,
                distance: dist
            });
        }
        let list2 = [];
        const winner = reduceLists(list1, list2);
        return winner.spot;

    }
};