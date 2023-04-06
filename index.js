document.addEventListener("DOMContentLoaded", initialize);

function initialize () {

    const ul = document.querySelector("#creature-list");
    const creatureButtons = document.querySelector("#creature-buttons");
    const dropDown = document.querySelector("#months");
    const searchbox = document.querySelector("#searchbox");
    const months = document.querySelector("#months");
    months.disabled = true;
    searchbox.disabled = true;
    searchbox.setAttribute("placeholder", "Pick a category before filtering...");
    let fish;
    let sea;
    let bugs;
    
    
    // Fetch requests for three creature types 
    fetch(`https://acnhapi.com/v1/fish`)
    .then(res => res.json())
    .then(fishData => {
        fish = {...fishData};
    })
    .catch( () => {
        alert("Sorry, there's been an issue loading the creatures for you!");
    });

    
    fetch(`https://acnhapi.com/v1/sea`)
    .then(res => res.json())
    .then(seaData => {
        sea = {...seaData};
    })
    .catch( () => {
        alert("Sorry, there's been an issue loading the creatures for you!");
    });


   
    fetch(`https://acnhapi.com/v1/bugs`)
    .then(res => res.json())
    .then(bugsData => {
        bugs = {...bugsData};
    })
    .catch( () => {
        alert("Sorry, there's been an issue loading the creatures for you!");
    });

    

    // Start building list from creature buttons
    creatureButtons.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            searchbox.disabled = false;
            months.disabled = false;
            searchbox.setAttribute("placeholder", "Search for a creature...")
            ul.textContent = "";
            let type = e.target.textContent;
            type = type.toLowerCase();

            if (type === "fish") {
                initiateList(fish);
            };

            if(type === "sea") {
                initiateList(sea);
            };

            if (type === "bugs")
                initiateList(bugs);

        };

        // Code to have button "selected"
        let btnGroup = e.target.closest('.btn-group');
        let siblings = btnGroup.querySelectorAll("button");
        for (let sibling of siblings) {
            if (sibling === e.target) {
                sibling.classList.add("btn-selected");
            } else {
                sibling.classList.remove("btn-selected");
            }
        }

        document.querySelector("form").reset();

        
    });


    
    

    // Populate list and add event listener for filter
    function initiateList (creaturesData) {
       
            populateList(creaturesData);


            dropDown.addEventListener("change", () => {
                ul.textContent = "";
                searchbox.value = "";
                let selected = dropDown.value;
                let filteredObject = filterList(creaturesData, selected);
                populateList(filteredObject);
            });


            //Search bar
            
            searchbox.addEventListener("input", (e) => {
                let items = document.querySelectorAll("details");
                let search = e.target.value.toLowerCase();
                items.forEach(item => {
                    const name = item.firstChild.textContent.toLowerCase();
                    const isVisible = name.includes(search);
                    item.classList.toggle("d-none", !isVisible);
                    
                });


            });
            
            
            

            
    };

    

    
    // Populates creature list
    function populateList (creaturesData) {
        for (let item in creaturesData) {
            let creatureObject = {...creaturesData[item]};

            let creatureInfo = generateObject(creatureObject);

            let details = document.createElement("details");
            details.classList.add("collapsed", "list-group-item", "col-12", "col-sm-11", "col-md-9", "col-lg-8", "col-xl-7");  
            
            let summary = document.createElement("summary");
            summary.textContent = creatureInfo.name;
            summary.classList.add("text-capitalize", "pb-2");

            let cardDiv = document.createElement("div");
            cardDiv.classList.add("card-deck", "d-flex", "justify-content-center");
            cardDiv.innerHTML = renderCard(creatureInfo)

            details.appendChild(summary);
            details.appendChild(cardDiv);
            ul.appendChild(details);


            // Add buttons to each creature <details>
            let buttonDiv = document.createElement("div");
            let addListBtn = document.createElement("button");
            let goToBtn = document.createElement("a");
            buttonDiv.appendChild(addListBtn);
            buttonDiv.appendChild(goToBtn);
            details.appendChild(buttonDiv);

            buttonDiv.classList.add("d-flex", "justify-content-center", "p-3");
            addListBtn.textContent = "Add To List";
            addListBtn.classList.add("btn", "btn-outline-success", "align-items-center", "mx-1", "mx-md-2", "mx-lg-3")
            addListBtn.id = "add-card-btn";
            goToBtn.setAttribute("href", "#heading1");
            goToBtn.textContent = "Go to List";
            goToBtn.classList.add("btn", "btn-success", "align-items-center", "mx-1", "mx-md-2", "mx-lg-3");
            

            // Toggle event listener to change styling when details are open
            details.addEventListener("toggle", () => {
                if (details.classList.contains("collapsed")) {
                    details.classList.replace("collapsed", "expanded");
                } else {
                    details.classList.replace("expanded", "collapsed");
                };
            });

            

            // // Wish list listener
            details.addEventListener("click", (e) => {
                wishListGenerator(e, creatureInfo);
            });

        };
    };



    function generateObject (creatureObject) {

        // Extract date and time data into readable info
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


        // Create object holding creature data for card
        let creatureInfo = {
            name: creatureObject["name"]["name-EUen"],
            imageURL: creatureObject["icon_uri"],
            price: creatureObject["price"],
            month: monthAvailable,
            time: timeAvailable
        };

        return creatureInfo;

    };


    // Render card info to be used by details and wish list

    function renderCard (creatureInfo) {

        const returnDiv = document.createElement("div");
        const div = document.createElement("div");
        const cardBody = document.createElement("div");
        const image = document.createElement("img");
        const name = document.createElement("h4");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const p3 = document.createElement("p");

        div.classList.add("card", "col-11", "col-sm-10", "col-md-9", "col-lg-8", "col-xl-7", "align-items-center");
        image.classList.add("card-img-top");
        cardBody.classList.add("card-body");
        
        name.classList.add("card-title", "text-center");
        p1.classList.add("card-text", "text-center");
        p2.classList.add("card-text", "text-center");
        p3.classList.add("card-text", "text-center");

        image.setAttribute("src", creatureInfo.imageURL);
        image.style.width = "45%";
        name.innerText = creatureInfo.name.toUpperCase();
        p1.innerText = `Months: ${creatureInfo.month}`;
        p2.innerText = `Times: ${creatureInfo.time}`;
        p3.innerText = `Sells for: $${creatureInfo.price}`

        cardBody.appendChild(name);
        cardBody.appendChild(p1);
        cardBody.appendChild(p2);
        cardBody.appendChild(p3);
        div.appendChild(image);
        div.appendChild(cardBody);
        returnDiv.appendChild(div);

        return returnDiv.innerHTML;
        
    };



    // Filter by Month
    function filterList (creaturesData, selected) {
        let filtered = {};
        selected = parseInt(selected, 10);
        for (let item in creaturesData) {
            creatureObject = {...creaturesData[item]};
            let monthArray = creatureObject["availability"]["month-array-southern"];
            if(monthArray.indexOf(selected) !== -1) {
                filtered[item] = creatureObject;
            };
        };
        return filtered;
    };




    //Add and remove form wish list
    function wishListGenerator(e, creatureInfo) {

        if (e.target.id === "add-card-btn") {
            let addBtn = e.target;
            addBtn.disabled = true;

            document.querySelector("#empty-list").style.display = "none";
            let findContainer = document.querySelector("#find-container");


            //Add card to wish list container
            let div = document.createElement("div");
            div.classList.add("col", "d-flex", "justify-content-center");
            div.innerHTML = renderCard(creatureInfo);
            let card = div.querySelector(".card");
            card.classList.remove("col-sm-10", "col-md-9", "col-lg-8", "col-xl-7");
            card.classList.add("mb-3", "mb-md-4", "mb-lg-5");
            findContainer.appendChild(div);


            // Found button
            let foundDiv = document.createElement("div");
            let foundBtn = document.createElement("button");
            foundDiv.classList.add("d-flex", "justify-content-center", "p-3");
            foundBtn.classList.add("btn", "btn-outline-success", "align-items-center", "mx-1", "mx-md-2", "mx-lg-3");
            foundBtn.textContent = "FOUND";
            foundDiv.appendChild(foundBtn);
            card.appendChild(foundDiv);
            
            foundBtn.addEventListener("click", () => {
                div.remove();
                addBtn.disabled = false;
            });
            
        };

    };







};