import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._load();
    this._startLoading();
    this._stopLoading();

    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._create({
      name: "Placeholder",
      terrain: "placeholder",
      population: 0,
    });

    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
  }

  async _load() {
    async function getPlanets() {
      const urls = Array.from({ length: 7 },
        (v, i) => `https://swapi.boom.dev/api/planets?page=${i + 1}`);

      const promises = urls.map(url => fetch(url)
        .then(res => res.json())
        .then(data => data.results));
        
      const planetData = (await Promise.all(promises)).flat();
      console.log(`Results for ${planetData.length} planets downloaded...`);
      console.log('Results:', planetData);
    }
    getPlanets()
  }

  _create({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  _startLoading() {}

  _stopLoading() {}
  
}
