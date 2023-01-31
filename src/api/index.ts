class Api {
  constructor(private server: string) {}

  async getRequest(url: string) {
    return await fetch(this.server + url).then((response) => response.json());
  }

  async postRequest(url: string, data: Record<string, any>) {
    return await fetch(this.server + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }
}

export const api = new Api("http://localhost:5000");
