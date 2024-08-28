export class Client {
  baseURL: String;
  accessToken: String;

  constructor(baseURL: String, accessToken: String) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
  }

  async request(path: String, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    headers.append("x-access-token", this.accessToken.toString());
    headers.append("Content-Type", "application/json");

    const response = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers,
    });

    const body = await this.getBody(response);

    if (!response.ok) {
      throw body;
    } else {
      return body;
    }
  }

  private async getBody(response: Response) {
    const contentType = response.headers.get("Content-Type")?.toLowerCase();

    if (contentType === "application/json") {
      return response.json();
    }

    if (contentType === "application/pdf") {
      return Buffer.from(await response.arrayBuffer());
    }

    throw new Error(`Unrecognized content type: ${contentType}`);
  }
}
