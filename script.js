document.addEventListener("DOMContentLoaded", ()=>
{
    let listcars = document.getElementById("cars")


    fetch("http://localhost:3000/cars")
        .then(resp => resp.json())
        .then(data => displayCars(data))
        .catch(error => console.log(error))


    function displayCars(cars)
    {
        for (const car of cars)
        {
            let id = car.id
            let li = document.createElement('div')
            li.innerHTML=
            `
            <div class="card">
                <img src="${car.picture}" alt="Car Image" style="width:100%">
                <div class="container">
                    <p>Car ID: ${car.id}</p>
                    <h4><b>${car.name}</b></h4> 
                    <p>Daily Rental Price: KSh.${car.price}</p>
                    <h3>Available cars</h3>
                    <p id = "carsleft${car.id}">${car.carsleft}</p>
                    <button id = "reserve${car.id}" class= "reserve">Reserve</button>
                </div>
            </div>
            `
            listcars.appendChild(li)

            let reserve = document.querySelector(`#reserve${car.id}`)
            let carsleft = document.querySelector(`#carsleft${car.id}`)
            reserve.addEventListener("click", () => {
                let remaining = parseInt(carsleft.textContent);
                if (remaining > 0) {
                    remaining = parseInt(remaining) - 1;
                    carsleft.innerText = `${remaining}`;
                    updateCarsLeft(car.id, remaining);
                } else {
                    alert('No more cars available for reservation.');
                }
            });
            
            function updateCarsLeft(carId, newCarsLeft) {
                fetch(`http://localhost:3000/cars/${carId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        carsleft: newCarsLeft,
                    }),
                })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error));
            }
        }
    }

    function addcar()
    {
        fetch("http://localhost:3000/cars", 
        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify
            ({
                price:document.getElementById("prices").value,
                name:document.getElementById("carname").value,
                carsleft:document.getElementById("carsleft").value,
                color:document.getElementById("color").value,
                company:document.getElementById("company").value,
                picture:document.getElementById("picture").value
        })
        })
        .then(response=>response.json())
        .then(data=>console.log(data))
        .catch(error=>console.log(error))
    }

    // submit new car event listener
    let carform = document.getElementById("carsubmit")
    carform.addEventListener("submit",function(event)
    {
        event.preventDefault()
        addcar()
        carform.reset() 
    })
        // search function
        const search = document.getElementById("search");
        const searchButton = document.getElementById("searchButton");
        searchButton.addEventListener("click", () => {
            // adding toLowerCase is important since it means the user can type in whatever case they want
            const nameToBeSearched = search.value.toLowerCase();
            findCarName(nameToBeSearched);
        });

        // this is a function to search by car name.
        function findCarName(nameToBeSearched) 
        {
            // gets all the elements that match .card, which is where the car details are
            const allCarNames = document.querySelectorAll(".card");
            for (const carcard of allCarNames) 
            {
                //the h4 element content must also be in lowercase for them to match
                // the h4 element is the one with car names from the db.json file
                const carName = carcard.querySelector("h4").innerText.toLowerCase();
                //displays the car or cars whose name or part of a name match the searched name
                // for example if i search 'e' all car names with 'e' are shown
                if (carName.includes(nameToBeSearched)) 
                {
                    carcard.style.display = "inline-block";
                } 
                //displays nothing if the car being looked for isn't found
                else 
                {
                    carcard.style.display = "none";
                }
            }
        }
})