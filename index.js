document.addEventListener("DOMContentLoaded", initialize) 

function initialize () {

    const ul = document.querySelector("#creature-list");
    const creatureButtons = document.querySelector("#creature-buttons");
    const dropDown = document.querySelector("#months");
    let categoryObject ={};
    
    
    

    // Create list by category
    creatureButtons.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            ul.textContent = "";
            let type = e.target.textContent;
            initiateList(type);

        };
        document.querySelector("form").reset();
    });
    

    // Fetch data and calls populateList function 
    function initiateList (creature) {
        let type = creature.toLowerCase();
        fetch(`http://acnhapi.com/v1/${type}`)
        .then(res => res.json())
        .then(creatureData => {
            categoryObject = {...creatureData};

           

            populateList(categoryObject);


            dropDown.addEventListener("change", () => {
                ul.textContent = "";
                let selected = dropDown.value;
                let filteredObject = filterList(categoryObject, selected);
                populateList(filteredObject);
            });

        });
        
        
    };

    
    // Populates list
    function populateList (categoryObject) {
        for (let item in categoryObject) {
            creatureObject = {...categoryObject[item]};
            

            let details = document.createElement("details");
            details.classList.add("collapsed", "list-group-item", "col-12", "col-sm-11", "col-md-9", "col-lg-8", "col-xl-7");  
            details.innerHTML = populateInfoCard(creatureObject);
            ul.appendChild(details);

            // Toggle event listener to change styling when details are open
            details.addEventListener("toggle", () => {
                if (details.classList.contains("collapsed")) {
                    details.classList.replace("collapsed", "expanded");
                } else {
                    details.classList.replace("expanded", "collapsed");
                };
            });

            // Wish list 
            details.addEventListener("click", (e) => {
                wishListGenerator(e, details);
            });

        };
    };



    function populateInfoCard (creatureObject) {
        let timeAvailable;
        let monthAvailable;
        if (creatureObject["availability"]["time"] === "") {
            timeAvailable = "I'm around all day";
        } else {
            timeAvailable =  `${creatureObject["availability"]["time"]}`;
        };
        if (creatureObject["availability"]["month-array-southern"].length === 12) {
            monthAvailable = "12 Months of the year!";
        } else {
            let monthArray = creatureObject["availability"]["month-array-southern"];
            let newArr = monthArray.map( (num) => {
                switch (num) {
                    case 1: 
                        return " January";
                    case 2:
                        return " February";
                    case 3: 
                        return " March";
                    case 4: 
                        return " April";
                    case 5: 
                        return " May";
                    case 6: 
                        return " June";
                    case 7: 
                        return " July";
                    case 8: 
                        return " August";
                    case 9:
                        return " September";
                    case 10: 
                        return " October";
                    case 11: 
                        return " November";
                    case 12: 
                        return " December";
                        break;
                };
            });
            monthAvailable = newArr.toString();
        };
        return `
        <summary class="summary text-capitalize pb-2">${creatureObject["name"]["name-EUen"]}</summary>
            <div class=" card-deck d-flex justify-content-center">
                <div id="card-sizes" class="card">
                    <div class="card-img-top d-flex justify-content-center">
                        <img src="${creatureObject["icon_uri"]}">
                    </div>
                    <div class="card-body">
                        <h4 class="card-title text-center">${creatureObject["name"]["name-EUen"].toUpperCase()}</h4>
                        <p class="card-text text-center">Months: ${monthAvailable}</p>
                        <p class="card-text text-center">Times: ${timeAvailable}</p>
                        <p class="card-text text-center">Sells for: $${creatureObject["price"]}</p>
                        <div class="d-flex justify-content-center">
                            <button class=" btn btn-outline-success align-items-center addInfo" >Add to Catch-List</button>
                        </div>
                    </div>
                </div>
            </div>        
        `
    };



    // Filter by Month
    function filterList (categoryObject, selected) {
        let filtered = {};
        selected = parseInt(selected, 10);
        for (let item in categoryObject) {
            creatureObject = {...categoryObject[item]};
            let monthArray = creatureObject["availability"]["month-array-southern"];
            if(monthArray.indexOf(selected) !== -1) {
                filtered[item] = creatureObject;
            };
        };
        return filtered;
    };


    //Add and remove form wish list
    function wishListGenerator(e, details) {
        if (e.target.tagName === "BUTTON") {
            let findContainer = document.querySelector("#find-container");
            findContainer.querySelector("p").style.display = "none";
            findContainer.classList.add("card-deck");
            let catchCard = document.createElement("div");
            catchCard.innerHTML = details.innerHTML;
            catchCard.classList.add("card", "col-12", "col-sm-11", "col-md-6", "col-lg-4")
            catchCard.removeChild(catchCard.firstElementChild);
            findContainer.appendChild(catchCard);
            catchCard.querySelector("#card-sizes").classList.remove("card", "col-12", "col-sm-11", "col-md-9", "col-lg-8", "col-xl-7");
            catchCard.querySelector("button").classList.replace("addInfo", "found-btn");
            let foundButton = catchCard.querySelector(".found-btn");
            foundButton.textContent = "Found!";
            foundButton.addEventListener("click", () => {
                catchCard.remove();
            });
        };
    };







};