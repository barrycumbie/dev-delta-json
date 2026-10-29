// These names match IDs in index.html. querySelector("#...") finds the
// element whose id matches the text after the #.
const optionsButton = document.querySelector("#btnLoadOptions");
const optionsStatus = document.querySelector("#optionsStatus");
const optionsList = document.querySelector("#optionsList");
const favoriteInput = document.querySelector("#favoriteInput");

const userDataForm = document.querySelector("#userDataForm");
const userNameInput = document.querySelector("#userNameInput");
const userCommentInput = document.querySelector("#userCommentInput");
const userDataOutput = document.querySelector("#userDataOutput");

const saveUserDataButton = document.querySelector("#btnSaveUserData");
const readUserDataButton = document.querySelector("#btnReadUserData");
const storageStatus = document.querySelector("#storageStatus");
const storageOutput = document.querySelector("#storageOutput");

const dogButton = document.querySelector("#btnLoadDog");
const dogStatus = document.querySelector("#dogStatus");
const dogOutput = document.querySelector("#dogOutput");

const profileForm = document.querySelector("#profileForm");
const profileNameInput = document.querySelector("#nameInput");
const profileCommentInput = document.querySelector("#commentInput");
const createProfileButton = document.querySelector("#btnCreateProfile");
const profileStatus = document.querySelector("#profileStatus");
const clearSessionButton = document.querySelector("#btnClearSession");
const profileSection = document.querySelector("#profileSection");
const profileContent = document.querySelector("#profileContent");

const OPTIONS_URL = "assets/data/data.json";
const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";
const USER_DATA_KEY = "teachingUserData";
const PROFILE_KEY = "sessionProfile";

// These variables hold data while this page is open. They are separate from
// sessionStorage: refresh the page and these variables are created again.
let localOptions = [];
let userData = null;

// Each listener connects one visible button/form to one example function.
optionsButton.addEventListener("click", loadLocalOptions);
userDataForm.addEventListener("submit", buildUserData);
saveUserDataButton.addEventListener("click", saveUserData);
readUserDataButton.addEventListener("click", readUserData);
dogButton.addEventListener("click", loadDogImage);
profileForm.addEventListener("submit", buildCombinedProfile);
clearSessionButton.addEventListener("click", clearCombinedProfile);

// This only restores the final challenge. The four teaching examples above
// still wait for their own buttons to be clicked.
restoreCombinedProfile();

// STEP 1: Load a local JSON file and put the results in the DOM.
async function loadLocalOptions() {
  optionsButton.disabled = true;
  showStatus(optionsStatus, "Requesting the local JSON file…");

  try {
    // fetch() returns a Promise, so await pauses here until the response arrives.
    const response = await fetch(OPTIONS_URL);

    // fetch() can resolve even for HTTP errors such as 404, so check .ok.
    if (!response.ok) {
      throw new Error(`Could not load local JSON (HTTP ${response.status}).`);
    }

    // .json() reads the response body and parses JSON text into JS arrays/objects.
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("The local JSON should contain a non-empty array.");
    }

    localOptions = data;
    renderLocalOptions(data);
    fillFavoriteMenu(data);
    showStatus(optionsStatus, `Loaded ${data.length} favorites.`);
  } catch (error) {
    showStatus(optionsStatus, `Could not load favorites. ${error.message}`, true);
  } finally {
    // Re-enable the button even if the request or JSON parsing failed.
    optionsButton.disabled = false;
  }
}

function renderLocalOptions(choices) {
  optionsList.replaceChildren();

  // forEach() runs once for each choice in the array.
  choices.forEach((choice) => {
    const item = document.createElement("li");
    item.textContent = `${choice.emoji} ${choice.name}`;
    optionsList.append(item);
  });
}

function fillFavoriteMenu(choices) {
  // replaceChildren() removes the placeholder or any options from a prior load.
  favoriteInput.replaceChildren(new Option("Choose a favorite", ""));

  choices.forEach((choice) => {
    // A select's value is text, so convert the numeric JSON id to a string.
    favoriteInput.add(new Option(`${choice.emoji} ${choice.name}`, String(choice.id)));
  });

  favoriteInput.disabled = false;
  createProfileButton.disabled = false;
}

// STEP 2: Read form values and decide the shape of a JS object.
function buildUserData(event) {
  // Forms normally navigate/reload the page. Prevent that for this demo.
  event.preventDefault();

  // .value reads the current text; .trim() removes extra spaces at the ends.
  userData = {
    name: userNameInput.value.trim(),
    comment: userCommentInput.value.trim(),
  };

  // The object can be inspected in DevTools and is shown on the page as text.
  console.log("Step 2 user data object:", userData);
  userDataOutput.textContent = JSON.stringify(userData, null, 2);
}

// STEP 3A: Use a local sample object so this storage example is independent.
function saveUserData() {
  try {
    const sampleObject = {
      name: "Garfield",
      favorite: "lasagna",
    };

    // sessionStorage stores strings. JSON.stringify converts an object to JSON text.
    const jsonText = JSON.stringify(sampleObject);
    sessionStorage.setItem(USER_DATA_KEY, jsonText);
    storageOutput.textContent = JSON.stringify(sampleObject, null, 2);
    showStatus(storageStatus, "Saved the sample under the teachingUserData key.");
  } catch (error) {
    showStatus(storageStatus, `Could not save the object. ${error.message}`, true);
  }
}

