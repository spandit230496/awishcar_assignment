const dates = Object.keys(data.near_earth_objects)
          .map((date) => new Date(date))
          .sort((a, b) => a - b) // Sort dates in ascending order
          .map((date) => date.toISOString().split("T")[0]);
        console.log(dates);

        const asteroidCount = [];
        let fastestAsteroid = [];
        let closestAsteroid = [];
        let avgSizeOfAsteroid = [];

        dates.forEach((date) => {
          // getting the count of asteroids on a date
          let count = data.near_earth_objects[date].length;
          asteroidCount.push(count);

          data.near_earth_objects[date].map((val) => {
            console.log("total----->", val);
            //closest astroid
            const distance = val;
            closestAsteroid.push(distance);
            closestAsteroid.sort(
              (a, b) =>
                a.close_approach_data[0].miss_distance.kilometers -
                b.close_approach_data[0].miss_distance.kilometers
            );
            console.log(closestAsteroid);
            //average size of asteroids
            const size =
              val.estimated_diameter.kilometers.estimated_diameter_max;
            console.log(size);
            avgSizeOfAsteroid.push(size);

            //sort according to km/hr
            fastestAsteroid.push(val.close_approach_data[0]);
            fastestAsteroid.sort(
              (a, b) =>
                b.relative_velocity.kilometers_per_hour -
                a.relative_velocity.kilometers_per_hour
            );
          });

          const avgsize = avgSizeOfAsteroid.reduce(
            (acc, current) => acc + current,
            0
          );
          console.log((avgsize / avgSizeOfAsteroid.length).toFixed(2));
          setData({
            closest: closestAsteroid[0],
            fastest: fastestAsteroid[0],
            average: avgsize / closestAsteroid.length,
          });
        });

        console.log(fastestAsteroid);
        console.log(asteroidCount);
        setChart({
          labels: dates,
          datasets: [
            {
              label: "Number of asteroids",
              data: asteroidCount,
              fill: true,
              borderColor: "red",
              backgroundColor:[ "red","green","blue","black","yellow","white","orange","violet"]
            },
          ],
        });
        setLoading(false);