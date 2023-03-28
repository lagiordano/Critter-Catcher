document.addEventListener("DOMContentLoaded", initialize) 

function initialize () {

    const ul = document.querySelector("#creature-list");
    const creatureButtons = document.querySelector("#creature-buttons");
    const dropDown = document.querySelector("#months");
    let newList = document.querySelector("#filtered-creature-list");
    let categoryObject = {};
    

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
            details.className = "collapsed";                
            details.innerHTML = populateInfoCard(creatureObject);
            ul.appendChild(details);

            // Toggle event listener to change styling when details are open
            details.addEventListener("toggle", () => {
                if (details.className === "collapsed") {
                    details.className = "expanded";
                } else {
                    details.className = "collapsed";
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
            timeAvailable =  `I'm only around from ${creatureObject["availability"]["time"]}`;
        };
        if (creatureObject["availability"]["month-array-southern"].length === 12) {
            monthAvailable = "You can find me any month of the year";
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
            })
            monthAvailable = newArr.toString();
        };
        return `
        <summary class="summary">${creatureObject["name"]["name-EUen"]}</summary>
        <img src="${creatureObject["icon_uri"]}">
        <p>${creatureObject["catch-phrase"]}</p>
        <p>Time available: ${timeAvailable}</p>
        <p>Months available: ${monthAvailable}</p>
        <p>Sale price: $${creatureObject["price"]}</p>
        <button class="addInfo">Add to your To-Catch list</button>
        `
    };



    // Filter by Month
    function filterList (categoryObject, selected) {
        let filtered = {};
        for (let item in categoryObject) {
            // console.log(item);
            creatureObject = {...categoryObject[item]};
            // console.log(creatureObject);
            let monthArray = creatureObject["availability"]["month-array-southern"];
            let monthString = monthArray.toString();
            if(monthString.indexOf(selected) !== -1) {
                filtered[item] = creatureObject;
            }
            
            
        };
        return filtered;
        
    }



    


    


    //Add and remove form wish list
    function wishListGenerator(e, details) {
        if (e.target.tagName === "BUTTON") {
            let div = document.createElement("div");
            let findContainer = document.querySelector("#find-container");
            div.className = "wishListCard";
            findContainer.appendChild(div);
            div.innerHTML = details.innerHTML;
            let addInfo = div.querySelector(".addInfo");
            addInfo.textContent = "Found!";
            addInfo.addEventListener("click", () => {
                addInfo.parentNode.remove();
            });
        };
    };







};