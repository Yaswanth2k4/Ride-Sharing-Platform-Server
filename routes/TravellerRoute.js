import express from "express"
import locations from "../locations.js"

const router = express.Router()


//Map containing pickup address and corresponding destinations array
const locationMap = {}

locations.forEach(location => {
    const pickup = location.pickup
    const destinations = location.destinations
    

    locationMap[pickup] = destinations
});

function rideAvailable(pickup, dropping) //Checking if the ride is available
{
    if(locationMap[pickup])
    {
        const destinations = locationMap[pickup]
        for( var i=0; i<destinations.length; i++)
        {
            if(destinations[i].drop === dropping && destinations[i].available)
            {
                destinations[i].available = false; //if available, the ride will be booked
                console.log(destinations[i])
                return true;
            }
        }
        return false;
    }
    return false;
}

router.get("/req-ride", async(req, res)=>{
    const {pickup, dropping} = req.body;

    var message = "Ride available"

    if(rideAvailable(pickup, dropping) === false)
    {
        message = "Ride unavailable"
    }
    res.json({"message" : message})
})

router.post("/ride-complete", async(req, res)=>{
    const {pickup, dropping} = req.body

})

export {router as TravellerRoute}

