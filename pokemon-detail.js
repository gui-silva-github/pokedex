// There's a variable to handling with the pokemon solicited

let currentPokemonId = null

// Onload the DOMContent, there's is a conditional to verify the valid id for the pokemon

document.addEventListener("DOMContentLoaded", () =>{
    // Pokemon's limit
    const MAX_POKEMONS = 151
    // Pokemon's ID catched by params of the url
    const pokemonID = new URLSearchParams(window.location.search).get("id")
    // Pokemon's parse ID
    const id = parseInt(pokemonID, 10)

    // Conditional of the limits
    if (id < 1 || id > MAX_POKEMONS){

        return (window.location.href = "./index.html")

    }

    // id equals to currentPokemonId
    currentPokemonId = id
    // calling the function loadPokemon
    loadPokemon(id)
})

async function loadPokemon(id){

    try{

        // Getting two values (json) for two researches in a Promise
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => 
            res.json()
         ),
         fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
            res.json()
         ),
        ])

        // Hability Area
        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move")

        // Cleaning the hability area
        abilitiesWrapper.innerHTML = ""

        // Verifying if the currentPokemonId is equals to the id of the parameter's function
        if (currentPokemonId === id){
            // calling another function
            displayPokemonDetails(pokemon)

            // Correcting text in English
            const flavorText = getEnglishFlavorText(pokemonSpecies)
            // Inserting correct text
            document.querySelector(".body3-fonts.pokemon-description").textContent =
            flavorText;

            // Icons to left and right pokemon with querySelector
            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
            document.querySelector(sel)
            );

            // Removing listener of the icons
            leftArrow.removeEventListener("click", navigatePokemon);
            rightArrow.removeEventListener("click", navigatePokemon);

            // Returning pokemons
            if (id !== 1) {
                leftArrow.addEventListener("click", () => {
                // calling another function with less
                navigatePokemon(id - 1);
                });
            }
            // Advancing pokemons
            if (id !== 151) {
                rightArrow.addEventListener("click", () => {
                // calling another function with plus
                navigatePokemon(id + 1);
                });
            }

            // Avoiding the refresh
            window.history.pushState({}, "", `./detail.html?id=${id}`);
        }

        // Returning true
        return true

    } catch (error) {

        // Handling with the error
        console.error("An error occured while fetching Pokemon data:", error);
        return false
        
    }
}

// Navigating between pokemons
async function navigatePokemon(id){

    // currentPokemonId equals to the id of the parameter's function
    currentPokemonId = id

    // calling the loadPokemon again
    await loadPokemon(id)

}

// Repository of colors
const typeColors = {

    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",

}

// Increasing the speed to setStyles in Elements
function setElementStyles(elements, cssProperty, value){

    elements.forEach((element)=>{
        element.style[cssProperty] = value
    })

}

// Changing rgba to hexadecimal
function rgbaFromHex(hexColor){

    return [
        parseInt(hexColor.slice(1, 3), 16),
        parseInt(hexColor.slice(3, 5), 16),
        parseInt(hexColor.slice(5, 7), 16)
    ].join(", ")

}

// Setting the backgroundColor to pokemon page
function setTypeBackgroundColor(pokemon){

    // mainType is equals to search in pokemon's data
    const mainType = pokemon.types[0].type.name

    // color receive the mainType in repository above
    const color = typeColors[mainType]

    // Handling with error
    if (!color){
        console.warn(`Color not defined for type: ${mainType}`)
        return
    }

    // Detail Area
    const detailMainElement = document.querySelector(".detail-main")

    // Using function to style: Detail Area
    setElementStyles([detailMainElement], "backgroundColor", color)

    // Using function to style: Detail Area
    setElementStyles([detailMainElement], "borderColor", color)
    
    // Using function to style: Power Area
    setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", color)

    // Using function to style: Stat Area
    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), "color", color)

    // Using function to style: Progress Area
    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "color", color)

    // Changing rgba to hex
    const rgbaColor = rgbaFromHex(color)

    // Creating a style to insert in HTML and CSS
    const styleTag = document.createElement("style")
    styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.5);
        }
        .stats-wrap .progress-bar::-webkit-progress-value {
            background-color: rgba(${color});
        }
    `
    // Appending this styleTag in the head of the document
    document.head.appendChild(styleTag)

}

// Letting the first letter in upperCase
function capitalizeFirstLetter(string){

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

}

// Function to create an element (tag), append with your parent and putting options
function createAndAppendElement(parent, tag, options = {}){
    const element = document.createElement(tag)
    Object.keys(options).forEach((key)=>{
        element[key] = options[key]
        parent.appendChild(element)
        return element
    })
}

// Displaying pokemons
function displayPokemonDetails(pokemon){

    // Getting name, id, types, weight, height, abilities and stats from the object pokemon
    const {name, id, types, weight, height, abilities, stats} = pokemon

    // Letting the first letter in upperCase()
    const capitalizePokemonName = capitalizeFirstLetter(name)

    // Putting the name of the pokemon in title
    document.querySelector("title").textContent = capitalizePokemonName

    // Adding a CSS class to the HTML element with the "detail-main" class
    const detailMainElement = document.querySelector(".detail-main")
    detailMainElement.classList.add(name.toLowerCase())

    // Setting the name in HTML
    document.querySelector(".name-wrap .name").textContent = capitalizePokemonName

    // Setting the id in HTML
    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`

    // Setting the src and alt to the img in HTML
    const imageElement = document.querySelector(".detail-img-wrapper img")
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
    imageElement.alt = name

    // Type Area
    const typeWrapper = document.querySelector(".power-wrapper")
    typeWrapper.innerHTML = ""

    // Classification and about
    types.forEach(({type})=>{
        createAndAppendElement(typeWrapper, "p", {
            className: `body3-fonts type ${type.name}`,
            textContent: type.name
        })
    })

    // Pokemon's weight
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight").textContent = `${weight / 10} kg`

    // Pokemon's height
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent = `${height / 10} m`

    // Pokemon's abilities
    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move")

    abilities.forEach(({ability})=>{
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
            textContent: ability.name,
        })
    })

    // Pokemon's stats
    const statsWrapper = document.querySelector(".stats-wrapper")
    // Cleaning the stats
    statsWrapper.innerHTML = ""

    // Repository of stats
    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",   
    }

    // For each stats, there's a name, number and progress
    stats.forEach(({stat, base_stat})=>{
        // Creating div
        const statDiv = document.createElement("div")
        statDiv.className = "stats-wrap"
        statsWrapper.appendChild(statDiv)

        // Stat's name
        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name],
        })

        // Stat's number
        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        })

        // Stat's progress
        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        })
    })

    // Setting the Pokemon's background
    setTypeBackgroundColor(pokemon)

}

// Correcting text in English
function getEnglishFlavorText(pokemonSpecies){

    for (let entry of pokemonSpecies.flavor_text_entries){
        if (entry.language.name === "en"){
            let flavor = entry.flavor_text.replace(/\f/g, "")
            return flavor
        }
    }

    return ""

}