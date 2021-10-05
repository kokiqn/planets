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

    this._loading = document.querySelector('progress');
    this._startLoading()
    this._load()
      .then(data => this._create(data))
      .then(() => this._stopLoading());

    this.emit(Application.events.READY);
  }

  async _load() {
    const urls = Array.from({
        length: 7
      },
      (v, i) => `https://swapi.boom.dev/api/planets?page=${i + 1}`);

    const promises = urls.map(url => fetch(url)
      .then(res => res.json())
      .then(data => data.results));

    const planetData = await Promise.all(promises)
    return planetData.flat();
  }
  
    //here should be moved the rendering of the boxes, I suppose by establishing a connection with _render()
  _create(data) {
    data.forEach(({ name, terrain, population }) => {
      const box = document.createElement("div");
      box.classList.add("box");
      
      box.innerHTML = this._render({
        name,
        terrain,
        population,
      });
      
      document.body.querySelector(".main").appendChild(box);
    })
  }

  _render({ name, terrain, population, }) {
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

  // we can leave these two alone for now
  _startLoading() {
    this._loading.style.visibility = 'visible';
  }

  _stopLoading() {
    this._loading.style.visibility = 'hidden';
  }


}
