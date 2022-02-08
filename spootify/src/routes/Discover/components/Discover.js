import React, { Component } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import config from "../../../config";
import "../styles/_discover.scss";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
    };
  }

  async componentDidMount() {
    let token = localStorage.getItem("token");
    const tokenExpirationDate = Number(
      localStorage.getItem("tokenExpirationDate")
    );
    const {
      api: { authUrl, clientId, clientSecret },
    } = config;

    const now = Date.now();
    if (!token || (tokenExpirationDate && now >= tokenExpirationDate)) {
      const Authorization = `Basic ${btoa(clientId + ":" + clientSecret)}`;
      const body = new URLSearchParams({ grant_type: "client_credentials" });

      const headers = {
        Authorization,
        "Content-Type": "application/x-www-form-urlencoded",
      };

      const response = await fetch(authUrl, {
        method: "POST",
        headers,
        body,
      });
      const { access_token, expires_in } = await response.json();

      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expires_in);

      localStorage.setItem("token", access_token);
      localStorage.setItem("tokenExpirationDate", expirationDate.getTime());
    }

    const resources = [
      {
        name: "newReleases",
        path: "new-releases",
        getList: (json) => json?.albums?.items,
      },
      {
        name: "playlists",
        path: "featured-playlists",
        getList: (json) => json?.playlists?.items,
      },
      {
        name: "categories",
        path: "categories",
        getList: (json) => json?.categories?.items,
      },
    ];
    await Promise.all(
      resources.map(({ name, path, getList }) =>
        this.fetchResource(path).then((json) => {
          this.setState({ [name]: getList(json) });
        })
      )
    );
  }

  async fetchResource(resource) {
    const Authorization = "Bearer " + localStorage.getItem("token");
    const {
      api: { baseUrl },
    } = config;

    const response = await fetch(`${baseUrl}/browse/${resource}`, {
      method: "GET",
      headers: {
        Authorization,
      },
    });
    return response.json();
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
        />
      </div>
    );
  }
}
