// this need to load before DOM
let darkbutton = document.getElementById("darkmode")
function red()
{
    darkbutton.style.color = "red"
}

function black()
{
    darkbutton.style.color = "black"
}

function dark()
{
    let page = document.body;
    // the classlist.toggle means that pressing the button will return it to light mode
    page.classList.toggle("dark-mode");
}

// this ensures the Javascript is loaded after the HTML
document.addEventListener("DOMContentLoaded", ()=>
{
    let listcars = document.getElementById("cars")


    // fetching the data from the db.json file and displaying it on the webpage
    fetch("https://rush-car-rental.onrender.com/cars")
        .then(resp => resp.json())
        .then(data => displayCars(data))
        .catch(error => console.log(error))


    // the function to display each car and it's relevant info on a separate card as well as a 'reserve' button
    // editing any part of line 32 results in the reserve button failing because the content of the p tag is all treated as one number.
    // for example adding a 1 would add a 1 in front of every car.carsleft in the db.json file.
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

            //this is the function to subtract one car from carsleft after somebody clicks the reserve button on each card.
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
            
            // the PATCH request to edit the number of cars left for a particular car
            function updateCarsLeft(carId, newCarsLeft) {
                fetch(`https://rush-car-rental.onrender.com/cars/${carId}`, {
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

    // a function to add a car with all the relevant details
    function addcar()
    {
        fetch("https://rush-car-rental.onrender.com/cars", 
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

        const search = document.getElementById("search");
        const searchButton = document.getElementById("searchButton");
        searchButton.addEventListener("click", () => 
        {
            // adding toLowerCase is important since it means the user can type in whatever case they want
            const nameToBeSearched = search.value.toLowerCase();
            findCarName(nameToBeSearched);
        });

        // this is a function to search by car name regardless of the case being used.
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
                // .includes() is a built in value that checks whether a specified value exists in the targeted string
                // it is case sensitive
                if (carName.includes(nameToBeSearched)) 
                {
                    //this shows the card as an inline-block it is the most pleasant looking
                    carcard.style.display = "inline-block";
                } 
                //displays nothing if the car being looked for isn't found
                else 
                {
                    carcard.style.display = "none";
                }
            }
        }

        //a function to delete a car by it's ID, which is visible on the webpage
        function deleteOneCar(id) {
            // The DELETE method
            fetch(`https://rush-car-rental.onrender.com/cars/${id}`, {
              method: "DELETE"
            })
              .then(response => console.log(response.status))
              .catch(error => console.log(error));
          }
          // prompts the user to enter a car ID for the car to be deleted
          let deletecar = document.getElementById("deletecar")
          deletecar.addEventListener("click", () => {
            //if an invalid ID is entered, 
              let idToBeDeleted = prompt("Please enter an ID of a car to delete it")
              // this is to ensure that as long as a user enters "yes" in any case, the input is 
              //still used since it is the same as line 150
              let areYouSure = prompt("This action is permanent. If you would like to proceed, enter: Yes").toLowerCase()
              {
                if (areYouSure === "yes")
                {
                    deleteOneCar(idToBeDeleted)
                }
                // in case of a user entering anything other than the letters: 'y' , 'e' & 's' in that order
                // in upper or lower case, the operation is canceled.
                else
                {
                    alert('You have canceled this operation')
                }


              }



              
              
          });


})