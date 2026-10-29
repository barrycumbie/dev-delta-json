console.log("loading script file?");

const API_URL = 'https://dog.ceo/api/breeds/image/random';
const dogPicUrl = ''; 

document
  .querySelector("#btnCreateProfile")
  .addEventListener("click", createUserProfile);

async function createUserProfile(e) {
  e.preventDefault();
  // document.querySelector('#profileForm');

  //todo: defensive programming...check if nothing is there... 
  //if(!nameInput)...
  const nameInput = document.querySelector("#nameInput").value;
  const favoriteInput = document.querySelector("#favoriteInput").value;
  const commentInput = document.querySelector("#commentInput").value;

  const dogPicUrl = await getApiData(); 


  const userData = {
    name: nameInput,
    favorite: favoriteInput,
    comment: commentInput,
    dogpic: dogPicUrl.message
  };

  console.log('userData object ', userData);


  const json = JSON.stringify(userData);

  sessionStorage.setItem("userData", json);
}

async function getApiData() {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  const data = await response.json();

  console.log('getApiData: ', data.message);

  return data; 
}


async function loadOptions() {
  const response = await fetch("assets/data/data.json");

  if (!response.ok) {
    throw new Error("Could not load local JSON");
  }

  const data = await response.json();

  console.log("json data: ", data);

  const favorite = document.querySelector("#favoriteInput");
  let newOption;

  data.forEach((choice) => {
    newOption = new Option(choice.name, choice.id);
    favorite.appendChild(newOption);
  });
}
loadOptions();


document.querySelector("#btnLoadProfile")
  .addEventListener('click', loadProfile); 

function loadProfile() {
  const saved = sessionStorage.getItem("userData");
  const userData = JSON.parse(saved);
  console.log('session saved user data: ', userData);
  //document.querySelector("#imgTest").src = userData.docpic; 


}