// STEP 3B: Read the stored text and turn it back into an object.
function readUserData() {
  try {
    // getItem() returns a string, or null when the key is not present.
    const jsonText = sessionStorage.getItem(USER_DATA_KEY);
    if (jsonText === null) {
      showStatus(storageStatus, "Nothing is saved yet. Save the sample object first.", true);
      return;
    }

    // JSON.parse converts JSON text back into a JavaScript value/object.
    const savedObject = JSON.parse(jsonText);
    console.log("Step 3 object restored from sessionStorage:", savedObject);
    storageOutput.textContent = JSON.stringify(savedObject, null, 2);
    showStatus(storageStatus, "Read and parsed the saved object.");
  } catch (error) {
    showStatus(storageStatus, `Could not read the saved object. ${error.message}`, true);
  }
}

// STEP 4: Make a separate request to the external Dog CEO API.
async function loadDogImage() {
  dogButton.disabled = true;
  showStatus(dogStatus, "Requesting a random dog image…");

  try {
    const data = await requestDogData();
    console.log("Step 4 Dog CEO API response:", data);

    // Inspect the response shape, then use its "message" property as the image URL.
    renderDogImage(dogOutput, data.message);
    showStatus(dogStatus, "Image URL found at data.message.");
  } catch (error) {
    showStatus(dogStatus, `Could not get a dog image. ${error.message}`, true);
  } finally {
    dogButton.disabled = false;
  }
}

function renderDogImage(container, imageUrl, clearContainer = true) {
  // The standalone API demo replaces its prior result; the profile appends
  // the image after its name, favorite, and comment.
  if (clearContainer) {
    container.replaceChildren();
  }

  const image = document.createElement("img");
  image.className = "dog-image";
  image.src = imageUrl;
  image.alt = "A randomly selected dog";
  image.loading = "lazy";

  container.append(image);
}

// FINAL CHALLENGE: combine values from the form, local JSON, and public API.
async function buildCombinedProfile(event) {
  event.preventDefault();

  // The challenge can load its own local data if Step 1 has not been run yet.
  if (localOptions.length === 0) {
    try {
      await loadOptionsForChallenge();
    } catch (error) {
      showStatus(profileStatus, `Could not load favorites. ${error.message}`, true);
      return;
    }
  }

  const selectedOption = localOptions.find(
    (option) => String(option.id) === favoriteInput.value,
  );
  if (!selectedOption) {
    showStatus(profileStatus, "Choose one of the loaded favorites.", true);
    return;
  }

  createProfileButton.disabled = true;
  showStatus(profileStatus, "Fetching API data and saving the combined object…");

  try {
    const dogData = await requestDogData();

    // This object is the point where three separate sources become app state.
    const sessionProfile = {
      user: {
        name: profileNameInput.value.trim(),
        comment: profileCommentInput.value.trim(),
      },
      selection: {
        id: selectedOption.id,
        name: selectedOption.name,
        emoji: selectedOption.emoji,
      },
      api: {
        imageUrl: dogData.message,
      },
    };

    console.log("Combined session profile:", sessionProfile);

    // Storage only accepts strings, so stringify before writing the object.
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(sessionProfile));

    // Read back and parse the stored version; render from that, not the original.
    const savedProfile = JSON.parse(sessionStorage.getItem(PROFILE_KEY));
    renderProfile(savedProfile);
    showStatus(profileStatus, "Combined profile saved and rendered from storage.");
  } catch (error) {
    showStatus(profileStatus, `Could not build the profile. ${error.message}`, true);
  } finally {
    createProfileButton.disabled = false;
  }
}

async function loadOptionsForChallenge() {
  showStatus(profileStatus, "Loading local favorites for the challenge…");

  const response = await fetch(OPTIONS_URL);
  if (!response.ok) {
    throw new Error(`Could not load local JSON (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("The local JSON should contain a non-empty array.");
  }

  localOptions = data;
  renderLocalOptions(data);
  fillFavoriteMenu(data);
}

async function requestDogData() {
  const response = await fetch(DOG_API_URL);
  if (!response.ok) {
    throw new Error(`The API request failed (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (data.status !== "success" || typeof data.message !== "string") {
    throw new Error("The API returned data in an unexpected format.");
  }

  return data;
}

function renderProfile(profile) {
  profileContent.replaceChildren();

  const name = document.createElement("p");
  name.textContent = `Hello, ${profile.user.name}!`;

  const favorite = document.createElement("p");
  favorite.textContent =
    `Favorite: ${profile.selection.emoji ?? ""} ${profile.selection.name}`;

  const comment = document.createElement("p");
  comment.textContent = profile.user.comment || "No comment provided.";

  profileContent.append(name, favorite, comment);
  renderDogImage(profileContent, profile.api.imageUrl, false);
  profileSection.hidden = false;
}

// SUPER ADVANCED: storage survives a refresh in this tab, so read it at startup.
function restoreCombinedProfile() {
  try {
    const jsonText = sessionStorage.getItem(PROFILE_KEY);
    if (jsonText === null) {
      return;
    }

    const savedProfile = JSON.parse(jsonText);
    if (
      !savedProfile ||
      typeof savedProfile.user?.name !== "string" ||
      typeof savedProfile.user?.comment !== "string" ||
      typeof savedProfile.selection?.name !== "string" ||
      typeof savedProfile.api?.imageUrl !== "string"
    ) {
      throw new Error("The saved profile has an unexpected format.");
    }

    renderProfile(savedProfile);
    showStatus(profileStatus, "Restored the saved profile from this tab's session.");
  } catch (error) {
    showStatus(profileStatus, `Could not restore the saved profile. ${error.message}`, true);
  }
}

function clearCombinedProfile() {
  try {
    // removeItem() clears this example's key without erasing the Step 3 example.
    sessionStorage.removeItem(PROFILE_KEY);
    profileContent.replaceChildren();
    profileSection.hidden = true;
    profileForm.reset();
    showStatus(profileStatus, "Combined profile cleared.");
  } catch (error) {
    showStatus(profileStatus, `Could not clear the combined profile. ${error.message}`, true);
  }
}

function showStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("status-error", isError);
}
