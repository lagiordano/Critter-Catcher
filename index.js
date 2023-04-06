document.addEventListener("DOMContentLoaded", initialize);

function initialize () {

    const ul = document.querySelector("#creature-list");
    const creatureButtons = document.querySelector("#creature-buttons");
    const dropDown = document.querySelector("#months");
    
    
    
    
    

    // Create list by category
    creatureButtons.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            ul.textContent = "";
            let type = e.target.textContent;
            initiateList(type);

        };

        let btnGroup = e.target.closest('.btn-group');
        let siblings = btnGroup.querySelectorAll("button");
        for (let sibling of siblings) {
            if (sibling === e.target) {
                sibling.classList.add("btn-selected");
                console.log("selected");
            } else {
                sibling.classList.remove("btn-selected");
                console.log("not selected");
            }
        }


        document.querySelector("form").reset();
    });
    

    // Fetch data and calls populateList function 
    function initiateList (type) {
        type = type.toLowerCase();
        fetch(`https://acnhapi.com/v1/${type}`)
        .then(res => res.json())
        .then(creatureData => {
            let categoryObject = {...creatureData};

        
            populateList(categoryObject);


            dropDown.addEventListener("change", () => {
                ul.textContent = "";
                let selected = dropDown.value;
                let filteredObject = filterList(categoryObject, selected);
                populateList(filteredObject);
            });

        })
        .catch( () => {
            alert("Sorry, there's been an issue loading those creatures!");
        });
        
        
    };

    
    // Populates list
    function populateList (categoryObject) {
        // console.log(categoryObject);
        for (let item in categoryObject) {
            let creatureObject = {...categoryObject[item]};

            // console.log(creatureObject);

            let creatureInfo = generateObject(creatureObject);

            // console.log(creatureInfo);

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
            

            // let card = querySelector("#grab-card");

            // console.log(card);

            // Toggle event listener to change styling when details are open
            details.addEventListener("toggle", () => {
                if (details.classList.contains("collapsed")) {
                    details.classList.replace("collapsed", "expanded");
                } else {
                    details.classList.replace("expanded", "collapsed");
                };
            });

            // // Wish list 

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

        // create object holding creature data for card

        let creatureInfo = {
            name: creatureObject["name"]["name-EUen"],
            imageURL: creatureObject["icon_uri"],
            price: creatureObject["price"],
            month: monthAvailable,
            time: timeAvailable
        };

        return creatureInfo;

    };



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
            image.style.width = "50%";
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


       

    //     return `
    //     <summary class="summary text-capitalize pb-2">${creatureObject["name"]["name-EUen"]}</summary>
    //         <div class=" card-deck d-flex justify-content-center">
    //             <div id="card-sizes" class="card col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7">
    //                 <div class="card-img-top d-flex justify-content-center">
    //                     <img src="${creatureObject["icon_uri"]}">
    //                 </div>
    //                 <div class="card-body">
    //                     <h4 class="card-title text-center">${creatureObject["name"]["name-EUen"].toUpperCase()}</h4>
    //                     <p class="card-text text-center">Months: ${monthAvailable}</p>
    //                     <p class="card-text text-center">Times: ${timeAvailable}</p>
    //                     <p class="card-text text-center">Sells for: $${creatureObject["price"]}</p>
    //                     <div class="d-flex justify-content-center">
    //                         <button class="btn btn-outline-success align-items-center addInfo mx-1 mx-md-2 mx-lg-3 list-btn" >Add to List</button>
    //                         <button class="btn btn-success align-items-center mx-md-2 mx-lg-3 to-list"><a class="text-decoration-none text-white" href="#heading1">Go to List</a></button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>        
    //     `
    //     "col-12", "col-sm-11", "col-md-9", "col-lg-8", "col-xl-7"
    // };



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
    function wishListGenerator(e, creatureInfo) {
        

        if (e.target.id === "add-card-btn") {
            let addBtn = e.target;
            addBtn.disabled = true;

            document.querySelector("#empty-list").style.display = "none";

            let findContainer = document.querySelector("#find-container");
            
            // findContainer.classList.add("card-deck");

            let div = document.createElement("div");
            div.classList.add("col", "d-flex", "justify-content-center");
            div.innerHTML = renderCard(creatureInfo);
            console.log(div);
            let card = div.querySelector(".card");
            card.classList.remove("col-sm-10", "col-md-9", "col-lg-8", "col-xl-7");
            card.classList.add("mb-3", "mb-md-4", "mb-lg-5");
            findContainer.appendChild(div);


            let foundDiv = document.createElement("div");
            let foundBtn = document.createElement("button");
            foundDiv.classList.add("d-flex", "justify-content-center", "p-3");
            foundBtn.classList.add("btn", "btn-outline-success", "align-items-center", "mx-1", "mx-md-2", "mx-lg-3");
            foundBtn.textContent = "Found!";
            foundDiv.appendChild(foundBtn);
            card.appendChild(foundDiv);
            
            foundBtn.addEventListener("click", () => {
                div.remove();
                addBtn.disabled = false;
            })
            
            
        }

        // if (e.target.classList.contains("list-btn")) {
        //    
        //     catchCard.classList.add("card", "col-10", "col-md-6", "col-lg-4");
        //     catchCard.removeChild(catchCard.firstElementChild);
        //     findContainer.appendChild(catchCard);
        //     catchCard.querySelector("#card-sizes").classList.remove("card", "col-11", "col-sm-10", "col-md-9", "col-lg-8", "col-xl-7");
        //     catchCard.querySelector(".to-list").remove();
        //     catchCard.querySelector(".list-btn").classList.replace("addInfo", "found-btn");
        //     let foundButton = catchCard.querySelector(".found-btn");
        //     foundButton.textContent = "Found!";
        //     foundButton.addEventListener("click", () => {
        //         catchCard.remove();
        //         e.target.disabled = false;
        //     });
        // };
    };







};