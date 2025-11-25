import { useState } from "react";
import pokemonLogo from "./assets/PokemonLogo.svg";
import CustomTabButton from "./common/CustomTabButton";

const Pokemon = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonSprite, setPokemonSprite] = useState(pokemonLogo);
  const [pokemonSprite1, setPokemonSprite1] = useState();
  const [firstAbility, setFirstAbility] = useState("");
  const [secondAbility, setSecondAbility] = useState("");
  const [activeTab, setActiveTab] = useState("default");
  const [validPokemon, setValidPokemon] = useState(true);
  const [hasInput, setHasInput] = useState(true);
  const [showAbilities, setShowAbilities] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");
  const [skillUsed, setSkillUsed] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [pokemonSummary, setPokemonSummary] = useState("");

  const fetchPokemonData = async () => {
    try {
      if (!pokemonInputValue) {
        setHasInput(false);
        setValidPokemon(true);
        return;
      }

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonInputValue.toLowerCase()}`
      );

      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonInputValue.toLowerCase()}`
      );

      setLoading(true);

      if (!response.ok) {
        setValidPokemon(false);
        setShowAbilities(false);
        setPokemonSprite(pokemonLogo);
        setPokemonSprite1("");
        setPokemonName("");
        setFirstAbility("");
        setSecondAbility("");
        setSkillUsed("");
        throw new Error("Couldn't fetch pokemon");
      }

      const data = await response.json();
      const speciesData = await speciesResponse.json();
      setShowAbilities(true);
      setValidPokemon(true);
      setHasInput(true);
      setPokemonSprite(data.sprites.front_default);
      setPokemonSprite1(data.sprites.other.showdown.front_default);
      setPokemonName(data.name);
      setFirstAbility(data.abilities[0]?.ability?.name);
      setSecondAbility(data.abilities[1]?.ability?.name);

      const englishEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      setPokemonSummary(englishEntry.flavor_text.replace(/\s+/g, " "));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerMessage = () => {
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const resetPokemon = () => {
    setPokemonName("");
    setPokemonSprite(pokemonLogo);
    setPokemonSprite1("");
    setFirstAbility("");
    setSecondAbility("");
    setActiveTab("default");
    setValidPokemon(true);
    setHasInput(true);
    setShowAbilities(false);
    setPokemonInputValue("");
    setSkillUsed("");
    setLoading(false);
    setPokemonSummary("");
  };

  return (
    <div className="bg-[#030712] h-screen flex-col flex items-center justify-center gap-2">
      <div className="flex flex-col items-center justify-center border-2 gap-1 border-[#e9e9ea] rounded-xl w-86 h-96">
        {activeTab === "default" ? (
          <img src={pokemonSprite} alt="Pokemon Sprite" className="w-48 h-48" />
        ) : (
          <img
            src={pokemonSprite1}
            alt="Pokemon Sprite"
            className="w-48 h-48"
          />
        )}

        <div className="flex">
          <p className="text-[#e9e9ea] font-bold capitalize mr-1">
            {pokemonName}
          </p>
          {showMessage && <span className="text-[#e9e9ea]">{skillUsed}</span>}
        </div>

        {pokemonSummary && (
          <p className="text-[#e9e9ea] text-sm px-4 text-center">
            {pokemonSummary}
          </p>
        )}

        {showAbilities && (
          <div className="flex pt-4">
            <CustomTabButton
              width="w-28"
              textSize="text-sm"
              rounded="rounded-l-xl"
              activeColor="text-white"
              inactiveColor="text-gray-600"
              text="Default"
              isActive={activeTab === "default"}
              onClick={() => setActiveTab("default")}
            />

            <CustomTabButton
              width="w-28"
              textSize="text-sm"
              rounded="rounded-r-xl"
              activeColor="text-white"
              inactiveColor="text-gray-600"
              text="Showdown"
              isActive={activeTab === "showdown"}
              onClick={() => setActiveTab("showdown")}
            />
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Search for your favorite pokemon!"
        value={pokemonInputValue}
        className="border-2 text-[#e9e9ea] text-md rounded-2xl px-2 py-1 placeholder:text-xs"
        onChange={(e) => {
          setPokemonInputValue(e.target.value);
          setHasInput(true);
          setValidPokemon(true);
          setSkillUsed("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchPokemonData();
            setPokemonInputValue("");
          }
        }}
      />

      {loading && <p className="text-yellow-400">Loading Pokémon...</p>}

      {!hasInput && (
        <p className="text-red-700">
          Which Pokémon are you looking for? Enter its name and find out!
        </p>
      )}

      {!validPokemon && pokemonInputValue && (
        <p className="text-red-700">
          Oops! "{pokemonInputValue}" is not a valid Pokémon name. Please try
          again.
        </p>
      )}

      {showAbilities && (
        <>
          <p className="text-[#e9e9ea] font-bold">Use Skills: </p>
          <div className="flex gap-1 justify-center content-center items-center">
            <button
              className="text-[#e9e9ea] border-2 p-2 rounded-4xl cursor-pointer hover:scale-110"
              onClick={() => {
                setSkillUsed(`used ${firstAbility}!`);
                triggerMessage();
              }}
            >
              {firstAbility}
            </button>

            <button
              className="text-[#e9e9ea] border-2 p-2 rounded-4xl cursor-pointer hover:scale-110"
              onClick={() => {
                setSkillUsed(`used ${secondAbility}!`);
                triggerMessage();
              }}
            >
              {secondAbility}
            </button>
          </div>
        </>
      )}

      <button aria-label="Search for Pikachu"
        className="text-[#e9e9ea] border-2 px-4 py-2 rounded-4xl cursor-pointer hover:scale-110"
        onClick={() => {
          fetchPokemonData();
          setPokemonInputValue("");
        }}
      >
        Search Pokémon
      </button>

      <button
        className="text-[#e9e9ea] border-2 px-4 py-2 rounded-4xl cursor-pointer hover:scale-110"
        onClick={() => {
          resetPokemon();
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default Pokemon;
