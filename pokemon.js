// Quantity of pokemons

const MAX_POKEMON = 151

// Pokemon's place

const listWrapper = document.querySelector('.list-wrapper')

// Input's place

const searchInput = document.querySelector('#search-input')

// Choice for the number

const numberFilter = document.querySelector('#number')

// Choice for the name

const nameFilter = document.querySelector('#name')

// Error Pokemon's place

const notFoundMessage = document.querySelector('#not-found-message')

// Initially, we start without pokemons

let allPokemons = []

// Onload, we make a research for the pokeapi.com

fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    // Storing the results for data.results in our array which was empty
    allPokemons = data.results
    // Calling the function to display the pokemons
    displayPokemons(allPokemons)
})

async function fetchPokemonDataBeforeRedirect(id){

    try {

        // Getting two values (json) for two researches in a Promise
         const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => 
            res.json()
         ),
         fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
            res.json()
         ),
        ])
        // Returning true, if everything is going to be good
        return true

    } catch (error){
        // Catching error
        console.log("Failed to fetch Pokemon data before redirect")
    }

}

function displayPokemons(pokemon){

    // Cleaning the listWrapper

    listWrapper.innerHTML = "";

    // Each pokemon will appear

    pokemon.forEach((pokemon) => {

        // ID is catched in the url
        const pokemonID = pokemon.url.split("/")[6]
        // An element is created, this is listItem which will contain basics information about the pokemon
        const listItem = document.createElement("div")
        // A class is used
        listItem.className = "list-item"
        // Inserting basics information (ID, img e name)
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `

        // If there's a click in listItem (pokemon), happen a call to another function
        listItem.addEventListener("click", async () => {

            // Storing in variable
            const success = await fetchPokemonDataBeforeRedirect(pokemonID)

            // If it's true
            if (success){
                // We'll be taken to another href with the id
                window.location.href = `./detail.html?id=${pokemonID}`
            }

        })

        // listWrapper catch your child -> pokemons with pokemon
        listWrapper.appendChild(listItem)

    })

}

// In "keyup", there's a call to the function handleSearch

searchInput.addEventListener("keyup", handleSearch)

function handleSearch(){

    // searchTerm is the value of the input in lowerCase()
    const searchTerm = searchInput.value.toLowerCase() 
    
    // An array empty to relate with the search
    let filteredPokemons

    // If the user choose "number"
    if (numberFilter.checked){

        // The array receive pokemons with start of this value of the input
        filteredPokemons = allPokemons.filter((pokemon) => {
         
            const pokemonID = pokemon.url.split("/")[6]

            return pokemonID.startsWith(searchTerm)

        })
    
    // If the user choose "name"
    } else if (nameFilter.checked){

        // The array receive pokemons with start of this value of the input
        filteredPokemons = allPokemons.filter((pokemon) => 
         
            pokemon.name.toLowerCase().startsWith(searchTerm)

        )

    } else {

        // The same value happen in filter and allPokemons
        filteredPokemons = allPokemons

    }

    // The display is made by parameter of the filter
    displayPokemons(filteredPokemons)

    if (filteredPokemons.length === 0){

        // If there's no pokemons with this searchTerm, the message appear
        notFoundMessage.style.display = 'block'

    } else {

        // Otherwise, the message don't appear
        notFoundMessage.style.display = 'none'

    }

}

// Closing the search
const closeButton = document.querySelector(".search-close-icon")

// In "click", there's a call to the clearSearch
closeButton.addEventListener("click", clearSearch)

function clearSearch(){

    // Cleaning the value
    searchInput.value = ""

    // Displaying all pokemons
    displayPokemons(allPokemons)

    // There's no reason to show "error", since we catch from api all these pokemons
    notFoundMessage.style.display = "none"

}