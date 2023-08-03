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
            let remaining = (car.carsleft)
            let li = document.createElement('div')
            li.innerHTML=
            `
            <div class="card">
                <img src="${car.picture}" alt="Avatar" style="width:100%">
                <div class="container">
                    <h4><b>${car.name}</b></h4> 
                    <p>${car.price}</p>
                    <p id"carsleft">${car.carsleft}</p>
                    <button id = "reserve" class= "reserve">Reserve</button>
                </div>
            </div>
            `
            listcars.appendChild(li)
            let reserve = document.getElementById("reserve")
            let carsleft = document.getElementById("carsleft")
            reserve.addEventListener("click", ()=>
            {
                remaining--
                carsleft.innerText = `${remaining}`

            }) 
        }
    }

})