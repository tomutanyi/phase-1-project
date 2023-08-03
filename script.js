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
                    <h4><b>${car.name}</b></h4> 
                    <p>${car.price}</p>
                    <p id = "carsleft${car.id}">${car.carsleft}</p>
                    <button id = "reserve${car.id}" class= "reserve">Reserve</button>
                </div>
            </div>
            `
            listcars.appendChild(li)

            let reserve = document.querySelector(`#reserve${car.id}`)
            let carsleft = document.querySelector(`#carsleft${car.id}`)
            reserve.addEventListener("click", ()=>
            {
                let remaining = parseInt(carsleft.textContent)
                remaining = parseInt(remaining)-1
                carsleft.innerText = `${remaining}`
            }) 
        }
    }

    function addcar()
    {
        fetch("http://localhost:3000/cars", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
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

    let carform = document.getElementById("carsubmit")
    carform.addEventListener("submit",function(event)
    {
        event.preventDefault()
        addcar()
        carform.reset() 
    })

})