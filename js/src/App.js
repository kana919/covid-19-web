export class App {
  constructor() {
    try {
      const infectionInfo = fetchInfectionInfo();
      infectionInfo.then(infectionInfo => {
        console.log(infectionInfo);
      });
    } catch (error) {
      console.error(`${error}`);
    }
  }
}

function fetchInfectionInfo() {
  return fetch(`http://localhost:8000/stats/infection`, {
    method: 'GET',
    mode: 'cors'
  })
  .then(response => {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
    } else {
      return response.json();
    }
  });
}
