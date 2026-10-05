import { resolveAssetUrl } from "./fileDownload";

describe("resolveAssetUrl", () => {
  it("keeps absolute URLs unchanged", () => {
    expect(resolveAssetUrl("http://localhost:4444/host/resume/file.pdf")).toBe(
      "http://localhost:4444/host/resume/file.pdf"
    );
  });

  it("prefixes the backend base URL for relative file paths", () => {
    expect(resolveAssetUrl("/host/resume/file.pdf", "http://localhost:4444")).toBe(
      "http://localhost:4444/host/resume/file.pdf"
    );
  });
});
